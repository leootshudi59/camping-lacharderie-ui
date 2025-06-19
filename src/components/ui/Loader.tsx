'use client';

type LoaderProps = {
  size?: number; // Taille du spinner en "tailwind units" (ex: 8 = 2rem)
  className?: string;
};

export default function Loader({ size = 8, className = '' }: LoaderProps) {
  return (
    <div
      className={`flex justify-center items-center ${className}`}
      aria-label="Chargement…"
      role="status"
    >
      <span
        className={`inline-block animate-spin rounded-full border-4 border-green-600 border-t-transparent`}
        style={{
          width: `${size * 0.25}rem`,
          height: `${size * 0.25}rem`,
          minWidth: 24,
          minHeight: 24,
        }}
      />
    </div>
  );
}