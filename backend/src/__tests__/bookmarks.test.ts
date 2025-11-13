import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../app.js";

// TODO: Replace the bypass token with an actual token for a test user
let bypassUserToken = "TESTING_BYPASS";

// Real event IDs from database for testing
const REAL_EVENT_ID = "2430b29f-0bd3-4d49-9b70-9c8a0b26bf8e"; // "name"="Test Event"
const REAL_EVENT_ID_2 = "93afb249-5784-4da6-aa42-c35ff8d2286f"; // "name"="Test Event 2"

// Invalid event ID
const INVALID_EVENT_ID = "abcdefgh-ijkl-mnop-qrst-uvwxyzabcdef";

describe("GET /api/bookmarks/", () => {
    let path = "/api/bookmarks/";

    it(`should return status 401 if no authorization is passed`, async () => {
        const response = await request(app).get(path);
        expect(response.status).toBe(401);
    });

    it(`should return status 418 if an invalid user is passed`, async () => {
        console.warn(
            "This test cannot be implemented until JWT decryption is added."
        );
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
        const response = await request(app).post(path).send({ eventId: INVALID_EVENT_ID });
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
            .send({ eventId: INVALID_EVENT_ID });

        expect(response.statusCode).toBe(418);
    });

    it("should return status 401 if an invalid user token is passed", async () => {
        // Invalid token fails authentication before reaching bookmark logic
        const response = await request(app)
            .post(path)
            .set("Authorization", "Token with invalid user id")
            .send({ eventId: INVALID_EVENT_ID });

        expect(response.statusCode).toBe(401);
    });

    it("should return status 200 for a valid user and event", async () => {
        // note: this test will create a bookmark row in the database
        const response = await request(app)
            .post(path)
            .set("Authorization", bypassUserToken)
            .send({ eventId: REAL_EVENT_ID });

        expect(response.statusCode).toBe(200);
    });
});

describe("DELETE /api/bookmarks", () => {
    let path = "/api/bookmarks";

    it("should return status 401 if no authorization is passed", async () => {
        const response = await request(app).delete(path).send({ eventId: INVALID_EVENT_ID });
        expect(response.statusCode).toBe(401);
    });

    it("should return status 412 if no event id is passed", async () => {
        const response = await request(app)
            .delete(path)
            .set("Authorization", bypassUserToken)
            .send({});

        expect(response.statusCode).toBe(412);
    });

    it("should return status 418 if an invalid event id is passed", async () => {
        const response = await request(app)
            .delete(path)
            .set("Authorization", bypassUserToken)
            .send({ eventId: INVALID_EVENT_ID });

        expect(response.statusCode).toBe(418);
    });

    it("should return status 401 if an invalid user token is passed", async () => {
        // invalid token fails authentication before reaching bookmarkService logic
        const response = await request(app)
            .delete(path)
            .set("Authorization", "Token with invalid user id")
            .send({ eventId: INVALID_EVENT_ID });

        expect(response.statusCode).toBe(401);
    });

    it("should return status 418 if the user does not have this event bookmarked", async () => {
        const response = await request(app)
            .delete(path)
            .set("Authorization", bypassUserToken)
            .send({ eventId: REAL_EVENT_ID_2 });

        expect(response.statusCode).toBe(418);
    });

    it("should return status 200 for a valid user and event", async () => {
        // note: this test will delete a bookmark row from the database
        // assumes the bookmark was created by the POST test above
        const response = await request(app)
            .delete(path)
            .set("Authorization", bypassUserToken)
            .send({ eventId: REAL_EVENT_ID });

        expect(response.statusCode).toBe(200);
    });
});
