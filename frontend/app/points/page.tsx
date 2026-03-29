import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function PointsPage() {
  return (
    <InfoPage 
      title="Shop with Points"
      category="AmazonX Payment Products"
      content="Turn your reward points into products. Use your earned points from AmazonX and partner programs to pay for your purchases instantly at checkout."
      highlights={[
        "Simple One-Click Payment",
        "Broad Program Support",
        "Automatic Point Conversion",
        "Track Balance Easily"
      ]}
    />
  );
}
