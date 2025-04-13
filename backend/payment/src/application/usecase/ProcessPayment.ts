import Transaction from "../../domain/entity/Transaction";
import { inject } from "../../infra/di/Registry";
import { PaymentProcessorFactory } from "../../infra/fallback/PaymentProcessor";
import Queue from "../../infra/queue/Queue";
import TransactionRepository from "../../infra/repository/TransactionRepository";

export default class ProcessPayment {
    @inject("transactionRepository")
    transactionRepository!: TransactionRepository;
    @inject("queue")
    queue!: Queue;

    async execute (input: Input): Promise<void> {
        console.log(input);
        const processor = PaymentProcessorFactory.create();
        const output = await processor.processPayment(input);
        const transaction = Transaction.create(input.externalId, output.tid, input.amount, output.status);
        await this.transactionRepository.saveTransaction(transaction);
        await this.queue.publish("payment_approved", { rideId: input.externalId, transactionTid: output.tid, transactionStatus: output.status });
    }
}

type Input = {
    type: string,
    externalId: string,
    creditCardToken: string,
    amount: number
}
