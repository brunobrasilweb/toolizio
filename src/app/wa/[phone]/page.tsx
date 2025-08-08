"use client";

import { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/utils/analytics';

export default function WhatsAppRedirect() {
  const params = useParams();
  const searchParams = useSearchParams();
  const phone = params.phone as string;
  const text = searchParams.get('text');

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
    
    // Redirect to WhatsApp
    window.location.href = whatsappUrl;
  }, [phone, text]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Redirecting to WhatsApp...</h1>
        <p className="text-gray-600 dark:text-gray-300">
          You will be redirected to WhatsApp chat with {phone} in a moment.
        </p>
      </div>
    </div>
  );
}
