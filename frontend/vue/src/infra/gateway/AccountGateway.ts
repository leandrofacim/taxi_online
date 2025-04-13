import HttpClient from "../http/HttpClient";

export default interface AccountGateway {
    signup (input: any): Promise<any>;
}

export class AccountGatewayHttp implements AccountGateway {

    constructor (readonly httpClient: HttpClient) {
    }

    async signup(input: any): Promise<any> {
        return this.httpClient.post("http://localhost:3000/signup", input);
    }

}

export class AccountGatewayFake implements AccountGateway {

    async signup(input: any): Promise<any> {
        return {
            accountId: "12345678"
        }
    }

}
