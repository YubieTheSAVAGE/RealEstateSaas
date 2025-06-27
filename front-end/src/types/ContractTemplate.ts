import { Project } from "./project";
import { User } from "./user";

export interface ContractTemplate {
    id: number;
    name: string;
    description: string;
    isDefault: boolean;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    assignedProjects: Project[];
    createdBy: User;
}


