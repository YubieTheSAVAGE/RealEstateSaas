import { Contract } from "./Contract";
import { Property } from "./property";

export interface Payment {
    id: number;
    amount: number;
    dueDate: Date;
    status: "PENDING" | "PAID" | "LATE";
    proofOfPayment: File | null;
    contract?: Contract;
    property: Property;
    createdAt: Date;
    updatedAt: Date;
    isFirstPayment?: boolean;
    percentageOfTotal?: number;
}

export interface PaymentValidation {
    isValid: boolean;
    error?: string;
    suggestedAmount?: number;
    percentage?: number;
}

export interface PaymentPlan {
    payments: Payment[];
    totalAmount: number;
    firstPaymentAmount: number;
    firstPaymentPercentage: number;
    isValid: boolean;
    validationErrors: string[];
}