import DatabaseConnection from "../../infra/database/DatabaseConnection";
import { inject } from "../../infra/di/Registry";
import GetRide from "./GetRide";

function sleep (time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

export default class UpdateProjection {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async execute (event: string, input: any): Promise<void> {
        if (event === "ride_requested") {
            await this.connection.query("insert into ccca.ride_projection (ride_id, account_passenger_name, ride_status) values ($1, $2, $3)", [input.rideId, input.passengerName, input.status]);
        }
        if (event === "ride_accepted") {
            await this.connection.query("update ccca.ride_projection set account_driver_name = $1, ride_status = $2 where ride_id = $3", [input.driverName, input.status, input.rideId]);
        }
        if (event === "ride_started") {
            await this.connection.query("update ccca.ride_projection set ride_status = $1 where ride_id = $2", [input.status, input.rideId]);
        }
        if (event === "ride_position_updated") {
            await this.connection.query("update ccca.ride_projection set ride_fare = $1, ride_distance = $2, ride_status = $3 where ride_id = $4", [input.fare, input.distance, input.status, input.rideId]);
        }
        if (event === "ride_completed") {
            await this.connection.query("update ccca.ride_projection set ride_status = $1 where ride_id = $2", [input.status, input.rideId]);
        } 
        if (event === "payment_approved") {
            await this.connection.query("update ccca.ride_projection set transaction_tid = $1, transaction_status = $2 where ride_id = $3", [input.transactionTid, input.transactionStatus, input.rideId]);
        }
    }

}
