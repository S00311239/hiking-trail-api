import request from "supertest";
import { app } from "../../app";
import { connectDB } from "../../config/database";


beforeAll(async () => {
await connectDB();
});


describe('GET /hikes', () => {

    //it deines one individual test
    it('returns all hikes', async () => {

        const response = await request(app)
            .get('/api/v1/hikes')

        expect(response.status).toBe(200);
        
    });


    it("should return 404 when a hike does not exist", async () => {
        const response = await request(app)
            .get("/api/v1/hikes/507f1f77bcf86cd799439011");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Hike not found");
    });

    it("should return only hikes matching the requested difficulty", async () => {
    const response = await request(app)
        .get("/api/v1/hikes?difficulty=easy");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    expect(
        response.body.every(
            (hike: { difficulty: string }) => hike.difficulty === "easy"
        )
    ).toBe(true);
});


});

describe("POST /hikes", () => {

    it("should create a new hike", async () => {

        const newHike = {
            "name": "K2",
            "location": "Nepal",
            "description": "Most dangeraous mountain in the world",
            "distanceInKm": 123,
            "difficulty": "hard",
            "duration": 679
        }


        const response = await request(app)
            .post('/api/v1/hikes')
            .send(newHike);

    expect(response.status).toBe(201);

    });

    it("should reject a hike with invalid difficulty", async () => {
    const invalidHike = {
        name: "K2",
        location: "Nepal",
        description: "A challenging mountain",
        distanceInKm: 123,
        difficulty: "extreme",
        duration: 679
    };

    const response = await request(app)
        .post('/api/v1/hikes')
        .send(invalidHike);

    expect(response.status).toBe(400);
    });
    
    it("should reject a hike with a missing name", async () => {
    const invalidHike = {
        location: "Ireland",
        description: "A hike missing its name",
        distanceInKm: 5,
        difficulty: "easy",
        duration: 120
    };

    const response = await request(app)
        .post("/api/v1/hikes")
        .send(invalidHike);

    expect(response.status).toBe(400);
});

});

describe("GET /hikes/:id", () => {
    it("should return a hike by its ID", async () => {

        const newHike = {
            name: "K2",
            location: "Nepal",
            description: "A challenging mountain",
            distanceInKm: 123,
            difficulty: "hard",
            duration: 679
        };

        const createResponse = await request(app)
            .post("/api/v1/hikes")
            .send(newHike);

        const hikeId = createResponse.body._id;

        const response = await request(app)
            .get(`/api/v1/hikes/${hikeId}`);

        expect(response.status).toBe(200);
        expect(response.body._id).toBe(hikeId);
        expect(response.body.name).toBe("K2");
    });
});

describe("DELETE /hikes/:id", () => {
    it("should delete a hike by its ID", async () => {
        const newHike = {
            name: "Test Hike",
            location: "Ireland",
            description: "A hike created for testing deletion",
            distanceInKm: 5,
            difficulty: "easy",
            duration: 120
        };

        const createResponse = await request(app)
            .post("/api/v1/hikes")
            .send(newHike);

        const hikeId = createResponse.body._id;

        const deleteResponse = await request(app)
            .delete(`/api/v1/hikes/${hikeId}`);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body._id).toBe(hikeId);

        // Confirm the hike no longer exists
        const getResponse = await request(app)
            .get(`/api/v1/hikes/${hikeId}`);

        expect(getResponse.status).toBe(404);
    });

    it("should return 404 when the hike does not exist", async () => {
        const response = await request(app)
            .delete("/api/v1/hikes/507f1f77bcf86cd799439011");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Hike not found");
    });
});



describe("PUT /hikes/:id", () => {
    it("should update an existing hike", async () => {
        const newHike = {
            name: "Test Hike",
            location: "Ireland",
            description: "A hike created for testing updates",
            distanceInKm: 5,
            difficulty: "easy",
            duration: 120
        };

        const createResponse = await request(app)
            .post("/api/v1/hikes")
            .send(newHike);

        const hikeId = createResponse.body._id;

        const updatedHike = {
            name: "Updated Hike",
            location: "Scotland",
            description: "An updated hike for testing",
            distanceInKm: 10,
            difficulty: "medium",
            duration: 180
        };

        const response = await request(app)
            .put(`/api/v1/hikes/${hikeId}`)
            .send(updatedHike);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Updated Hike");
        expect(response.body.location).toBe("Scotland");
        expect(response.body.distanceInKm).toBe(10);
    });

    it("should return 404 when the hike does not exist", async () => {
        const updatedHike = {
            name: "Updated Hike",
            location: "Ireland",
            description: "A hike that does not exist",
            distanceInKm: 10,
            difficulty: "medium",
            duration: 180
        };

        const response = await request(app)
            .put("/api/v1/hikes/507f1f77bcf86cd799439011")
            .send(updatedHike);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Hike not found");
    });

});

it("should reject an update with invalid difficulty", async () => {
    const newHike = {
        name: "Test Hike",
        location: "Ireland",
        description: "A hike created for testing validation",
        distanceInKm: 5,
        difficulty: "easy",
        duration: 120
    };

    const createResponse = await request(app)
        .post("/api/v1/hikes")
        .send(newHike);

    const hikeId = createResponse.body._id;

    const invalidUpdate = {
        name: "Updated Hike",
        location: "Ireland",
        description: "Testing invalid difficulty",
        distanceInKm: 10,
        difficulty: "extreme",
        duration: 180
    };

    const response = await request(app)
        .put(`/api/v1/hikes/${hikeId}`)
        .send(invalidUpdate);

    expect(response.status).toBe(400);
});