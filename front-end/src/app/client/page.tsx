import React from 'react'
import ClientDashboard from '@/components/client/ClientInterface/ClientDashboard'
import { dummyClient } from '@/components/client/ClientInterface/dummyClient'



export default function ClientPage() {
  return (
    <>
      <ClientDashboard client={dummyClient} />
    </>
  )
}