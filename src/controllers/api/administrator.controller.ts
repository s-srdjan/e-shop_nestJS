import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Administrator } from "entities/administrator.entity";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { AdministratorService } from "src/services/administrator/administrator.service";

@Controller('api/administrator')
export class AdministratorController {

    constructor(
        private administratorService: AdministratorService  
      ) { }

    @Get()
    getAll(): Promise<Administrator[]> {
    return this.administratorService.getAll();
    }

    @Get(':id')
    getById(@Param('id') administratorId:number): Promise<Administrator>{
        return this.administratorService.getById(administratorId);
    }

    @Post()
    add(@Body() data: AddAdministratorDto): Promise<Administrator>{
        return this.administratorService.add(data);
    }

    @Put(':id')
    edit(@Param('id') id:number, @Body() data: EditAdministratorDto): Promise<Administrator>{
        return this.administratorService.editById(id,data);
    }
}