import GetRide from "./application/usecase/GetRide";
import RideController from "./infra/controller/RideController";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import Registry from "./infra/di/Registry";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { PositionRepositoryDatabase } from "./infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "./infra/repository/RideRepository";

async function main () {
    const httpServer = new ExpressAdapter();
    Registry.getInstance().provide("httpServer", httpServer);
    Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
    Registry.getInstance().provide("rideRepository", new RideRepositoryDatabase());
    Registry.getInstance().provide("positionRepository", new PositionRepositoryDatabase());
    Registry.getInstance().provide("getRide", new GetRide());
    new RideController();
    httpServer.listen(3001);
}
main();
