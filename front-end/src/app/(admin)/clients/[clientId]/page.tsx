import React from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb';
import ClientDetails from '@/components/client/ClientDetails';
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ clientId: string }> }): Promise<Metadata> {
  const { clientId } = await params;
  
  return {
    title: `Client ${clientId} - Immo 360`,
    description: `Détails du client ${clientId} - Gestion immobilière Immo 360`,
    icons: {
      icon: "./favicon.ico",
      shortcut: "./favicon.ico",
      apple: "./favicon.ico",
    },
  };
}

export default async function ClientDetailsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;

  const threeLayerItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Client', href: '/clients' },
    { label: clientId },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Détails du client
        </h2>
        <Breadcrumb items={threeLayerItems} variant="withIcon" />
      </div>

      <div>
        <ClientDetails clientId={clientId} />
      </div>
    </>
  );
}
