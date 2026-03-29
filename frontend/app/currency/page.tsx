import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function CurrencyPage() {
  return (
    <InfoPage 
      title="Currency Converter"
      category="AmazonX Payment Products"
      content="Shop globally and see prices in your local currency. Our real-time converter provides transparent exchange rates and ensures you know exactly what you're paying."
      highlights={[
        "Real-Time Exchange Rates",
        "Transparent Conversion Fees",
        "Supports 100+ Currencies",
        "Global Shopping Ready"
      ]}
    />
  );
}
