import BuyMeACoffee from '@/components/BuyMeACoffee/BuyMeACoffee';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <BuyMeACoffee variant="inline" className="mt-8" />
      </div>
    </>
  );
}
