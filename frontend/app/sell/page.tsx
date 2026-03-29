import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function SellPage() {
  return (
    <InfoPage 
      title="Sell on AmazonX"
      category="Make Money with Us"
      content="Reach millions of customers and grow your business with AmazonX. Whether you're a small business or a global brand, our tools and services help you sell more effectively and scale faster."
      highlights={[
        "Reach Millions of Customers",
        "Powerful Selling Tools",
        "Fulfillment by AmazonX",
        "Secure Payments"
      ]}
    />
  );
}
