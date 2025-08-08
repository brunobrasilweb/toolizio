"use client";

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/utils/analytics';

export default function WhatsAppRedirect() {
  const params = useParams();
  const searchParams = useSearchParams();
  const phone = params.phone as string;
  const text = searchParams.get('text');
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    // Create the WhatsApp URL
    let whatsappUrl = `https://api.whatsapp.com/send/?phone=${phone}`;
    
    // Add message if provided
    if (text && text.trim()) {
      whatsappUrl += `&text=${text}`;
    }

    whatsappUrl += "&type=phone_number&app_absent=0";

    // Track the redirection event
    trackEvent('redirect', 'WhatsApp Link', `Phone: ${phone}`);
    
    // Set a small delay to allow analytics to fire
    const redirectTimer = setTimeout(() => {
      window.location.href = whatsappUrl;
      setIsRedirecting(false);
    }, 500);
    
    return () => clearTimeout(redirectTimer);
  }, [phone, text]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          {isRedirecting ? "Redirecting to WhatsApp..." : "Opening WhatsApp..."}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {isRedirecting 
            ? `You will be redirected to chat with +${phone} in a moment.`
            : `If WhatsApp doesn't open automatically, please click the button below.`
          }
        </p>
        
        {!isRedirecting && (
          <a 
            href={`https://api.whatsapp.com/send/?phone=${phone}${text ? `&text=${encodeURIComponent(text)}` : ''}&type=phone_number&app_absent=0`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            Open WhatsApp Manually
          </a>
        )}
      </div>
    </div>
  );
}
