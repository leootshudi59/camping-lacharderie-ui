'use client';

import Loader from './Loader';

type FullScreenLoaderProps = {
  text?: string;
};

export default function FullScreenLoader({ text }: FullScreenLoaderProps) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/40">
      <Loader size={12} />
      {text && (
        <div className="mt-4 text-white font-semibold text-lg drop-shadow text-center animate-pulse">
          {text}
        </div>
      )}
    </div>
  );
}