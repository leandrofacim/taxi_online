import axios from "axios";

const BASE_URL = "http://localhost:3000";

// Configure axios to not throw on non-200 status codes
axios.defaults.validateStatus = function () {
    return true;
};

// Test fixtures
const createPassengerInput = () => ({
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "asdQWE123",
    isPassenger: true
});

const createInvalidNameInput = () => ({
    ...createPassengerInput(),
    name: "John" // Invalid name (too short)
});

// Helper functions
const signup = async (input: any) => {
    return await axios.post(`${BASE_URL}/signup`, input);
};

const getAccount = async (accountId: string) => {
    return await axios.get(`${BASE_URL}/accounts/${accountId}`);
};

describe("Account API Integration Tests", () => {
    describe("Signup Flow", () => {
        test("should create a passenger account successfully", async () => {
            // Given
            const input = createPassengerInput();

            // When
            const signupResponse = await signup(input);
            const { accountId } = signupResponse.data;

            // Then
            expect(signupResponse.status).toBe(200);
            expect(accountId).toBeDefined();

            // Verify account details
            const getAccountResponse = await getAccount(accountId);
            const account = getAccountResponse.data;

            expect(account.name).toBe(input.name);
            expect(account.email).toBe(input.email);
            expect(account.cpf).toBe(input.cpf);
            expect(account.isPassenger).toBe(input.isPassenger);
        });

        test("should not create an account with invalid name", async () => {
            // Given
            const input = createInvalidNameInput();

            // When
            const response = await signup(input);

            // Then
            expect(response.status).toBe(422);
            expect(response.data.message).toBe("Invalid name");
        });
    });
});
