import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller({
    path: 'projects',
    version: '1',
})
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    @Get()
    public getAll() {
        return this.projectsService.getAll();
    }

    @Get(':id')
    public get(@Param('id') id: string) {
        return this.projectsService.get(id);
    }

    @Post()
    public create(@Body() data: any) {
        return this.projectsService.create(data);
    }

    @Put(':id')
    public update(@Param('id') id: string, @Body() data: any) {
        return this.projectsService.update(id, data);
    }

    @Delete(':id')
    public delete(@Param('id') id: string) {
        return this.projectsService.delete(id);
    }
}
