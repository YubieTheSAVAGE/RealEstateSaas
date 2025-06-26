import { Contract } from "./Contract";
import { Property } from "./property";

export interface Payment {
    id: number;
    amount: number;
    dueDate: Date;
    status: "PENDING" | "PAID" | "LATE" | "CANCELLED";
    contract: Contract;
    property: Property;
    createdAt: Date;
    updatedAt: Date;
}