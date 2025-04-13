import Transaction from "../../domain/entity/Transaction";
import { inject } from "../../infra/di/Registry";
import { PaymentProcessorFactory } from "../../infra/fallback/PaymentProcessor";
import TransactionRepository from "../../infra/repository/TransactionRepository";

export default class GetTransactionsByExternalId {
    @inject("transactionRepository")
    transactionRepository!: TransactionRepository;

    async execute (externalId: string): Promise<any> {
        return this.transactionRepository.getTransactionsByExternalId(externalId);
    }
}
