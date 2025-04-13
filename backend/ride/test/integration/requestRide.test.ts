import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import Registry from "../../src/infra/di/Registry";
import RequestRide from "../../src/application/usecase/RequestRide";
import { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";
import GetRide from "../../src/application/usecase/GetRide";
import { PositionRepositoryDatabase } from "../../src/infra/repository/PositionRepository";
import AccountGateway, { AccountGatewayHttp } from "../../src/infra/gateway/AccountGateway";
import { AxiosAdapter, FetchAdapter } from "../../src/infra/http/HttpClient";

let databaseConnection: DatabaseConnection;
let requestRide: RequestRide;
let getRide: GetRide;
let accountGateway: AccountGateway;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    Registry.getInstance().provide("databaseConnection", databaseConnection);
    const rideRepository = new RideRepositoryDatabase();
    Registry.getInstance().provide("httpClient", new AxiosAdapter());
    // Registry.getInstance().provide("httpClient", new FetchAdapter());
    accountGateway = new AccountGatewayHttp();
    Registry.getInstance().provide("accountGateway", accountGateway);
    Registry.getInstance().provide("rideRepository", rideRepository);
    const positionRepository = new PositionRepositoryDatabase();
        Registry.getInstance().provide("positionRepository", positionRepository);
    requestRide = new RequestRide();
    getRide = new GetRide();
});

test("Deve solicitar uma corrida", async function () {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    const outputSignup = await accountGateway.signup(inputSignup);

    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide.rideId).toBeDefined();
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
    expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
    expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
    expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
    expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
    expect(outputGetRide.status).toBe("requested");;
});

test("Não deve solicitar uma corrida se não for um passageiro", async function () {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        carPlate: "AAA9999",
        isDriver: true
    };
    const outputSignup = await accountGateway.signup(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("The requester must be a passenger"));
});

test("Não deve solicitar uma corrida se o passageiro já tiver uma corrida em andamento", async function () {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    const outputSignup = await accountGateway.signup(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }
    await requestRide.execute(inputRequestRide);
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("The requester already have an active ride"));
});

test("Não deve solicitar uma corrida se a latitude ou longitude estiverem inválidas", async function () {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    const outputSignup = await accountGateway.signup(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -140,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("The latitude is invalid"));
});

afterEach(async () => {
    await databaseConnection.close();
});
