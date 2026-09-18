import type { Metadata, Viewport } from 'next';
import {
  Inter,
  Geist,
  Source_Serif_4,
  JetBrains_Mono,
  Newsreader,
  EB_Garamond,
  Lora,
  Plus_Jakarta_Sans,
  IBM_Plex_Mono,
} from 'next/font/google';
import './globals.css';
import PWARegistration from '@/components/PWARegistration';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Writely',
  description:
    'A beautiful, private, local-first note-taking app. Distraction-free, fast, and always with you.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Writely',
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23FAF6EE'/%3E%3Cpath d='M16 18 L24 46 L32 26 L40 46 L48 18' stroke='%239C5B2B' stroke-width='6.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E",
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF6EE' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0F19' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geist.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} ${newsreader.variable} ${ebGaramond.variable} ${lora.variable} ${plusJakartaSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
      data-theme="paper"
      data-font="sans-sfpro"
    >
      <head>
        {/* Inline script to prevent theme/font flash and set matching theme favicon immediately */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('writely_theme') || 'paper';
                  var savedFont = localStorage.getItem('writely_font_family') || 'sans-sfpro';
                  var savedFontSize = localStorage.getItem('writely_font_size') || 'base';
                  document.documentElement.setAttribute('data-theme', savedTheme);
                  document.documentElement.setAttribute('data-font', savedFont);
                  document.documentElement.setAttribute('data-font-size', savedFontSize);

                  var palette = {
                    paper: { bg: '#FAF6EE', fg: '#9C5B2B' },
                    light: { bg: '#FFFFFF', fg: '#2563EB' },
                    dark: { bg: '#18181B', fg: '#60A5FA' },
                    midnight: { bg: '#0B0F19', fg: '#38BDF8' },
                    nordic: { bg: '#2E3440', fg: '#88C0D0' },
                    matcha: { bg: '#ECF1EC', fg: '#2E6B47' },
                    rosewater: { bg: '#F3EBEB', fg: '#9E4D60' },
                    oled: { bg: '#000000', fg: '#FFFFFF' }
                  };
                  var colors = palette[savedTheme] || palette.paper;
                  var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='16' fill='" + colors.bg + "'/><path d='M16 18 L24 46 L32 26 L40 46 L48 18' stroke='" + colors.fg + "' stroke-width='6.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/></svg>";
                  var link = document.querySelector("link[rel*='icon']");
                  if (link) {
                    link.type = 'image/svg+xml';
                    link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="h-full w-full overflow-hidden flex flex-col selection:bg-amber-200/50 dark:selection:bg-amber-800/40">
        <PWARegistration />
        {children}
      </body>
    </html>
  );
}
