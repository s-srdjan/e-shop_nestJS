import { Body, Controller, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AddArticleToCartDto } from "src/dtos/cart/add.article.to.cart.dto";
import { EditArticleInCartDto } from "src/dtos/cart/edit.article.in.cart.dto";
import { Cart } from "src/entities/cart.entity";
import { Order } from "src/entities/order.entity";
import { AllowToRoles } from "src/misc/allow.to.roles.decriptor";
import { ApiResponse } from "src/misc/api.response.class";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { CartService } from "src/services/cart/cart.service";
import { OrderMailer } from "src/services/order/order.mailer.service";
import { OrderService } from "src/services/order/order.service";

@Controller('api/user/cart')
export class UserCartController {

    constructor(
        private cartService: CartService,
        private orderService: OrderService,
        private orderMailer: OrderMailer,
        ) { }

    private async getActiveCartForUserId(userId: number): Promise<Cart> {
        let cart =  await this.cartService.getLastActiveCartByUserId(userId);

        if (!cart) {
            cart = await this.cartService.createNewCartForUser(userId);
        }

        return await this.cartService.getById(cart.cartId);
    }

    @Get()
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('user')
    async getCurrentCart(@Req() req: Request): Promise< Cart > {
       return await this.getActiveCartForUserId(req.token.id);
    }

    @Post('addToCart')
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('user')
    async addToCart(@Body() data: AddArticleToCartDto, @Req() req: Request): Promise<Cart> {
        const cart = await this.getActiveCartForUserId(req.token.id);

        return await this.cartService.addArticleToCart(cart.cartId, data.articleId, data.quantity);
    }

    @Patch()
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('user')
    async changeQuantity(@Body() data: EditArticleInCartDto,  @Req() req: Request): Promise<Cart> {
        const cart = await this.getActiveCartForUserId(req.token.id);
        return await this.cartService.changeQuantity(cart.cartId, data.articleId, data.quantity);

    }

    @Post('makeOrder')
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('user')
    async makeOrder (@Req() req: Request):  Promise<Order | ApiResponse> { 
        const cart = await this.getActiveCartForUserId(req.token.id);
        const order = await this.orderService.add(cart.cartId);

        if (order instanceof ApiResponse) {
            return order;
        }

        await this.orderMailer.sendOrderEmail(order);

        return order;
    }

    @Get('orders')
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('user')
    async getOrders(@Req() req: Request):  Promise<Order[]> {
        return await this.orderService.getAllByUserId(req.token.id);
    }

}