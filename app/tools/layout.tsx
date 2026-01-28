import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Tools - shabitools',
  description: 'Browse all available web tools for developers, designers, and general users. Free, easy-to-use utilities to streamline your workflow.',
  keywords: 'web tools, developer tools, design tools, free tools, online utilities',
  openGraph: {
    title: 'All Tools - shabitools',
    description: 'Browse all available web tools for developers, designers, and general users.',
    type: 'website',
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
