export class JwtDataDto {
    role: "administrator" | "user";
    id: number;
    username: string;
    exp: number; // UNIX timestamp
    ip: string;
    ua: string;

    toPlainObject() {
        return {
            role: this.role,
            id: this.id,
            username: this.username,
            exp: this.exp,
            ip: this.ip,
            ua: this.ua,
        }
    }
}