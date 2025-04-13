import axios from "axios";
import { inject } from "../di/Registry";
import HttpClient from "../http/HttpClient";

export default interface PaymentGateway {
    getTransactionsByExternalId (externalId: string): Promise<any>;
}

export class PaymentGatewayHttp implements PaymentGateway {
	@inject("httpClient")
	httpClient!: HttpClient;

	async getTransactionsByExternalId(externalId: string): Promise<any> {
		const output = await this.httpClient.get(`http://localhost:3002/transactions/${externalId}`);
		return output;
	}

}