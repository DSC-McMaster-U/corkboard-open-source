import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../app.js";

// TODO: Replace the bypass token with an actual token for a test user
let bypassUserToken = "TESTING_BYPASS";

describe("GET /api/bookmarks/", () => {
    let path = "/api/bookmarks/";

    it(`should return status 401 if no authorization is passed`, async () => {
        const response = await request(app).get(path);
        expect(response.status).toBe(401);
    });

    it("should return status 418 with an user not found error for an invalid user", async () => {
        const response = await request(app)
            .get(path)
            .set("Authorization", bypassUserToken);

        expect(response.statusCode).toBe(418);
        expect(JSON.parse(response.body)).toBe({ error: "User not found" });
    });

    it("should return 200 for a valid user with the appropriate bookmarks", async () => {
        const response = await request(app)
            .get(path)
            .set("Authorization", bypassUserToken);

        expect(response.statusCode).toBe(200);
    });
});

describe("POST /api/bookmarks", () => {
    let path = "/api/bookmarks";

    it("should return status 401 if no authorization is passed", async () => {
        const response = await request(app).post(path).send({ eventId: 1 });
        expect(response.statusCode).toBe(401);
    });

    it("should return status 412 if no event id is passed", async () => {
        const response = await request(app)
            .post(path)
            .set("Authorization", bypassUserToken)
            .send({});

        expect(response.statusCode).toBe(412);
    });

    it("should return status 418 if an invalid event id is passed", async () => {
        const response = await request(app)
            .post(path)
            .set("Authorization", bypassUserToken)
            .send({ eventId: -1 });

        expect(response.statusCode).toBe(418);
    });

    it("should return status 418 if an invalid user id is passed", async () => {
        const response = await request(app)
            .post(path)
            .set("Authorization", "Token with invalid user id")
            .send({ eventId: 1 });

        expect(response.statusCode).toBe(418);
    });

    it("should return status 200 for a valid user and event", async () => {
        const response = await request(app)
            .post(path)
            .set("Authorization", bypassUserToken)
            .send({ eventId: 1 });

        expect(response.statusCode).toBe(200);
    });
});

describe("DELETE /api/bookmarks", () => {
    let path = "/api/bookmarks";

    it("should return status 401 if no authorization is passed", async () => {
        const response = await request(app).post(path).send({ eventId: 1 });
        expect(response.statusCode).toBe(401);
    });

    it("should return status 412 if no event id is passed", async () => {
        const response = await request(app)
            .post(path)
            .set("Authorization", bypassUserToken)
            .send({});

        expect(response.statusCode).toBe(412);
    });

    it("should return status 418 if an invalid event id is passed", async () => {
        const response = await request(app)
            .post(path)
            .set("Authorization", bypassUserToken)
            .send({ eventId: -1 });

        expect(response.statusCode).toBe(418);
    });

    it("should return status 418 if an invalid user id is passed", async () => {
        const response = await request(app)
            .post(path)
            .set("Authorization", "Token with invalid user id")
            .send({ eventId: 1 });

        expect(response.statusCode).toBe(418);
    });

    it("should return status 418 if the user does not have this event bookmarked", async () => {
        const response = await request(app)
            .post(path)
            .set("Authorization", bypassUserToken)
            .send({ eventId: 2 });

        expect(response.statusCode).toBe(418);
    });

    it("should return status 200 for a valid user and event", async () => {
        const response = await request(app)
            .post(path)
            .set("Authorization", bypassUserToken)
            .send({ eventId: 1 });

        expect(response.statusCode).toBe(200);
    });
});
