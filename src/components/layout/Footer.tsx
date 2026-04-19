export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-zinc-500">
        <p>&copy; {new Date().getFullYear()} Buho Workshop. All rights reserved.</p>
        <p className="mt-1">3D printed objects &amp; Montessori furniture, made with care.</p>
      </div>
    </footer>
  );
}
