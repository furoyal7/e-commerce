import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function BusinessCardPage() {
  return (
    <InfoPage 
      title="AmazonX Business Card"
      category="AmazonX Payment Products"
      content="Unlock exclusive rewards and benefits with the AmazonX Business Card. Designed for established companies and growing startups to manage expenses and earn while they spend."
      highlights={[
        "Cash Back Rewards",
        "No Annual Fees",
        "Exclusive Business Tools",
        "Priority Customer Support"
      ]}
    />
  );
}
