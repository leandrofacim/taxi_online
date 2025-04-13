import amqp from "amqplib";

async function main () {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertExchange("ride_completed", "direct", { durable: true });
    await channel.assertQueue("ride_completed.process_payment", { durable: true });
    await channel.bindQueue("ride_completed.process_payment", "ride_completed", "");
    const input = {
        type: "ride",
        externalId: "1234",
        creditCardToken: "asd567tyujkl789",
        amount: 40
    }
    channel.publish("ride_completed", "", Buffer.from(JSON.stringify(input)));
}

main();
