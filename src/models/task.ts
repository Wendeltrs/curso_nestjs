import { Expose } from "class-transformer";
import { Project } from "./project";

export class Task {
    @Expose()
    id: string

    @Expose()
    title: string

    @Expose()
    description: string

    @Expose()
    status: string

    @Expose()
    priority: string

    @Expose()
    projectId: string

    @Expose()
    project: Project

    @Expose()
    dueDate: Date

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date

    @Expose()
    deletedAt: Date
}