'use client'

import React from "react";
import { TbFile, TbClock } from "react-icons/tb";
import { LuStamp } from "react-icons/lu";
import { CiCircleCheck } from "react-icons/ci";

import ContractStatusCard from "../cards/card-with-icon/ContractStatusCard";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { GiSandsOfTime } from "react-icons/gi";

interface PaymentStatusHeaderProps {
    totalPayments: number;
    pendingPayments: number;
    latePayments: number;
    paidPayments: number;
}

export default function PaymentStatusHeader({ totalPayments, pendingPayments, latePayments, paidPayments }: PaymentStatusHeaderProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ContractStatusCard title="Total des paiements" description={totalPayments.toString()} icon={<LiaMoneyBillWaveSolid size={24} />} color="bg-brand-50 text-brand-500 dark:bg-brand-500/10" />
            <ContractStatusCard title="Paiements en attente" description={pendingPayments.toString()} icon={<TbClock size={24} />} color="bg-orange-50 text-orange-500 dark:bg-orange-500/10" />
            <ContractStatusCard title="Paiements en retard" description={latePayments.toString()} icon={<GiSandsOfTime size={24} />} color="bg-error-50 text-error-500 dark:bg-error-500/10" />
            <ContractStatusCard title="Paiements effectués" description={paidPayments.toString()} icon={<CiCircleCheck size={24} />} color="bg-green-50 text-green-500 dark:bg-green-500/10" />    
        </div>
    )
}