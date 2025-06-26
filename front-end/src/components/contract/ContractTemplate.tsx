import React from 'react'
import { Button } from '../ui/button'
import { PlusIcon } from 'lucide-react'

export default function ContractTemplate() {
  return (
    <>
        <div className="flex flex-row justify-between items-center gap-4">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Templates</h1>
                <p className="text-sm text-gray-500">
                    Templates sont utilisés pour générer des contrats.
                </p>
            </div>
            <Button className='bg-brand-500 text-white hover:bg-brand-600'>
                <PlusIcon className="w-4 h-4" />
                Ajouter un template
            </Button>
        </div>
    </>
  )
}