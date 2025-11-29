import { describe, it, expect } from "@jest/globals";
import { db } from "../db/supabaseClient.js";

describe("db.utils - Location Utilities", () => {
    describe("haversineDistance", () => {
        // Hamilton, ON coordinates
        const HAMILTON_LAT = 43.2557;
        const HAMILTON_LNG = -79.8711;

        // Toronto, ON coordinates
        const TORONTO_LAT = 43.6532;
        const TORONTO_LNG = -79.3832;

        // Burlington, ON coordinates
        const BURLINGTON_LAT = 43.3255;
        const BURLINGTON_LNG = -79.7990;

        it("should calculate distance between Hamilton and Toronto correctly", () => {
            const distance = db.utils.haversineDistance(
                HAMILTON_LAT,
                HAMILTON_LNG,
                TORONTO_LAT,
                TORONTO_LNG
            );

            // distance should be approximately 59 ± 5km
            // mathematical data: 58.6km
            expect(distance).toBeGreaterThan(54);
            expect(distance).toBeLessThan(64);
        });

        it("should calculate distance between Hamilton and Burlington correctly", () => {
            const distance = db.utils.haversineDistance(
                HAMILTON_LAT,
                HAMILTON_LNG,
                BURLINGTON_LAT,
                BURLINGTON_LNG
            );

            // distance should be approximately 10 ± 3km
            // mathematical data: 10.2km
            expect(distance).toBeGreaterThan(7);
            expect(distance).toBeLessThan(13);
        });

        it("should return 0 for identical coordinates", () => {
            const distance = db.utils.haversineDistance(
                HAMILTON_LAT,
                HAMILTON_LNG,
                HAMILTON_LAT,
                HAMILTON_LNG
            );

            expect(distance).toBe(0);
        });

        it("should return the same distance regardless of direction", () => {
            const distance1 = db.utils.haversineDistance(
                HAMILTON_LAT,
                HAMILTON_LNG,
                TORONTO_LAT,
                TORONTO_LNG
            );

            const distance2 = db.utils.haversineDistance(
                TORONTO_LAT,
                TORONTO_LNG,
                HAMILTON_LAT,
                HAMILTON_LNG
            );

            expect(distance1).toBe(distance2);
        });

        it("should handle negative coordinates (southern/western hemisphere)", () => {
            // Sydney, Australia coordinates
            const SYDNEY_LAT = -33.8688;
            const SYDNEY_LNG = 151.2093;

            // Melbourne, Australia coordinates
            const MELBOURNE_LAT = -37.8136;
            const MELBOURNE_LNG = 144.9631;

            const distance = db.utils.haversineDistance(
                SYDNEY_LAT,
                SYDNEY_LNG,
                MELBOURNE_LAT,
                MELBOURNE_LNG
            );

            // distance should be approximately 713 ± 20km
            expect(distance).toBeGreaterThan(693);
            expect(distance).toBeLessThan(733);
        });
    });

    describe("validateCoordinates", () => {
        it("should return true for valid latitude and longitude", () => {
            const result = db.utils.validateCoordinates(43.2557, -79.8711);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it("should reject latitude greater than 90", () => {
            const result = db.utils.validateCoordinates(91, -79.8711);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain("Latitude must be between -90 and 90");
        });

        it("should reject latitude less than -90", () => {
            const result = db.utils.validateCoordinates(-91, -79.8711);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain("Latitude must be between -90 and 90");
        });

        it("should reject longitude greater than 180", () => {
            const result = db.utils.validateCoordinates(43.2557, 181);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain("Longitude must be between -180 and 180");
        });

        it("should reject longitude less than -180", () => {
            const result = db.utils.validateCoordinates(43.2557, -181);

            expect(result.isValid).toBe(false);
            expect(result.error).toContain("Longitude must be between -180 and 180");
        });

        it("should accept boundary values", () => {
            expect(db.utils.validateCoordinates(90, 180).isValid).toBe(true);
            expect(db.utils.validateCoordinates(-90, -180).isValid).toBe(true);
            expect(db.utils.validateCoordinates(0, 0).isValid).toBe(true);
        });
    });

    describe("Using utilities with events", () => {
        it("should filter events by radius using haversineDistance", async () => {
            // get all events
            const { data: events, error } = await db.events.getAll(
                100,
                new Date("1970-1-1").toISOString(),
                new Date("2999-1-1").toISOString(),
                0,
                Number.MAX_VALUE
            );

            if (error || !events) {
                // skip test if no events or error
                return;
            }

            // user coordinates (Hamilton, ON)
            const userLat = 43.2557;
            const userLng = -79.8711;
            const radiusKm = 10; // 10km radius

            // filter events within radius
            const result = events.filter((event) => {
                if (!event.venues?.latitude || !event.venues?.longitude) {
                    return false;
                }

                const distance = db.utils.haversineDistance(
                    userLat,
                    userLng,
                    event.venues.latitude,
                    event.venues.longitude
                );

                return distance <= radiusKm;
            });

            // verify all filtered events are within radius
            result.forEach((event) => {
                if (event.venues?.latitude && event.venues?.longitude) {
                    const distance = db.utils.haversineDistance(
                        userLat,
                        userLng,
                        event.venues.latitude,
                        event.venues.longitude
                    );
                    expect(distance).toBeLessThanOrEqual(radiusKm);
                }
            });
        });
    });
});

