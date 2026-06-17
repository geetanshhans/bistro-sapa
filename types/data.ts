export type MenuCategoryId =
  | "cocktails"
  | "spirits-wine"
  | "beer-na"
  | "food";

export type Locale = "en" | "vi";

export interface Strength {
  bitter: number;
  sweet: number;
  sour: number;
  strong: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  available: boolean;
  group?: string;
  image?: string;
  strength?: Strength;
}

export interface MenuCategory {
  id: MenuCategoryId;
  label: string;
  label_vi?: string;
  blurb: string;
  blurb_vi?: string;
  items: MenuItem[];
}

export interface Special {
  id: string;
  title: string;
  title_vi?: string;
  description: string;
  description_vi?: string;
  badge: string;
  badge_vi?: string;
  active: boolean;
  featured?: boolean;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  caption_vi?: string;
}

export interface DayHours {
  day: string;
  day_vi?: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface Social {
  instagram: string;
  facebook: string;
}

export interface BarInfo {
  name: string;
  tagline: string;
  tagline_vi?: string;
  address: string;
  phone: string;
  email: string;
  mapsEmbedUrl: string;
  mapsDirectionsUrl?: string;
  social: Social;
}

export interface AboutBlock {
  eyebrow: string;
  eyebrow_vi?: string;
  heading: string;
  heading_vi?: string;
  body: string[];
  body_vi?: string[];
  image: string;
  imageAlt: string;
  facts?: { label: string; label_vi?: string; value: string; value_vi?: string }[];
}

export interface SiteData {
  info: BarInfo;
  hours: DayHours[];
  menu: MenuCategory[];
  specials: Special[];
  gallery: GalleryImage[];
  about: AboutBlock;
}
