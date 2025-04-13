import Transaction from "../../domain/entity/Transaction";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default interface TransactionRepository {
    saveTransaction (transaction: Transaction): Promise<void>;
    getTransactionsByExternalId (externalId: string): Promise<Transaction[]>;
}

export class TransactionRepositoryDatabase implements TransactionRepository {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async saveTransaction(transaction: Transaction): Promise<void> {
        await this.connection.query("insert into ccca.transaction (transaction_id, external_id, tid, amount, status) values ($1, $2, $3, $4, $5)", [transaction.transactionId.getValue(), transaction.externalId.getValue(), transaction.tid, transaction.amount, transaction.status]);
    }

    async getTransactionsByExternalId(externalId: string): Promise<Transaction[]> {
        const transactionsData = await this.connection.query("select * from ccca.transaction where external_id = $1", [externalId]);
        const transactions = [];
        for (const transactionData of transactionsData) {
            transactions.push(new Transaction(transactionData.transaction_id, transactionData.external_id, transactionData.tid, parseFloat(transactionData.amount), transactionData.status));
        }
        return transactions;
    }

}
