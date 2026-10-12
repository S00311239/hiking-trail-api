
import request from "supertest";
import { app } from "../../app";

describe("Server", () => {

    it("should return 404 for an unknown endpoint", async () => {
        const response = await request(app)
            .get("/this-endpoint-does-not-exist");

        expect(response.status).toBe(404);
    });
    
});

