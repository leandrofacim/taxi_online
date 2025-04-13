import Registry from "./infra/di/Registry";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter, HapiAdapter } from "./infra/http/HttpServer";
import AuthorizeDecorator from "./application/decorator/AuthorizeDecorator";
import ProcessPayment from "./application/usecase/ProcessPayment";
import PaymentController from "./infra/controller/PaymentController";
import { RabbitMQAdapter } from "./infra/queue/Queue";
import QueueController from "./infra/controller/QueueController";
import { TransactionRepositoryDatabase } from "./infra/repository/TransactionRepository";
import GetTransactionsByExternalId from "./application/usecase/GetTransactionsByExternalId";

// Main - Composition Root
async function main () {
    const databaseConnection = new PgPromiseAdapter();
    const processPayment = new ProcessPayment();
    const httpServer = new ExpressAdapter();
    // const httpServer = new HapiAdapter();
    Registry.getInstance().provide("databaseConnection", databaseConnection);
    Registry.getInstance().provide("transactionRepository", new TransactionRepositoryDatabase());
    Registry.getInstance().provide("processPayment", processPayment);
    Registry.getInstance().provide("getTransactionsByExternalId", new GetTransactionsByExternalId());
    Registry.getInstance().provide("httpServer", httpServer);
    new PaymentController();
    httpServer.listen(3002);
    const queue = new RabbitMQAdapter();
    await queue.connect();
    Registry.getInstance().provide("queue", queue);
    new QueueController();
}

main();
