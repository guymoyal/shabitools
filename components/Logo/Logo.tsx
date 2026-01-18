interface LogoProps {
  variant?: 1 | 2 | 3 | 4 | 'simple' | 'simple-2' | 'simple-3' | 'simple-4';
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({ variant = 'simple', width = 120, height = 40, className = '' }: LogoProps) {
  const logoPath = typeof variant === 'number' 
    ? `/logos/logo-${variant}.svg`
    : `/logos/logo-${variant}.svg`;
  
  return (
    <img
      src={logoPath}
      alt="iziTools Logo"
      width={width}
      height={height}
      className={className}
    />
  );
}
