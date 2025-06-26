import React from 'react'
import PaymentStatusHeader from './PaymentStatusHeader'

export default function Payment() {
  return (
    <div className='bg-white rounded-lg'>
        <PaymentStatusHeader totalPayments={100} pendingPayments={20} latePayments={10} paidPayments={70} />
    </div>
  )
}