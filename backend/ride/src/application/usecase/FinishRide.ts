import { inject } from "../../infra/di/Registry";
import RideRepository from "../../infra/repository/RideRepository";
import PositionRepository from "../../infra/repository/PositionRepository";
import Mediator from "../../infra/mediator/Mediator";
import PaymentGateway from "../../infra/gateway/PaymentGateway";
import Queue from "../../infra/queue/Queue";

export default class FinishRide {
    @inject("positionRepository")
    positionRepository!: PositionRepository;
    @inject("rideRepository")
    rideRepository!: RideRepository;
    @inject("paymentGateway")
    paymentGateway!: PaymentGateway;
    @inject("queue")
    queue!: Queue;

    async execute (input: Input): Promise<void> {
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.finish();
        await this.rideRepository.updateRide(ride);
        const event = { rideId: input.rideId, externalId: input.rideId, type: "ride", amount: ride.getFare(), creditCardToken: "", status: ride.getStatus() };
        // await this.paymentGateway.processPayment(event);
        await this.queue.publish("ride_completed", event);
    }
}

type Input = {
    rideId: string
}
