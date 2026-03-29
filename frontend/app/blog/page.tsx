import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function BlogPage() {
  return (
    <InfoPage 
      title="AmazonX Blog"
      category="Get to Know Us"
      content="Stay updated with the latest news, innovations, and stories from across AmazonX. From technological breakthroughs to community initiatives, explore how we're making an impact."
      highlights={[
        "Tech & Innovation",
        "Sustainability News",
        "Customer Success Stories",
        "Company Announcements"
      ]}
    />
  );
}
