'use client';

import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function SellPage() {
  return (
    <InfoPage 
      category="Partnership"
      title="Sell on AmazonX"
      content="Reach millions of professional buyers and corporate procurement officers worldwide. Our platform provides the infrastructure you need to deploy your specialized inventory at scale."
      highlights={[
        "Global logistics & fulfillment",
        "B2B marketplace tools",
        "Performance analytics",
        "Secure enterprise payments"
      ]}
    />
  );
}
