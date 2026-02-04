'use client';

import { MessageCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function WhatsAppFloat() {
  const handleClick = () => {
    const number = siteConfig.contact.whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${number}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all hover:scale-110 flex items-center justify-center md:hidden"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  );
}
