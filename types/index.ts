// Header Types
export interface HeaderLogo {
  text: string;
  href: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface CTAButton {
  label: string;
  href: string;
}

export interface HeaderData {
  logo: HeaderLogo;
  navigation: NavigationItem[];
  cta: CTAButton;
}

// Hero Types
export interface CTA {
  label: string;
  href: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  primaryCTA: CTA;
  secondaryCTA: CTA;
  features: Feature[];
}

// Tool Types
export interface Tool {
  title: string;
  description: string;
  image: string;
  link: string;
  category: string;
  icon?: string; // Optional icon for backward compatibility
  tags?: string[]; // Optional tags for better searchability
  featured?: boolean; // Optional flag for featured tools
}

export interface Tab {
  id: string;
  label: string;
  tools: Tool[];
}

export interface TabsData {
  title: string;
  description: string;
  tabs: Tab[];
}

// FAQ Types
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQData {
  title: string;
  description: string;
  items: FAQItem[];
}

// Footer Types
export interface FooterBrand {
  name: string;
  description: string;
  logo: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinks {
  product: FooterLink[];
  company: FooterLink[];
  legal: FooterLink[];
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface FooterData {
  brand: FooterBrand;
  links: FooterLinks;
  social: SocialLink[];
  copyright: string;
}

// Search Types
export interface SearchProps {
  tools: Tool[];
  onSearch?: (results: Tool[]) => void;
  placeholder?: string;
  className?: string;
}
