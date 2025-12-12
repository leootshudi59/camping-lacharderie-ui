import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // Tes langues supportées
    locales: ['en', 'fr', 'es'],

    // Langue par défaut si aucune n'est détectée
    defaultLocale: 'en'
});

// Wrappers légers autour des APIs de navigation de Next.js
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);