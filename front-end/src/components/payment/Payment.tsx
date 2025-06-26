import React from 'react'
import PaymentStatusHeader from './PaymentStatusHeader'
import PaymentsTable from '../ecommerce/PaymentsTable'
import { Payment } from '@/types/Payment'

const payments: Payment[] = [
  {
    id: 1,
    amount: 100000,
    dueDate: new Date(),
    status: 'LATE',
    contract: {
      id: 1,
      template: {
        id: 1,
        name: 'Template 1',
        description: 'Description 1',
        content: 'Content 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedProjects: []
      },
      client: {
        id: 1,
        name: 'Client 1',
        email: 'client1@gmail.com',
        phoneNumber: '0600000000',
        provenance: 'Client 1',
        status: 'CLIENT',
        createdById: 1
      },
      property: {
        id: 1,
        number: '1',
        project: {
          id: 1,
          name: 'Project 1',
          address: 'Address 1',
          totalSurface: 100,
          numberOfApartments: 10
        },
        floor: 1,
        type: 'APARTMENT',
        area: 100,
        price: 100000,
        pricePerM2: 1000,
        zone: 'Zone A',
        status: 'AVAILABLE',
        projectId: 1
      },
      status: 'WAITING_CVALIDATION',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    property: {
      id: 1,
      number: '1',
      project: {
        id: 1,
        name: 'Project 1',
        address: 'Address 1',
        totalSurface: 100,
        numberOfApartments: 10
      },
      floor: 1,
      type: 'APARTMENT',
      area: 100,
      price: 100000,
      pricePerM2: 1000,
      zone: 'Zone A',
      status: 'AVAILABLE',
      projectId: 1
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default function Payment() {
  return (
    <>
      <div className='bg-white rounded-lg mb-4'>
        <PaymentStatusHeader totalPayments={100} pendingPayments={20} latePayments={10} paidPayments={70} />
      </div>
      <PaymentsTable payments={payments} />
    </>
  )
}