'use client';

import React from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb';
import ClientDetails from '@/components/client/ClientDetails';


export default async function ClientDetailsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;

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
      </div>
    </>
  );
}
