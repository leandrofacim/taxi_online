import UUID from "../vo/UUID";

export default class Transaction {
    transactionId: UUID;
    externalId: UUID;

    constructor (transactionId: string, externalId: string, readonly tid: string, readonly amount: number, readonly status: string) {
        this.transactionId = new UUID(transactionId);
        this.externalId = new UUID(externalId);
    }

    static create (externalId: string, tid: string, amount: number, status: string) {
        const transactionId = UUID.create();
        return new Transaction(transactionId.getValue(), externalId, tid, amount, status);
    }
}
