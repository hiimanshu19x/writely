import { ThemeId, FontFamilyId, FontSizeId } from '@/types/note';

const KEYS = {
  THEME: 'writely_theme',
  FONT_FAMILY: 'writely_font_family',
  FONT_SIZE: 'writely_font_size',
  SIDEBAR_OPEN: 'writely_sidebar_open',
  LAST_NOTE_ID: 'writely_last_note_id',
} as const;

export const DEFAULT_THEME: ThemeId = 'paper';
export const DEFAULT_FONT: FontFamilyId = 'sans-sfpro';
export const DEFAULT_FONT_SIZE: FontSizeId = 'base';

export const VALID_THEMES: ThemeId[] = [
  'paper',
  'light',
  'dark',
  'midnight',
  'nordic',
  'matcha',
  'rosewater',
  'oled',
];

export const VALID_FONTS: FontFamilyId[] = [
  'sans-sfpro',
  'sans-inter',
  'sans-geist',
  'sans-jakarta',
  'serif-georgia',
  'serif-sourceserif',
  'serif-newsreader',
  'serif-garamond',
  'serif-lora',
  'mono-jetbrains',
  'mono-ibmplex',
];

export const THEME_FAVICON_COLORS: Record<ThemeId, { bg: string; fg: string }> = {
  paper: { bg: '#FAF6EE', fg: '#9C5B2B' },
  light: { bg: '#FFFFFF', fg: '#2563EB' },
  dark: { bg: '#18181B', fg: '#60A5FA' },
  midnight: { bg: '#0B0F19', fg: '#38BDF8' },
  nordic: { bg: '#2E3440', fg: '#88C0D0' },
  matcha: { bg: '#ECF1EC', fg: '#2E6B47' },
  rosewater: { bg: '#F3EBEB', fg: '#9E4D60' },
  oled: { bg: '#000000', fg: '#FFFFFF' },
};

export function updateThemeFavicon(theme: ThemeId): void {
  if (typeof document === 'undefined') return;
  const colors = THEME_FAVICON_COLORS[theme] || THEME_FAVICON_COLORS.paper;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="${colors.bg}"/><path d="M16 18 L24 46 L32 26 L40 46 L48 18" stroke="${colors.fg}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
  const svgUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;

  let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/svg+xml';
  link.href = svgUrl;
}

export function getStoredTheme(): ThemeId {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const val = localStorage.getItem(KEYS.THEME) as ThemeId;
  if (val && VALID_THEMES.includes(val)) {
    return val;
  }
  return DEFAULT_THEME;
}

export function setStoredTheme(theme: ThemeId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.THEME, theme);
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeFavicon(theme);
}

export function getStoredFont(): FontFamilyId {
  if (typeof window === 'undefined') return DEFAULT_FONT;
  const val = localStorage.getItem(KEYS.FONT_FAMILY) as FontFamilyId;
  if (val && VALID_FONTS.includes(val)) {
    return val;
  }
  return DEFAULT_FONT;
}

export function setStoredFont(font: FontFamilyId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.FONT_FAMILY, font);
  document.documentElement.setAttribute('data-font', font);
}

export function getStoredFontSize(): FontSizeId {
  if (typeof window === 'undefined') return DEFAULT_FONT_SIZE;
  const val = localStorage.getItem(KEYS.FONT_SIZE) as FontSizeId;
  if (val && ['sm', 'base', 'lg'].includes(val)) {
    return val;
  }
  return DEFAULT_FONT_SIZE;
}

export function setStoredFontSize(size: FontSizeId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.FONT_SIZE, size);
  document.documentElement.setAttribute('data-font-size', size);
}

export function getStoredSidebarOpen(): boolean {
  if (typeof window === 'undefined') return true;
  const val = localStorage.getItem(KEYS.SIDEBAR_OPEN);
  return val !== null ? val === 'true' : true;
}

export function setStoredSidebarOpen(open: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.SIDEBAR_OPEN, String(open));
}

export function getStoredLastNoteId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEYS.LAST_NOTE_ID);
}

export function setStoredLastNoteId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.LAST_NOTE_ID, id);
}

/**
 * Requests the browser to mark storage as persistent (cannot be automatically evicted)
 */
export async function enablePersistentStorage(): Promise<boolean> {
  if (typeof window === 'undefined' || !navigator.storage || !navigator.storage.persist) {
    return false;
  }
  try {
    const isPersisted = await navigator.storage.persisted();
    if (!isPersisted) {
      return await navigator.storage.persist();
    }
    return true;
  } catch {
    return false;
  }
}
