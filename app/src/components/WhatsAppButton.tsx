import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const phoneNumber = '+1234567890';
  const message = 'Hello ValidCC Support, I need assistance with my account.';
  
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl animate-pulse-slow"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="h-7 w-7 fill-current" />
    </button>
  );
}
