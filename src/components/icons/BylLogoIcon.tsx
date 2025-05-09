import type { SVGProps } from 'react';

const BylLogoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 40" // Adjusted viewBox for a more rectangular logo
    fill="currentColor" // Use current color for BYL text
    {...props}
  >
    {/* B */}
    <path d="M10 5 H 20 Q 30 5 30 15 Q 30 25 20 25 H 10 V 5 M 10 25 H 20 Q 35 25 35 35 Q 35 45 20 45 H 10 V 25 Z" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth="1" />
    {/* Y */}
    <path d="M40 5 L 50 25 L 60 5 M 50 25 V 45" stroke="hsl(var(--primary))" strokeWidth="5" fill="none"/>
    {/* L */}
    <path d="M70 5 V 45 H 85" stroke="hsl(var(--primary))" strokeWidth="5" fill="none"/>
  </svg>
);

export default BylLogoIcon;
