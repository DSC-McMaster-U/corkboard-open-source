import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../app.js";

// TODO: Replace the bypass token with an actual token for a test user
let bypassUserToken = "TESTING_BYPASS";

type Event = {
    id: string; // UUID
    title: string;
    venue_id: string; // UUID
    // TODO Change tests to account for joins with venue table
    //venue_name: string;
    //venue_address: string;
    description?: string;
    start_time: string;
    cost: number | null; // Can be null
    status: string;
    created_at: string;
    source_type?: string | null;
    source_url?: string | null;
    venues?: {
        id: string;
        name: string;
        address: string | null;
        venue_type: string | null;
    };
};

describe("GET /api/events/", () => {
    let path = "/api/events";

    it("should return at most 10 events if no limit is provided", async () => {
        let response = await request(app).get(path);

        let count: number = response.body.count;
        let events: Array<Event> = response.body.events;

        expect(count).toBeLessThanOrEqual(10);
        expect(count).toBeGreaterThan(0);
        expect(events.length).toBe(count);
    });

    it("should return at most the amount of events defined in by the limit", async () => {
        let limit = 2;
        let response = await request(app).get(path + `?limit=${limit}`);

        let count: number = response.body.count;
        let events: Array<Event> = response.body.events;

        expect(count).toBeLessThanOrEqual(limit);
        expect(count).toBeGreaterThan(0);
        expect(events.length).toBe(count);
    });

    it("should only return events later than the start date range", async () => {
        let min_start_time = new Date("2026-01-01");
        let response = await request(app).get(
            path + `?min_start_time=${min_start_time.toISOString()}`
        );

        let events: Array<Event> = response.body.events;

        expect(response.body.count).toBeGreaterThan(0);

        events.forEach((event) => {
            expect(new Date(event.start_time).getTime()).toBeGreaterThanOrEqual(
                min_start_time.getTime()
            );
        });
    });

    it("should only return events before than the end date range", async () => {
        let max_start_time = new Date("2026-01-01");
        let response = await request(app).get(
            path + `?max_start_time=${max_start_time.toISOString()}`
        );

        let events: Array<Event> = response.body.events;

        expect(response.body.count).toBeGreaterThan(0);

        events.forEach((event) => {
            expect(new Date(event.start_time).getTime()).toBeLessThanOrEqual(
                max_start_time.getTime()
            );
        });
    });

    it("should only return events as or more expensive than the min cost", async () => {
        let min_cost = 15;
        let response = await request(app).get(path + `?min_cost=${min_cost}`);

        let events: Array<Event> = response.body.events;

        expect(events.length).toBeGreaterThan(0);

        events.forEach((event) => {
            expect(event.cost).toBeGreaterThanOrEqual(min_cost);
        });
    });

    it("should only return events as or less expensive than the max cost", async () => {
        let max_cost = 15;
        let response = await request(app).get(path + `?max_cost=${max_cost}`);

        let events: Array<Event> = response.body.events;

        expect(events.length).toBeGreaterThan(0);

        events.forEach((event) => {
            expect(event.cost).toBeLessThanOrEqual(max_cost);
        });
    });

    it("should only return events within the radius of the location", async () => {
        console.warn(
            "This test is not implemented, will be implemented in MVP 2"
        );
    });

    it("should only return events within the 10km of the Hamilton if no location is provided", async () => {
        console.warn(
            "This test is not implemented, will be implemented in MVP 2"
        );
    });
});
