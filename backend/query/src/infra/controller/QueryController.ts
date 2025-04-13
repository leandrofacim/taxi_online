import GetRide from "../../application/query/GetRide";
import GetRideCQRS from "../../application/query/GetRideCQRS";
import { inject } from "../di/Registry";
import HttpServer from "../http/HttpServer";

export default class QueryController {
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("getRide")
    getRide!: GetRide;
    @inject("getRideCQRS")
    getRideCQRS!: GetRideCQRS;

    constructor () {
        this.httpServer.register("get", "/rides/:{rideId}", async (params: any, body: any) => {
            return this.getRide.execute(params.rideId);
        });
        this.httpServer.register("get", "/rides_cqrs/:{rideId}", async (params: any, body: any) => {
            return this.getRideCQRS.execute(params.rideId);
        });
    }
}