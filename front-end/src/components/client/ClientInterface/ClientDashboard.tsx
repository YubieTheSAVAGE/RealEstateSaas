import React from 'react'
import { Client } from '@/types/client'
import { NextDueCard, PaymentStatusCard, ProjectProgressCarousel } from './ClientOverviewCards'

interface ClientDashboardProps {
  client: Client
}

export default function ClientDashboard({ client }: ClientDashboardProps) {

  return (
    <>
     <div className="flex flex-col gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Bienvenue sur votre tableau de bord
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
            Vous pouvez gérer vos propriétés, vos echéances et vos paiements ici
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PaymentStatusCard payments={client.payments || []} />
        <NextDueCard payments={client.payments || []} />
        <ProjectProgressCarousel properties={client.apartments || []} />
      </div>
    </>
  )
}