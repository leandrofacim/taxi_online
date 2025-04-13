import { inject } from "../../infra/di/Registry";
import Ride from "../../domain/entity/Ride";
import RideRepository from "../../infra/repository/RideRepository";
import AccountGateway from "../../infra/gateway/AccountGateway";
import Queue from "../../infra/queue/Queue";

export default class RequestRide {
    @inject("accountGateway")
    accountGateway!: AccountGateway;
    @inject("rideRepository")
    rideRepository!: RideRepository;
    @inject("queue")
    queue!: Queue;

    async execute (input: Input): Promise<Output> {
        const account = await this.accountGateway.getAccountById(input.passengerId);
        if (!account || !account.isPassenger) throw new Error("The requester must be a passenger");
        const hasActiveRide = await this.rideRepository.hasActiveRideByPassengerId(input.passengerId);
        if (hasActiveRide) throw new Error("The requester already have an active ride");
        const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
        await this.rideRepository.saveRide(ride);
        await this.queue.publish("ride_requested", { rideId: ride.getRideId(), passengerName: account.name, status: ride.getStatus() });
        return {
            rideId: ride.getRideId()
        }
    }
}

type Input = {
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
}

type Output = {
    rideId: string
}
