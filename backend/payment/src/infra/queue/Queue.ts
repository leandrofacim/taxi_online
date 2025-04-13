import amqp from "amqplib";

export default interface Queue {
    connect (): Promise<void>;
    publish (event: string, input: any): Promise<void>;
    consume (event: string, callback: Function): Promise<void>;
}

export class RabbitMQAdapter implements Queue {
    connection: any;

    constructor () {
    }

    async connect(): Promise<void> {
        this.connection = await amqp.connect("amqp://localhost");
    }

    async publish(exchange: string, input: any): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.assertExchange("ride_completed", "direct", { durable: true });
        await channel.assertQueue("ride_completed.process_payment", { durable: true });
        await channel.bindQueue("ride_completed.process_payment", "ride_completed", "");
        channel.publish(exchange, "", Buffer.from(JSON.stringify(input)));
    }

    async consume(queue: string, callback: Function): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.assertExchange("ride_completed", "direct", { durable: true });
        await channel.assertQueue("ride_completed.process_payment", { durable: true });
        await channel.bindQueue("ride_completed.process_payment", "ride_completed", "");
        channel.consume(queue, async (msg: any) => {
            const input = JSON.parse(msg.content.toString());
            await callback(input);
            channel.ack(msg);
        });
    }

}
