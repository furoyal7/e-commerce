import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function DevicesPage() {
  return (
    <InfoPage 
      title="AmazonX Devices"
      category="Get to Know Us"
      content="Explore our range of innovative devices designed to make your life easier, more productive, and more fun. From smart home technology to personal electronics, discover the power of AmazonX hardware."
      highlights={[
        "Smart Home Integration",
        "High-Performance Audio",
        "E-Readers & Tablets",
        "Next-Gen Wearables"
      ]}
    />
  );
}
