import { Body, Controller, HttpException, HttpStatus, Post, Put, Req,  } from "@nestjs/common";
import { LoginAdministratorDto } from "src/dtos/administrator/login.administrator.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as crypto from 'crypto';
import { LoginInfoDto } from "src/dtos/auth/login.info.dto";
import * as jwt from 'jsonwebtoken';
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { Request } from "express";
import { jwtSecret } from "config/jwt.secret";
import { UserRegistrationDto } from "src/dtos/user/user.registration.dto";
import { UserService } from "src/services/user/user.service";
import { LoginUserDto } from "src/dtos/user/login.user.dto";
import { JwtRefreshDataDto } from "src/dtos/auth/jwt.refresh.dto";
import { Subscription } from "rxjs";
import { UserRefreshTokenDto } from "src/dtos/auth/user.refresh.token.dto";

@Controller('auth')
export class AuthController {
    constructor(
        public administratorService: AdministratorService,
        public userService: UserService,
        ) { }

    @Post('administrator/login') 
    async doAdministratorLogin(@Body() data: LoginAdministratorDto, @Req() req: Request): Promise<LoginInfoDto | ApiResponse> {
        const administrator = await this.administratorService.getByUsername(data.username);

        if(!administrator) {
            return new Promise(resolve => resolve(new ApiResponse('error',-3001)));
        }

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if  (administrator.passwordHash !== passwordHashString) {
            return new Promise(resolve => resolve(new ApiResponse('error',-3002)));
        } 
        
        // token ( JWT ) = JSON { adminId, username, exp, ip, ua }

        const jwtData = new JwtDataDto();
        jwtData.role = "administrator";
        jwtData.id = administrator.administratorId;
        jwtData.identity = administrator.username;
        jwtData.exp = this.getDatePlus(60 * 60 * 24 * 14);
        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoDto(
            administrator.administratorId,
            administrator.username,
            token,
            "",
            "",
        );

        return new Promise(resolve => resolve(responseObject));
    }

    @Post('user/login') 
    async doUserLogin(@Body() data: LoginUserDto, @Req() req: Request): Promise<LoginInfoDto | ApiResponse> {

        const user = await this.userService.getByEmail(data.email);

        if(!user) {
            return new Promise(resolve => resolve(new ApiResponse('error',-3001)));
        }

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if  (user.passwordHash !== passwordHashString) {
            return new Promise(resolve => resolve(new ApiResponse('error',-3002)));
        } 
        
        // token ( JWT ) = JSON { adminId, username, exp, ip, ua }

        const jwtData = new JwtDataDto();
        jwtData.role = "user";
        jwtData.id = user.userId;
        jwtData.identity = user.email;
        jwtData.exp = this.getDatePlus(60 * 5);
        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const jwtRefreshData = new JwtRefreshDataDto();
        jwtRefreshData.role = jwtData.role;
        jwtRefreshData.id = jwtData.id;
        jwtRefreshData.identity = jwtData.identity;
        jwtRefreshData.exp = this.getDatePlus(60 * 60 * 24 * 31);
        jwtRefreshData.ip = jwtData.ip;
        jwtRefreshData.ua = jwtData.ua;

        let refreshToken: string = jwt.sign(jwtRefreshData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoDto(
            user.userId,
            user.email,
            token,
            refreshToken,
            this.getIsoDate(jwtRefreshData.exp),
        );

        await this.userService.addToken(user.userId, refreshToken, this.getDatabaseDateFormat(this.getIsoDate(jwtRefreshData.exp)));

        return new Promise(resolve => resolve(responseObject));
    }


    @Post('user/register') 
    async userRegister(@Body() data: UserRegistrationDto) {
        return await this.userService.register(data);
    }

    @Post('user/refresh')
   
    async userTokenRefresh(@Req() req: Request,@Body() data: UserRefreshTokenDto): Promise<LoginInfoDto | ApiResponse> {
        const userToken = await this.userService.getUserToken(data.token);

        if (!userToken) {
            return new ApiResponse("error", -10002, "No such refresh token!");
        }

        if (userToken.isValid === 0) {
            return new ApiResponse("error", -10003, "Token is no longer valid!");
        }

        const sada = new Date();
        const datumIsteka = new Date(userToken.expiresAt);

        if (datumIsteka.getTime() < sada.getTime()) {
            return new ApiResponse("error", -10004, "The token has expired!");
        }

        let jwtRefreshData: JwtRefreshDataDto;
        
        try {
            jwtRefreshData = jwt.verify(data.token,jwtSecret);
        } catch (e) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        if (!jwtRefreshData) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        if (jwtRefreshData.ip !== req.ip.toString()) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        if (jwtRefreshData.ua !== req.headers["user-agent"]) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        const jwtData = new JwtDataDto();
        jwtData.role = jwtRefreshData.role;
        jwtData.id = jwtRefreshData.id;
        jwtData.identity = jwtRefreshData.identity;
        jwtData.exp = this.getDatePlus(60 * 5);
        jwtData.ip = jwtRefreshData.ip;
        jwtData.ua = jwtRefreshData.ua;

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoDto(
            jwtData.id,
            jwtData.identity,
            token,
            data.token,
            this.getIsoDate(jwtRefreshData.exp),
        );

        return responseObject;
    }

    private getDatePlus(numberOfSeconds: number): number {
        return new Date().getTime() / 1000 + numberOfSeconds;
    }

    private getIsoDate(timestamp: number): string{
        const date = new Date();
        date.setTime(timestamp * 1000);
        return date.toISOString();
    }

    private getDatabaseDateFormat(isoFormat: string): string {
        return isoFormat.substr(0,19).replace('T',' ');
    }

}