'use client';

import React from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb';
import ClientDetails from '@/components/client/ClientDetails';

interface ClientDetailsPageProps {
  params: {
    clientId: string;
  };
}

export default function ClientDetailsPage({ params }: ClientDetailsPageProps) {
  const { clientId } = params;

  const threeLayerItems = [
    { label: 'Home', href: '/' },
    { label: 'Clients', href: '/clients' },
    { label: clientId },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Client Details
        </h2>
        <Breadcrumb items={threeLayerItems} variant="withIcon" />
      </div>

      <div>
        <ClientDetails clientId={clientId} />
        {/* Replace this with a proper ClientInfo component */}
        {/* <ClientInfo clientId={clientId} /> */}
      </div>
    </>
  );
}
