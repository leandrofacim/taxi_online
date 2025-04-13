import DatabaseConnection from "../../infra/database/DatabaseConnection";
import { inject } from "../../infra/di/Registry";
import AccountGateway from "../../infra/gateway/AccountGateway";
import PaymentGateway from "../../infra/gateway/PaymentGateway";
import RideGateway from "../../infra/gateway/RideGateway";

export default class GetRideCQRS {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async execute (rideId: string): Promise<any> {
        const [rideData] = await this.connection.query("select * from ccca.ride_projection where ride_id = $1", [rideId]);
        return rideData
    }
}
