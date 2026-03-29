import React from 'react';
import InfoPage from '@/components/InfoPage';

export default function CareersPage() {
  return (
    <InfoPage 
      title="Careers at AmazonX"
      category="Get to Know Us"
      content="Build the future with us. At AmazonX, we're looking for builders who want to work on projects that matter to millions of customers. Whether you're a software engineer, a logistics expert, or a creative designer, there's a place for you here."
      highlights={[
        "Global Career Opportunities",
        "Innovative Work Culture",
        "Comprehensive Benefits",
        "Inclusive Workplace"
      ]}
    />
  );
}
