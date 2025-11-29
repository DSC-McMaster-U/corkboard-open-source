import request from "supertest";
import { describe, it, expect, afterAll } from "@jest/globals";
import app from "../app.js";
import { strictMatchFields } from "../utils/cmp.js";
import { db } from "../db/supabaseClient.js";

let createdIds: Array<string> = [];

const logId = (response: any) => {
    if (response.body == undefined) {
        return;
    }

    if (response.body.id == undefined) {
        return;
    }

    createdIds.push(response.body.id);
};

describe("POST /api/venues", () => {
    let path = "/api/venues";

    it("should return 400 if no name is passed", async () => {
        let response = await request(app).post(path).send({
            venue_type: "bar",
            address: "123 Test St.",
            latitude: 0,
            longitude: 0,
        });

        logId(response);

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

        logId(response);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.id).toBeDefined();

        let venueInDb = await request(app).get(path + `?id={body.id}`);

        expect(
            strictMatchFields(venueInDb, venue, [
                "name",
                "venue_type",
                "address",
                "latitude",
                "longitude",
            ])
        );
    });
});

afterAll(async () => {
    for (let i = 0; i < createdIds.length; i++) {
        let id = createdIds[i]!;

        console.log("Cleaning up venue: ", id);
        await db.venues.deleteById(id);
    }
});
