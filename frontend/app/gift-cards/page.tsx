import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function GiftCardsPage() {
  return (
    <InfoPage 
      title="AmazonX Gift Cards"
      category="AmazonX Payment Products"
      content="Give the gift of choice with AmazonX Gift Cards. Perfect for any occasion, our gift cards are redeemable for millions of items across our storefront."
      highlights={[
        "Instant Digital Delivery",
        "Physical Card Options",
        "No Expiration Dates",
        "Personalized Messaging"
      ]}
    />
  );
}
