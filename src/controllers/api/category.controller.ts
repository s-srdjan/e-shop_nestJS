import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Category } from "entities/category.entity";
import { CategoryService } from "src/services/category/category.service";

@Controller('api/category')
@Crud({
    model: {
        type: Category
    },
    params: {
        id:{
            field:'categoryId',
            type:'number',
            primary: true
        }
    },
    query: {
        join:{
            categories: {
                eager:true
            },
            features: {
                eager:true
            },
            parentCategory: {
                eager:false
            },
            articles: {
                eager:false
            }
         }
    }
})

export class CategoryController {
    constructor(public service: CategoryService) {}
}