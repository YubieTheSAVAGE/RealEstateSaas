import { ContractTemplate } from "./ContractTemplate";
import { Client } from "./client";
import { Property } from "./property";

export interface Contract {
  id: number;
  template: ContractTemplate;
  status: "WAITING_CVALIDATION" | "VALIDATED_BY_CLIENT" | "LEGALIZED" | "VALIDATED"; 
  client: Client;
  property: Property;
  createdAt: Date;
  updatedAt: Date;
}