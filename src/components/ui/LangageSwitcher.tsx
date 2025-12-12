"use client";

import { useLocale } from "next-intl";
import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
import { ChevronDown } from "lucide-react";

type Props = {
  direction?: "down" | "up";
};

export default function LanguageSwitcher({ direction = "down" }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Adapter aux langues réellement supportées (fr/en)
  const languages = [
    { code: "fr", label: "FR", flag: "🇫🇷" },
    { code: "en", label: "EN", flag: "🇬🇧" },
  ];

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  const handleSelect = (nextLocale: string) => {
    setIsOpen(false);
    if (nextLocale === locale) return;

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuPos =
    direction === "up"
      ? "absolute right-0 bottom-full mb-2"
      : "absolute right-0 mt-2";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton du switcher */}
      <button
        type="button"
        disabled={isPending}
        onClick={() => setIsOpen((o) => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all ${
          isOpen ? "bg-gray-50 border-gray-200" : ""
        }`}
      >
        <span className="text-lg leading-none">{currentLang.flag}</span>
        <span className="text-sm font-medium text-gray-700">
          {currentLang.label}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className={`${menuPos} absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50`}>
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                disabled={isPending}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  locale === lang.code
                    ? "text-green-700 font-bold bg-green-50"
                    : "text-gray-600"
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}