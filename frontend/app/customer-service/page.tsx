'use client';

import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function CustomerService() {
  return (
    <InfoPage 
      category="Support Center"
      title="Customer Service"
      content="How can we help you today? Our global support team is available 24/7 to assist with orders, shipping, and technical deployments."
      highlights={[
        "Track shipments in real-time",
        "Initiate technical hardware returns",
        "Manage account security",
        "Live chat with field engineers"
      ]}
    />
  );
}
