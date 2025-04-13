import { inject } from "../di/Registry";
import HttpClient from "../http/HttpClient";

export default interface AccountGateway {
    getAccountById (accountId: string): Promise<any>;
}

export class AccountGatewayHttp implements AccountGateway {
    @inject("httpClient")
    httpClient!: HttpClient;

    async getAccountById(accountId: string): Promise<any> {
        const output = await this.httpClient.get(`http://localhost:3000/accounts/${accountId}`);
        return output;
    }

}
