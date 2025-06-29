import React from 'react'
import ClientPaymentOverview from './ClientPaymentOverview'
import { Client } from '@/types/client'

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
        {/* <ClientPaymentOverview client={client} /> */}
    </>
  )
}