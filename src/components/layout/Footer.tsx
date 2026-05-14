import { Link } from '@/i18n/routing';
import { ShoppingBag, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';

// Custom Brand Icons as SVGs since they were removed in Lucide 1.0
const Facebook = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const Instagram = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const Twitter = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const Youtube = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
);

export function Footer() {
  const t = useTranslations('Footer');
  const nt = useTranslations('Navbar');

  return (
    <footer className="bg-secondary/30 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-xl">
                <ShoppingBag className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Premium<span className="gradient-text">Store</span></span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t('description')}
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                <Link key={idx} href="#" className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6">{t('quickLinks')}</h4>
            <ul className="space-y-4">
              {[
                { name: nt('home'), href: '/' },
                { name: nt('shop'), href: '/shop' },
                { name: nt('categories'), href: '/categories' },
                { name: nt('about'), href: '/about' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href as any} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold mb-6">{t('support')}</h4>
            <ul className="space-y-4">
              {[
                { name: t('supportLinks.account'), href: '/profile' },
                { name: t('supportLinks.tracking'), href: '/orders' },
                { name: t('supportLinks.shipping'), href: '#' },
                { name: t('supportLinks.returns'), href: '#' },
                { name: t('supportLinks.faq'), href: '#' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href as any} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="font-bold">{t('newsletter')}</h4>
            <p className="text-muted-foreground text-sm">
              {t('newsletterDesc')}
            </p>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={t('placeholder')} 
                  className="pl-10 bg-background rounded-xl border-border/50 h-12 focus:ring-1"
                />
              </div>
              <Button className="w-full rounded-xl h-12 font-semibold">
                {t('subscribe')}
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PremiumStore. {t('rights')}</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary">{t('privacy')}</Link>
            <Link href="#" className="hover:text-primary">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

