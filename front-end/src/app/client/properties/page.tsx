import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb'
import React from 'react'

export default function ClientPropertiesPage() {
    const breadcrumbItems = [
        {
            label: 'Accueil',
            href: '/client',
        },
        {
            label: 'Propriétés',
            href: '/client/properties',
        },
    ]
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <span className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                Propriétés
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Vous pouvez gérer vos propriétés ici
            </p>
        </span>
        <Breadcrumb items={breadcrumbItems} variant="withIcon" />
      </div>
    </>
  )
}