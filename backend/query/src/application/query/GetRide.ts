import { inject } from "../../infra/di/Registry";
import AccountGateway from "../../infra/gateway/AccountGateway";
import PaymentGateway from "../../infra/gateway/PaymentGateway";
import RideGateway from "../../infra/gateway/RideGateway";

export default class GetRide {
    @inject("accountGateway")
    accountGateway!: AccountGateway;
    @inject("paymentGateway")
    paymentGateway!: PaymentGateway;
    @inject("rideGateway")
    rideGateway!: RideGateway;

    async execute (rideId: string): Promise<any> {
        const ride = await this.rideGateway.getRideByRideId(rideId);
        ride.passenger = await this.accountGateway.getAccountById(ride.passengerId);
        ride.driver = await this.accountGateway.getAccountById(ride.driverId);
        ride.transactions = await this.paymentGateway.getTransactionsByExternalId(rideId);
        return ride;
    }
}
