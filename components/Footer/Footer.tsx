export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <p className="text-center text-sm text-gray-500">
          &copy; {year} shabitools. Home tools reviews — launching soon.
        </p>
      </div>
    </footer>
  );
}
