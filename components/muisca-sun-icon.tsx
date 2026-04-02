export function MuiscaSunIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Central sun circle */}
      <circle cx="24" cy="24" r="10" fill="currentColor" />
      
      {/* Inner decorative circle */}
      <circle cx="24" cy="24" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      
      {/* Sun rays - Muisca tribal style */}
      {/* Top ray */}
      <path d="M24 2L26 10H22L24 2Z" fill="currentColor" />
      <path d="M24 2L22 6L24 4L26 6L24 2Z" fill="currentColor" opacity="0.6" />
      
      {/* Top-right ray */}
      <path d="M39.5 8.5L34 15L31 12L39.5 8.5Z" fill="currentColor" />
      
      {/* Right ray */}
      <path d="M46 24L38 26V22L46 24Z" fill="currentColor" />
      <path d="M46 24L42 22L44 24L42 26L46 24Z" fill="currentColor" opacity="0.6" />
      
      {/* Bottom-right ray */}
      <path d="M39.5 39.5L34 33L31 36L39.5 39.5Z" fill="currentColor" />
      
      {/* Bottom ray */}
      <path d="M24 46L22 38H26L24 46Z" fill="currentColor" />
      <path d="M24 46L26 42L24 44L22 42L24 46Z" fill="currentColor" opacity="0.6" />
      
      {/* Bottom-left ray */}
      <path d="M8.5 39.5L14 33L17 36L8.5 39.5Z" fill="currentColor" />
      
      {/* Left ray */}
      <path d="M2 24L10 22V26L2 24Z" fill="currentColor" />
      <path d="M2 24L6 26L4 24L6 22L2 24Z" fill="currentColor" opacity="0.6" />
      
      {/* Top-left ray */}
      <path d="M8.5 8.5L14 15L17 12L8.5 8.5Z" fill="currentColor" />
      
      {/* Secondary rays (smaller, between main rays) */}
      <path d="M32 5L30 12L33 10L32 5Z" fill="currentColor" opacity="0.7" />
      <path d="M43 16L36 18L38 15L43 16Z" fill="currentColor" opacity="0.7" />
      <path d="M43 32L36 30L38 33L43 32Z" fill="currentColor" opacity="0.7" />
      <path d="M32 43L30 36L33 38L32 43Z" fill="currentColor" opacity="0.7" />
      <path d="M16 43L18 36L15 38L16 43Z" fill="currentColor" opacity="0.7" />
      <path d="M5 32L12 30L10 33L5 32Z" fill="currentColor" opacity="0.7" />
      <path d="M5 16L12 18L10 15L5 16Z" fill="currentColor" opacity="0.7" />
      <path d="M16 5L18 12L15 10L16 5Z" fill="currentColor" opacity="0.7" />
    </svg>
  )
}
