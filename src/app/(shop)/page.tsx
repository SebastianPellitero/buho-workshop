import Link from "next/link";

const categories = [
  {
    slug: "3d-prints",
    name: "3D Prints",
    description:
      "Custom objects printed in high-quality PLA filament. Pick your color and size.",
    emoji: "◻",
    priceFrom: "€8",
    accent: "bg-sky-50 border-sky-200 hover:border-sky-400",
    badge: "bg-sky-100 text-sky-700",
  },
  {
    slug: "montessori",
    name: "Montessori Furniture",
    description:
      "Thoughtfully designed wooden furniture for early childhood learning environments.",
    emoji: "⬡",
    priceFrom: "€45",
    accent: "bg-amber-50 border-amber-200 hover:border-amber-400",
    badge: "bg-amber-100 text-amber-700",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Buho Workshop
        </h1>
        <p className="mt-4 text-lg text-zinc-500 max-w-xl mx-auto">
          Handcrafted 3D printed objects and Montessori furniture — made with
          care, shipped with love.
        </p>
      </div>

      {/* Category cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className={`group flex flex-col gap-4 rounded-2xl border-2 p-8 transition-all ${cat.accent}`}
          >
            <div className="text-5xl">{cat.emoji}</div>
            <div>
              <span
                className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${cat.badge} mb-2`}
              >
                From {cat.priceFrom}
              </span>
              <h2 className="text-2xl font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                {cat.name}
              </h2>
              <p className="mt-2 text-zinc-500 leading-relaxed">
                {cat.description}
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-zinc-700 group-hover:gap-2 transition-all">
              Browse collection →
            </span>
          </Link>
        ))}
      </div>

      {/* Value props */}
      <div className="mt-20 grid gap-6 sm:grid-cols-3 text-center">
        {[
          { icon: "⬡", title: "Custom colors", body: "Choose from a range of filament colors, all in stock." },
          { icon: "◻", title: "Multiple sizes", body: "S, M, and L options with live pricing as you configure." },
          { icon: "✦", title: "Secure checkout", body: "Powered by Stripe — pay safely, track your order easily." },
        ].map((v) => (
          <div key={v.title} className="flex flex-col items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50 p-6">
            <span className="text-3xl">{v.icon}</span>
            <h3 className="font-semibold text-zinc-900">{v.title}</h3>
            <p className="text-sm text-zinc-500">{v.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
