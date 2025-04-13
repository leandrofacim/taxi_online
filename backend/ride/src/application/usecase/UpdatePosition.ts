import { inject } from "../../infra/di/Registry";
import Ride from "../../domain/entity/Ride";
import RideRepository from "../../infra/repository/RideRepository";
import Position from "../../domain/entity/Position";
import PositionRepository from "../../infra/repository/PositionRepository";
import DistanceCalculator from "../../domain/service/DistanceCalculator";
import FareCalculator, { FareCalculatorFactory } from "../../domain/service/FareCalculator";
import Queue from "../../infra/queue/Queue";

export default class UpdatePosition {
    @inject("positionRepository")
    positionRepository!: PositionRepository;
    @inject("rideRepository")
    rideRepository!: RideRepository;
    @inject("queue")
    queue!: Queue;

    async execute (input: Input): Promise<void> {
        const lastPosition = await this.positionRepository.getLastPositionByRideId(input.rideId);
        const actualPosition = Position.create(input.rideId, input.lat, input.long, input.date);
        await this.positionRepository.savePosition(actualPosition);
        const ride = await this.rideRepository.getRideById(input.rideId);
        if (lastPosition) {
            const distance = DistanceCalculator.calculateFromPositions([lastPosition, actualPosition]);
            const fare = FareCalculatorFactory.create(actualPosition.date).calculate(distance);
            ride.setDistance(ride.getDistance() + distance);
            ride.setFare(ride.getFare() + fare);
            await this.rideRepository.updateRide(ride);
        }
        await this.queue.publish("ride_position_updated", { rideId: ride.getRideId(), fare: ride.getFare(), distance: ride.getDistance(), status: ride.getStatus() });
    }
}

type Input = {
    rideId: string,
    lat: number,
    long: number,
    date?: Date
}
