export class JwtRefreshDataDto {
    role: "administrator" | "user";
    id: number;
    identity: string;
    exp: number; // UNIX timestamp
    ip: string;
    ua: string;

    toPlainObject() {
        return {
            role: this.role,
            id: this.id,
            identity: this.identity,
            exp: this.exp,
            ip: this.ip,
            ua: this.ua,
        }
    }
}