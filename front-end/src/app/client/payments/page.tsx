import ClientPaymentOverview from '@/components/client/ClientInterface/ClientPaymentOverview'
import DueToPayments from '@/components/client/ClientInterface/dueToPayments'
import { dummyClient } from '@/components/client/ClientInterface/dummyClient'
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb'
import React from 'react'

export default function ClientPaymentsPage() {
  const breadcrumbItems = [
      {
          label: 'Accueil',
          href: '/client',
      },
      {
          label: 'Echéances',
          href: '/client/payments',
      },
  ]
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <span className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                Echéances
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Vous pouvez gérer vos echéances ici
            </p>
        </span>
        <Breadcrumb items={breadcrumbItems} variant="withIcon" />
      </div>
      <ClientPaymentOverview client={dummyClient} />
      <DueToPayments payments={dummyClient.payments || []} />
    </>
  )
}