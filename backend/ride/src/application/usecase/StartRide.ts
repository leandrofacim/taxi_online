import { inject } from "../../infra/di/Registry";
import Queue from "../../infra/queue/Queue";
import RideRepository from "../../infra/repository/RideRepository";

export default class StartRide {
    @inject("rideRepository")
    rideRepository!: RideRepository;
    @inject("queue")
    queue!: Queue;

    async execute (input: Input): Promise<void> {
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.start();
        await this.rideRepository.updateRideStatus(ride);
        await this.queue.publish("ride_started", { rideId: ride.getRideId(), status: ride.getStatus() });
    }
}

type Input = {
    rideId: string
}
