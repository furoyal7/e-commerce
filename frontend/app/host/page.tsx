import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function HostPage() {
  return (
    <InfoPage 
      title="AmazonX Host Hub"
      category="Make Money with Us"
      content="Learn how to host and earn with AmazonX. From space sharing to specialized services, our Host Hub provides the platform and support you need to build a successful hosting business."
      highlights={[
        "Flexible Hosting Options",
        "Verified Guest Profiles",
        "Dedicated Host Support",
        "Insurance & Protection"
      ]}
    />
  );
}
