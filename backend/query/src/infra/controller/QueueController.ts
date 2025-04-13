import UpdateProjection from "../../application/query/UpdateProjection";
import { inject } from "../di/Registry";
import Queue from "../queue/Queue";

export default class QueueController {
    @inject("queue")
    queue!: Queue;
    @inject("updateProjection")
    updateProjection!: UpdateProjection;

    constructor () {
        this.queue.consume("ride_requested.update_projection", async (input: any) => {
            await this.updateProjection.execute("ride_requested", input);
        });
        this.queue.consume("ride_accepted.update_projection", async (input: any) => {
            await this.updateProjection.execute("ride_accepted", input);
        });
        this.queue.consume("ride_started.update_projection", async (input: any) => {
            await this.updateProjection.execute("ride_started", input);
        });
        this.queue.consume("ride_position_updated.update_projection", async (input: any) => {
            await this.updateProjection.execute("ride_position_updated", input);
        });
        this.queue.consume("ride_completed.update_projection", async (input: any) => {
            await this.updateProjection.execute("ride_completed", input);
        });
        this.queue.consume("payment_approved.update_projection", async (input: any) => {
            console.log(input);
            await this.updateProjection.execute("payment_approved", input);
        });
    }
}