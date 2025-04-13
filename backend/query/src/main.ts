import GetRide from "./application/query/GetRide";
import GetRideCQRS from "./application/query/GetRideCQRS";
import UpdateProjection from "./application/query/UpdateProjection";
import QueryController from "./infra/controller/QueryController";
import QueueController from "./infra/controller/QueueController";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import Registry from "./infra/di/Registry";
import { AccountGatewayHttp } from "./infra/gateway/AccountGateway";
import { PaymentGatewayHttp } from "./infra/gateway/PaymentGateway";
import { RideGatewayHttp } from "./infra/gateway/RideGateway";
import { AxiosAdapter } from "./infra/http/HttpClient";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { RabbitMQAdapter } from "./infra/queue/Queue";


// Main - Composition Root
async function main () {
    Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
    const httpServer = new ExpressAdapter();
    Registry.getInstance().provide("httpClient", new AxiosAdapter());
    Registry.getInstance().provide("httpServer", httpServer);
    Registry.getInstance().provide("rideGateway", new RideGatewayHttp());
    Registry.getInstance().provide("accountGateway", new AccountGatewayHttp());
    Registry.getInstance().provide("paymentGateway", new PaymentGatewayHttp());
    Registry.getInstance().provide("getRide", new GetRide());
    Registry.getInstance().provide("getRideCQRS", new GetRideCQRS());
    new QueryController();
    const queue = new RabbitMQAdapter();
    await queue.connect();
    Registry.getInstance().provide("queue", queue);
    Registry.getInstance().provide("updateProjection", new UpdateProjection());
    new QueueController();
    httpServer.listen(3003);
}

main();
