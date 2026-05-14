'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname, routing } from '@/i18n/routing';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onLanguageChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
  }

  const languages = {
    vi: { name: 'Tiếng Việt', flag: '🇻🇳' },
    en: { name: 'English', flag: '🇺🇸' },
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 border border-border/50">
          <Languages className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl p-2 bg-popover border border-border/50 shadow-xl">
        {routing.locales.map((cur) => (
          <DropdownMenuItem
            key={cur}
            onClick={() => onLanguageChange(cur)}
            className={`rounded-xl p-3 cursor-pointer flex items-center justify-between gap-4 ${
              locale === cur ? 'bg-primary/10 text-primary font-bold' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{languages[cur as keyof typeof languages].flag}</span>
              <span>{languages[cur as keyof typeof languages].name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
