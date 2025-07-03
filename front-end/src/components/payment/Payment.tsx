import React from 'react'
import PaymentStatusHeader from './PaymentStatusHeader'
import PaymentsTable from '../ecommerce/PaymentsTable'
import type { Payment } from '@/types/Payment'
import { dummyPayments } from './dummyPayments'

export default function Payment() {
  return (
    <>
      <div className='mb-4'>
        <PaymentStatusHeader totalPayments={100} pendingPayments={20} latePayments={10} paidPayments={70} />
      </div>
      <PaymentsTable payments={dummyPayments} />
    </>
  )
}