import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { validateCartStock } from "@/lib/stock";
import { calculatePrice } from "@/lib/price";
import type { ApiResponse } from "@/types";

const addressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().length(2),
});

const cartItemSchema = z.object({
  variantId: z.string(),
  productName: z.string(),
  color: z.string(),
  size: z.enum(["S", "M", "L"]),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  image: z.string(),
});

const createOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  email: z.string().email(),
  address: addressSchema,
  userId: z.string().optional(),
});

interface CreateOrderResponse {
  orderId: string;
  clientSecret: string;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<ApiResponse<CreateOrderResponse>>(
      { data: null, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse<CreateOrderResponse>>(
      { data: null, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 }
    );
  }

  const { items, email, address, userId } = parsed.data;

  // Server-side stock validation
  const conflicts = await validateCartStock(items);
  if (conflicts.length > 0) {
    const names = conflicts.map((c) => c.productName).join(", ");
    return NextResponse.json<ApiResponse<CreateOrderResponse>>(
      {
        data: null,
        error: `Stock no longer available: ${names}`,
      },
      { status: 409 }
    );
  }

  // Calculate total server-side (never trust client price)
  const total = items.reduce((sum, item) => {
    const price = calculatePrice(item.price / (
      item.size === "S" ? 1.0 : item.size === "M" ? 1.4 : 1.8
    ), item.size);
    return sum + price * item.quantity;
  }, 0);

  try {
    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // cents
      currency: "eur",
      receipt_email: email,
      metadata: { email },
    });

    // Create order in DB (status PENDING until webhook confirms payment)
    const order = await prisma.order.create({
      data: {
        email,
        address,
        total,
        stripeId: paymentIntent.id,
        userId: userId ?? null,
        items: {
          create: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            priceAtPurchase: item.price,
          })),
        },
      },
    });

    return NextResponse.json<ApiResponse<CreateOrderResponse>>({
      data: { orderId: order.id, clientSecret: paymentIntent.client_secret! },
      error: null,
    });
  } catch {
    return NextResponse.json<ApiResponse<CreateOrderResponse>>(
      { data: null, error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// GET /api/orders — authenticated user order history (auth checked in Step 8)
export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json<ApiResponse<unknown>>(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json<ApiResponse<typeof orders>>({
      data: orders,
      error: null,
    });
  } catch {
    return NextResponse.json<ApiResponse<unknown>>(
      { data: null, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
