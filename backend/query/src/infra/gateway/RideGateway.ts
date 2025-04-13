import axios from "axios";
import { inject } from "../di/Registry";
import HttpClient from "../http/HttpClient";

export default interface RideGateway {
    getRideByRideId (rideId: string): Promise<any>;
}

export class RideGatewayHttp implements RideGateway {
	@inject("httpClient")
	httpClient!: HttpClient;

	async getRideByRideId(rideId: string): Promise<any> {
		const output = await this.httpClient.get(`http://localhost:3001/rides/${rideId}`);
		return output;
	}

}