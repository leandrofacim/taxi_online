// Chain of Responsibility

import { CieloPaymentGateway, PJBankPaymentGateway } from "../gateway/PaymentGateway";
import Retry from "../retry/Retry";

export default interface PaymentProcessor {
    next?: PaymentProcessor;
    processPayment (input: any): Promise<any>;
}

export class CieloPaymentProcessor implements PaymentProcessor {
    
    constructor (readonly next?: PaymentProcessor) {
    }

    async processPayment(input: any): Promise<any> {
        try {
            const gateway = new CieloPaymentGateway();
            const output = await gateway.processTransaction(input);
            return output;
        } catch (_: any) {
            if (!this.next) throw new Error("No processor");
            return this.next.processPayment(input);
        }
    }

}

export class PJBankPaymentProcessor implements PaymentProcessor {
    
    constructor (readonly next?: PaymentProcessor) {
    }

    async processPayment(input: any): Promise<any> {
        try {
            const gateway = new PJBankPaymentGateway();
            let output;
            await Retry.execute(async () => {
                output = await gateway.processTransaction(input);
            }, 3, 1000);
            if (!output) throw new Error();
            return output;
        } catch (_: any) {
            if (!this.next) throw new Error("No processor");
            return this.next.processPayment(input);
        }
    }

}

export class PaymentProcessorFactory {
    static create () {
        const cieloProcessor = new CieloPaymentProcessor();
        const pjBankProcessor = new PJBankPaymentProcessor(cieloProcessor);
        // default
        return pjBankProcessor;
    }
}