// src/app/admin/page.tsx
import Image from "next/image";

export default function AdminDashboard() {
  return (
    // Zone de contenu fixe, calée à gauche sur la sidebar (md:left-64)
    <main className="fixed inset-y-0 left-0 right-0 md:left-64 z-0">
      {/* Hero plein écran dans la zone dispo */}
      <section className="relative h-full w-full overflow-hidden">
        {/* Image en background qui remplit toute la zone */}
        <Image
          src="/images/camping.jpg"
          alt="Vue du camping"
          fill
          priority
          className="object-cover"
        />

        {/* Voile pour contraste du texte */}
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

        {/* Texte centré */}
        <div className="relative z-10 flex h-full w-full items-center justify-center p-6 text-center">
          <h1 className="text-white font-bold drop-shadow-lg text-4xl md:text-6xl">
            Camping de la Charderie
          </h1>
        </div>
      </section>
    </main>
  );
}
