"use client";
import { useEffect, useState } from 'react';

const IMAGENS_FITA = [
  '/images/background/acai1.png',
  '/images/background/acai2.jpg', 
  '/images/background/acai3.jpg',
  '/images/background/logo.png'
];

export default function AnimatedBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed left-0 top-0 w-full pointer-events-none z-0">
      {/* Container principal da fita - acompanha scroll */}
      <div 
        className="absolute left-1/2 h-36 flex items-center"
        style={{ 
          top: `calc(75vh - 1.7 * ${scrollY}px)`,
          transform: 'translateX(-50%)',
          width: '100vw',
        
        }}
      >
        {/* FITA BRANCA - cobre TODA extensão horizontal das imagens */}
        <div 
          className="absolute inset-0 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/70"
        />
        
        {/* Imagens passando infinitamente DA ESQUERDA */}
        <div 
          className="flex items-center h-full px-12"
          style={{ 
            animation: 'scrollImagens 32s linear infinite',
            width: 'max-content'
          }}
        >
          {/* 3x duplicadas para loop suave */}
          {[...IMAGENS_FITA, ...IMAGENS_FITA, ...IMAGENS_FITA].map((img, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-52 h-32 mx-8 rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-all duration-300"
            >
              <img
                src={img}
                alt={`Fita ${index + 1}`}
                className="w-full h-full object-cover brightness-110"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollFita {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        
        @keyframes scrollImagens {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}
