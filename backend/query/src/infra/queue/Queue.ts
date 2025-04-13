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
        await channel.assertExchange("ride_requested", "direct", { durable: true });
        await channel.assertExchange("ride_accepted", "direct", { durable: true });
        await channel.assertExchange("ride_started", "direct", { durable: true });
        await channel.assertExchange("ride_position_updated", "direct", { durable: true });
        await channel.assertExchange("ride_completed", "direct", { durable: true });
        await channel.assertExchange("payment_approved", "direct", { durable: true });

        await channel.assertQueue("ride_requested.update_projection", { durable: true });
        await channel.bindQueue("ride_requested.update_projection", "ride_requested", "");

        await channel.assertQueue("ride_accepted.update_projection", { durable: true });
        await channel.bindQueue("ride_accepted.update_projection", "ride_accepted", "");

        await channel.assertQueue("ride_started.update_projection", { durable: true });
        await channel.bindQueue("ride_started.update_projection", "ride_started", "");

        await channel.assertQueue("ride_position_updated.update_projection", { durable: true });
        await channel.bindQueue("ride_position_updated.update_projection", "ride_position_updated", "");

        await channel.assertQueue("payment_approved.update_projection", { durable: true });
        await channel.bindQueue("payment_approved.update_projection", "payment_approved", "");

        await channel.assertQueue("ride_completed.process_payment", { durable: true });
        await channel.assertQueue("ride_completed.update_projection", { durable: true });
        await channel.bindQueue("ride_completed.process_payment", "ride_completed", "");
        await channel.bindQueue("ride_completed.update_projection", "ride_completed", "");
        channel.consume(queue, async (msg: any) => {
            const input = JSON.parse(msg.content.toString());
            await callback(input);
            channel.ack(msg);
        });
    }

}
