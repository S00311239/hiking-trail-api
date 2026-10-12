import request from "supertest";
import { app } from "../../app";
import { connectDB } from "../../config/database";


beforeAll(async () => {
await connectDB();
});


describe('GET /cars', () => {

    //it deines one individual test
    it('returns all cars', async () => {

        const response = await request(app)
            .get('/api/v1/cars')
            .set('x-api-key', 'blahblah');

        expect(response.status).toBe(200);
        
    });

    it('returns 401 if no APi key is missing', async () => {

        const response = await request(app)
            .get('/api/v1/cars');

        expect(response.status).toBe(401);


    });
});

describe("POST /cars", () => {

    it("should create a new car", async () => {
        const newCar = {
            make: "Toyota",
            model: "Camry",
            year: 2022,
            color: "Blue"
        };

        const response = await request(app)
            .post('/api/v1/cars')
            .set('x-api-key', 'blahblah')
            .send(newCar);

    expect(response.status).toBe(201);

    });
});

