# Adding Your PNG Logo

To add your PNG logo, update the Header component:

1. Place your logo file in `public/logo.png` (or `public/logo.svg`)

2. Update `components/Header/Header.tsx`:

Replace this line:
```tsx
<Link href={data.logo.href} className="text-2xl font-bold text-primary-600 hover:text-primary-700">
  {data.logo.text}
</Link>
```

With:
```tsx
<Link href={data.logo.href} className="flex items-center">
  <img 
    src="/logo.png" 
    alt="shabitools Logo" 
    className="h-8 w-auto"
  />
</Link>
```

Or if you want to keep text as fallback:
```tsx
<Link href={data.logo.href} className="flex items-center gap-2">
  <img 
    src="/logo.png" 
    alt="shabitools Logo" 
    className="h-8 w-auto"
  />
  <span className="text-2xl font-bold text-primary-600">{data.logo.text}</span>
</Link>
```

Adjust the `h-8` class to change the logo height (h-6 = 24px, h-8 = 32px, h-10 = 40px, etc.)
