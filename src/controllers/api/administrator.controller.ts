import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Administrator } from "src/entities/administrator.entity";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { ApiResponse } from "src/misc/api.response.class";
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
    getById(@Param('id') administratorId:number): Promise<Administrator | ApiResponse> {
    
        return new Promise(async (resolve)=> {

        let admin = await this.administratorService.getById(administratorId);

        if (admin === undefined) {
            resolve(new ApiResponse("error",-1002));      
            }
        resolve(admin);
      });   
    }

    @Post()
    add(@Body() data: AddAdministratorDto): Promise<Administrator | ApiResponse>{
        return this.administratorService.add(data);
    }

    @Put(':id')
    edit(@Param('id') id:number, @Body() data: EditAdministratorDto): Promise<Administrator | ApiResponse>{
        return this.administratorService.editById(id,data);
    }
}