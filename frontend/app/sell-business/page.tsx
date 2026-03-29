import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function SellBusinessPage() {
  return (
    <InfoPage 
      title="Sell on AmazonX Business"
      category="Make Money with Us"
      content="Connect with business buyers and expand your B2B sales. AmazonX Business provides specialized features and pricing to help you meet the needs of professional organizations."
      highlights={[
        "Business Pricing & Discounts",
        "B2B Fulfillment",
        "Tax Exemption Services",
        "Business Analytics"
      ]}
    />
  );
}
