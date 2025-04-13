import axios from "axios";
import { inject } from "../di/Registry";
import HttpClient from "../http/HttpClient";

export default interface AccountGateway {
    signup (input: any): Promise<any>;
    getAccountById (accountId: string): Promise<any>;
}

export class AccountGatewayHttp implements AccountGateway {
    @inject("httpClient")
    httpClient!: HttpClient;

    async signup(input: any): Promise<any> {
        const response = await this.httpClient.post("http://localhost:3000/signup", input);
        return response;
    }

    async getAccountById(accountId: string): Promise<any> {
        const response = await this.httpClient.get(`http://localhost:3000/accounts/${accountId}`);
        return response;
    }

}
