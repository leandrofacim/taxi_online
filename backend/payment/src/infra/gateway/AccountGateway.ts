import axios from "axios";

export default interface AccountGateway {
    signup (input: any): Promise<any>;
    getAccountById (accountId: string): Promise<any>;
}

export class AccountGatewayHttp implements AccountGateway {

    async signup(input: any): Promise<any> {
        const response = await axios.post("http://localhost:3000/signup", input);
        return response.data;
    }

    async getAccountById(accountId: string): Promise<any> {
        const response = await axios.get(`http://localhost:3000/accounts/${accountId}`);
        return response.data;
    }

}
