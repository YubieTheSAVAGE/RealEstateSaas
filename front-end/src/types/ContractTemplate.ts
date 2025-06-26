import { Project } from "./project";

export interface ContractTemplate {
    id: number;
    name: string;
    description: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    assignedProjects: Project[];
}


