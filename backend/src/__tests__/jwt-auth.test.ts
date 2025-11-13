import request from "supertest";
import { describe, it, expect, beforeAll } from "@jest/globals";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import app from "../app.js";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

const TEST_USER_EMAIL = "test_auth@example.com";
const TEST_USER_PASSWORD = "testpassword123";

const TEST_EVENT_ID = "2430b29f-0bd3-4d49-9b70-9c8a0b26bf8e"; // "Test Event"

describe("JWT Authentication", () => {
    let jwtToken: string;
    let supabase: ReturnType<typeof createClient>;

    beforeAll(async () => {
        // note: test setup creates its own Supabase client for getting JWT tokens
        // this is acceptable for test setup - application code uses db layer
        supabase = createClient(supabaseUrl, supabaseAnonKey);

        // sign in to get JWT token
        const { data, error } = await supabase.auth.signInWithPassword({
            email: TEST_USER_EMAIL,
            password: TEST_USER_PASSWORD,
        });

        if (error || !data?.session) {
            throw new Error(
                `Failed to get JWT token: ${error?.message || "No session"}`
            );
        }

        jwtToken = data.session.access_token;
        console.log("JWT token obtained for testing");
    });

    // 1. test valid JWT token
    it("should successfully authenticate with valid JWT token", async () => {
        const response = await request(app)
            .get("/api/users/")
            .set("Authorization", `Bearer ${jwtToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.user).toBeDefined();
        expect(response.body.user.id).toBeDefined();
    });

    // 2. test invalid JWT token
    it("should return 401 with invalid JWT token", async () => {
        const response = await request(app)
            .get("/api/users/")
            .set("Authorization", "Bearer invalid_token_12345");

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    // 3. test empty Bearer token
    it("should return 401 with empty Bearer token", async () => {
        const response = await request(app)
            .get("/api/users/")
            .set("Authorization", "Bearer ");

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    // 4. test malformed Authorization header
    it("should return 401 with malformed Authorization header", async () => {
        const response = await request(app)
            .get("/api/users/")
            .set("Authorization", "InvalidFormat token");

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    // 5. test missing Authorization header
    it("should return 401 without Authorization header", async () => {
        const response = await request(app).get("/api/users/");

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    // 6. test only 'Bearer' (with no token provided)
    it("should return 401 with only 'Bearer' (no token)", async () => {
        const response = await request(app)
            .get("/api/users/")
            .set("Authorization", "Bearer");

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    // 7. test bookmarks endpoint using JWT (GET /api/bookmarks/)
    it("should work with bookmarks endpoint using JWT", async () => {
        const response = await request(app)
            .get("/api/bookmarks/")
            .set("Authorization", `Bearer ${jwtToken}`);

        // should return 200 (even if empty bookmarks array)
        expect(response.statusCode).toBe(200);
        expect(response.body.bookmarks).toBeDefined();
    });

    // 8. test POST & DELETE bookmarks endpoint using JWT
    it("should work with POST bookmarks using JWT", async () => {

        const response = await request(app)
            .post("/api/bookmarks")
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({ eventId: TEST_EVENT_ID });

        // should return 200 (bookmark created) or 418 (already exists)
        expect([200, 418]).toContain(response.statusCode);

        // cleanup: delete bookmark if POST succeeded (idempotency)
        if (response.statusCode === 200) {
            const deleteResponse = await request(app)
                .delete("/api/bookmarks")
                .set("Authorization", `Bearer ${jwtToken}`)
                .send({ eventId: TEST_EVENT_ID });

            expect(deleteResponse.statusCode).toBe(200);
        }
    });

    // 9. test invalid token on bookmarks endpoint
    it("should return 401 with invalid token on bookmarks endpoint", async () => {
        const response = await request(app)
            .get("/api/bookmarks/")
            .set("Authorization", "Bearer invalid_token");

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    // 10. test missing token on POST bookmarks
    it("should return 401 with missing token on POST bookmarks", async () => {
        const response = await request(app)
            .post("/api/bookmarks")
            .send({ eventId: TEST_EVENT_ID });

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    // 11. test expired/invalid token format
    it("should return 401 with expired/invalid token format", async () => {
        // test with a token that looks like JWT but is invalid
        const invalidJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.lol";
        
        const response = await request(app)
            .get("/api/users/")
            .set("Authorization", `Bearer ${invalidJWT}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });
});

