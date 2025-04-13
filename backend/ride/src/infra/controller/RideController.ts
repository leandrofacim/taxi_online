import GetRide from "../../application/usecase/GetRide";
import { inject } from "../di/Registry";
import HttpServer from "../http/HttpServer";

export default class RideController {
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("getRide")
    getRide!: GetRide;

    constructor () {
        this.httpServer.register("get", "/rides/:{rideId}", async (params: any, body: any) => {
            const output = await this.getRide.execute(params.rideId);
            return output;
        });
    }
    
}