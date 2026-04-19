import { PrismaClient, Size } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Categories
  const cat3d = await prisma.category.upsert({
    where: { slug: "3d-prints" },
    update: {},
    create: { slug: "3d-prints", name: "3D Prints" },
  });

  const catMontessori = await prisma.category.upsert({
    where: { slug: "montessori" },
    update: {},
    create: { slug: "montessori", name: "Montessori" },
  });

  // Filaments
  const filaments = await Promise.all([
    prisma.filament.upsert({
      where: { id: "fil-red" },
      update: {},
      create: {
        id: "fil-red",
        name: "Crimson Red",
        hexCode: "#DC2626",
        stockGrams: 850,
      },
    }),
    prisma.filament.upsert({
      where: { id: "fil-blue" },
      update: {},
      create: {
        id: "fil-blue",
        name: "Ocean Blue",
        hexCode: "#2563EB",
        stockGrams: 1200,
      },
    }),
    prisma.filament.upsert({
      where: { id: "fil-green" },
      update: {},
      create: {
        id: "fil-green",
        name: "Forest Green",
        hexCode: "#16A34A",
        stockGrams: 600,
      },
    }),
    prisma.filament.upsert({
      where: { id: "fil-natural" },
      update: {},
      create: {
        id: "fil-natural",
        name: "Natural White",
        hexCode: "#F5F5F0",
        stockGrams: 0, // out of stock — tests the "hide out-of-stock colors" flow
      },
    }),
  ]);

  const [red, blue, green] = filaments;

  // 3D Print products (base price €8–€35)
  const products3d = [
    {
      id: "prod-vase",
      name: "Geometric Vase",
      description:
        "A modern geometric vase with a honeycomb lattice pattern. Waterproof-coated inside. Perfect for dried flowers or as a standalone decorative piece.",
      images: ["/images/vase-1.jpg", "/images/vase-2.jpg"],
      basePrice: 12,
    },
    {
      id: "prod-organizer",
      name: "Desk Organizer",
      description:
        "Modular desktop organizer with compartments for pens, cables, and small items. Stackable design allows you to build the configuration you need.",
      images: ["/images/organizer-1.jpg", "/images/organizer-2.jpg"],
      basePrice: 18,
    },
    {
      id: "prod-planter",
      name: "Hanging Planter",
      description:
        "Minimalist wall-mounted planter for succulents and small plants. Comes with mounting hardware. Drainage hole included.",
      images: ["/images/planter-1.jpg", "/images/planter-2.jpg"],
      basePrice: 22,
    },
  ];

  for (const p of products3d) {
    const product = await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: { ...p, categoryId: cat3d.id },
    });

    for (const filament of [red, blue, green]) {
      for (const size of [Size.S, Size.M, Size.L]) {
        const multiplier = size === Size.S ? 1.0 : size === Size.M ? 1.4 : 1.8;
        await prisma.productVariant.upsert({
          where: {
            id: `${product.id}-${filament.id}-${size}`,
          },
          update: {},
          create: {
            id: `${product.id}-${filament.id}-${size}`,
            productId: product.id,
            filamentId: filament.id,
            size,
            priceMultiplier: multiplier,
            stockQty: Math.floor(Math.random() * 15) + 3,
          },
        });
      }
    }
  }

  // Montessori products (base price €45–€120)
  const productsMontessori = [
    {
      id: "prod-shelf",
      name: "Montessori Book Shelf",
      description:
        "Low-height accessible bookshelf designed for children aged 1–4. Forward-facing display slots make it easy for toddlers to choose and return books independently.",
      images: ["/images/shelf-1.jpg", "/images/shelf-2.jpg"],
      basePrice: 65,
    },
    {
      id: "prod-table",
      name: "Activity Table",
      description:
        "Child-sized activity table with smooth rounded edges and adjustable leg height. Pairs with our Montessori Chair. Made from PLA+ with a matte finish.",
      images: ["/images/table-1.jpg", "/images/table-2.jpg"],
      basePrice: 95,
    },
    {
      id: "prod-tower",
      name: "Learning Tower",
      description:
        "Kitchen helper tower that brings toddlers safely to counter height. Wide anti-tip base, open front for easy entry, and adjustable platform.",
      images: ["/images/tower-1.jpg", "/images/tower-2.jpg"],
      basePrice: 120,
    },
  ];

  for (const p of productsMontessori) {
    const product = await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: { ...p, categoryId: catMontessori.id },
    });

    for (const filament of [red, blue, green]) {
      for (const size of [Size.S, Size.M, Size.L]) {
        const multiplier = size === Size.S ? 1.0 : size === Size.M ? 1.4 : 1.8;
        await prisma.productVariant.upsert({
          where: {
            id: `${product.id}-${filament.id}-${size}`,
          },
          update: {},
          create: {
            id: `${product.id}-${filament.id}-${size}`,
            productId: product.id,
            filamentId: filament.id,
            size,
            priceMultiplier: multiplier,
            stockQty: Math.floor(Math.random() * 8) + 2,
          },
        });
      }
    }
  }

  // Demo user (for testing authenticated flows)
  await prisma.user.upsert({
    where: { email: "demo@buhoworkshop.com" },
    update: {},
    create: {
      email: "demo@buhoworkshop.com",
      name: "Demo User",
      password: await bcrypt.hash("demo1234", 10),
      address: {
        line1: "123 Maker Street",
        city: "Amsterdam",
        postalCode: "1011 AB",
        country: "NL",
      },
    },
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
