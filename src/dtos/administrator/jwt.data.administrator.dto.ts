export class JwtDataAdministratorDto {
    administratorId: number;
    username: string;
    exp: number; // UNIX timestamp
    ip: string;
    ua: string;

    toPlainObject() {
        return {
            administratorId: this.administratorId,
            username: this.username,
            ext: this.exp,
            ip: this.ip,
            ua: this.ua,
        }
    }
}