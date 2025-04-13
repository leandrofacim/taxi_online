import axios from "axios";

export default interface PaymentGateway {
	processPayment (input: any): Promise<any>;
}

export class PaymentGatewayHttp implements PaymentGateway {

	async processPayment(input: any): Promise<any> {
		const response = await axios.post("http://localhost:3002/process_payment", input);
		return response.data;
	}

}
