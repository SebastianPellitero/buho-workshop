// ─── Enums ────────────────────────────────────────────────────────────────────

export type Size = "S" | "M" | "L";

export type OrderStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  variantId: string;
  productName: string;
  color: string;
  size: Size;
  price: number;
  quantity: number;
  image: string;
}

export interface CartState {
  items: CartItem[];
}

// ─── Products ─────────────────────────────────────────────────────────────────

export interface FilamentDTO {
  id: string;
  name: string;
  hexCode: string;
  stockGrams: number;
}

export interface VariantDTO {
  id: string;
  size: Size;
  priceMultiplier: number;
  stockQty: number;
  filament: FilamentDTO;
}

export interface ProductSummary {
  id: string;
  name: string;
  description: string;
  images: string[];
  basePrice: number;
  categorySlug: string;
}

export interface ProductDetail extends ProductSummary {
  variants: VariantDTO[];
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface AddressPayload {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderPayload {
  items: CartItem[];
  email: string;
  address: AddressPayload;
  userId?: string;
}

export interface OrderItemDTO {
  id: string;
  variantId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface OrderDTO {
  id: string;
  status: OrderStatus;
  total: number;
  email: string;
  address: AddressPayload;
  items: OrderItemDTO[];
  createdAt: string;
}

// ─── API response envelope ────────────────────────────────────────────────────

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };
