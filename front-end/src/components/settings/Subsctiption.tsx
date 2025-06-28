import React from 'react'
import SubsriptionPlans from '../price-table/SubsriptionPlans'
import CurrentPlanCard from '../cards/card-with-icon/CurrentPlanCard'

export default function Subsctiption() {
  return (
    <>
        <CurrentPlanCard
            plan={"promoteur"}
            lotsUsed={156}
            nextBillingDate="2024-02-15"
        />
        <SubsriptionPlans />
    </>
  )
}