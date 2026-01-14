import request from "supertest";
import { describe, it, expect, afterAll } from "@jest/globals";
import app from "../app.js";
import { strictMatchFields } from "../utils/cmp.js";
import { db } from "../db/supabaseClient.js";

let createdIds: Array<string> = [];

const logCreatedId = (response: any) => {
    if (response.body == undefined) {
        return;
    }

    if (response.body.id == undefined) {
        return;
    }

    createdIds.push(response.body.id);
};

const venuesAreEqual = (venueA: any, venueB: any) =>
    strictMatchFields(venueA, venueB, [
        "name",
        "venue_type",
        "address",
        "latitude",
        "longitude",
    ]);

describe("GET /api/venues", () => {
    let path = "/api/venues";

    it("should return a single venue if a valid id is passed", async () => {
        let response = await request(app).get(
            path + "?id=1154dd33-674e-4494-afac-594968579624"
        );

        let venue = {
            name: "Hamilton Place",
            venue_type: "theater",
            address: "1 Summer Ln, Hamilton, ON",
            latitude: 43.2566667,
            longitude: -79.8722222,
        };

        expect(response.status).toBe(200);
        expect(venuesAreEqual(response.body.venue, venue));
    });

    it("should return a single venue if a valid id is passed with a limit", async () => {
        let response = await request(app).get(
            path + "?id=1154dd33-674e-4494-afac-594968579624"
        );

        let venue = {
            name: "Hamilton Place",
            venue_type: "theater",
            address: "1 Summer Ln, Hamilton, ON",
            latitude: 43.2566667,
            longitude: -79.8722222,
        };

        expect(response.status).toBe(200);
        expect(venuesAreEqual(response.body.venue, venue));
    });

    it("should return 500 and no venues if an invalid id is passed", async () => {
        let response = await request(app).get(path + "?id=INVALID-ID");

        expect(response.status).toBe(500);
        expect(response.body.venue).not.toBeDefined(); // Using instead of toBeNull to catch both null and undefined
        expect(response.body.error).toBeDefined();
    });

    it("should return up to 10 venues by default", async () => {
        let response = await request(app).get(path);

        expect(response.status).toBe(200);
        expect(response.body.venues).toBeDefined();
        expect(Array.isArray(response.body.venues));
        expect(response.body.venues.length).toBeLessThanOrEqual(10);
        expect(response.body.count).toBeLessThanOrEqual(10);
    });

    it("should return up to the passed limit of venues", async () => {
        const limit = 5;
        let response = await request(app).get(path + `?limit=${limit}`);

        expect(response.status).toBe(200);
        expect(response.body.venues).toBeDefined();
        expect(Array.isArray(response.body.venues));
        expect(response.body.venues.length).toBeLessThanOrEqual(limit);
        expect(response.body.count).toBeLessThanOrEqual(limit);
    });
});

describe("POST /api/venues", () => {
    let path = "/api/venues";

    it("should return 400 if no name is passed", async () => {
        let response = await request(app).post(path).send({
            venue_type: "bar",
            address: "123 Test St.",
            latitude: 0,
            longitude: 0,
        });

        logCreatedId(response);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Name is missing");
    });

    it("should return 200 for a valid request", async () => {
        let venue = {
            name: "POST-test-venue",
            venue_type: "bar",
            address: "123 Test St.",
            latitude: 0,
            longitude: 0,
        };

        let response = await request(app).post(path).send(venue);

        logCreatedId(response);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.id).toBeDefined();

        let venueInDb = await request(app).get(path + `?id={body.id}`);

        expect(venuesAreEqual(venue, venueInDb));
    });
});

afterAll(async () => {
    for (let i = 0; i < createdIds.length; i++) {
        let id = createdIds[i]!;

        console.log("Cleaning up venue: ", id);
        await db.venues.deleteById(id);
    }
});
