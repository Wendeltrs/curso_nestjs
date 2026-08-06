import { Expose, Type } from "class-transformer";
import { Task } from "./task";

export class Project {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    @Type(() => Task)
    tasks: Task[];

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    deletedAt: Date;
}