import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { MailConfig } from "config/mail.config";
import { CartArticle } from "src/entities/cart-article.entity";
import { Order } from "src/entities/order.entity";

@Injectable()
export class OrderMailer {
    constructor(private readonly mailerService: MailerService) { }

    async sendOrderEmail(order: Order) {
        await this.mailerService.sendMail({
            to: order.cart.user.email,
            bcc: MailConfig.orderNotificationMail,
            subject: 'Order details',
            encoding: 'UTF-8',
            html: this.makeOrderHtml(order),
        })    
    }

    private makeOrderHtml(order: Order): string {
        let suma = order.cart.cartArticles.reduce((sum, current: CartArticle) => {
            return sum + 
                   current.quantity *
                   current.article.articlePrices[current.article.articlePrices.length-1].price
        }, 0);


        return `<p>Zahvaljujemo se za Vasu porudzbinu!</p>
                <p>Ovo su detalji vas Vase porudzbine:</p>
                <ul>

                ${ order.cart.cartArticles.map((cartArticle: CartArticle) => {
                    return `<li>
                        ${ cartArticle.article.name } x 
                        ${ cartArticle.quantity }
                        </li>`        
                }).join("") }
                </ul>
                <p>Ukupan iznos je: ${ suma.toFixed(2) } EUR.</p>
                <p>Potpis... </p>`;
    }
}