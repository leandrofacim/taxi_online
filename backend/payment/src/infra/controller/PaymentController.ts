import GetTransactionsByExternalId from "../../application/usecase/GetTransactionsByExternalId";
import ProcessPayment from "../../application/usecase/ProcessPayment";
import { inject } from "../di/Registry";
import HttpServer from "../http/HttpServer";

// Interface Adapter
export default class PaymentController {
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("processPayment")
    processPayment!: ProcessPayment;
    @inject("getTransactionsByExternalId")
    getTransactionsByExternalId!: GetTransactionsByExternalId;

    constructor () {
        this.httpServer.register("post", "/process_payment", async (params: any, body: any) => {
            const input = body;
            const output = await this.processPayment.execute(input);
            return output;
        });

        this.httpServer.register("get", "/transactions/:{externalId}", async (params: any, body: any) => {
            const output = await this.getTransactionsByExternalId.execute(params.externalId);
            return output;
        });
    }

}
