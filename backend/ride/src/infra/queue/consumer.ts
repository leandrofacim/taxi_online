import amqp from "amqplib";

async function main () {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    channel.consume("ride_completed.process_payment", function (msg: any) {
        const input = msg.content.toString();
        console.log(input);
        channel.ack(msg);
    });
}

main();
