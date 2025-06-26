import React from 'react'
import ContractTab from '../ui/tabs/ContractTab'
import ContractsTable from '../ecommerce/ContractsTable'
import { Contract } from '@/types/Contract'



export default function Contract() {
  return (
    <div className='bg-white rounded-lg'>
        <ContractTab />
    </div>
  )
}