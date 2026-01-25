import request from "supertest";
import { afterAll, expect, it } from "@jest/globals";
import { db } from "../db/supabaseClient.js";
import { describe } from "node:test";
import app from "../app.js";
import { strictMatchFields } from "../utils/cmp.js";

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

const matchUsers = (userA: any, userB: any): boolean =>
    strictMatchFields(userA, userB, [
        "id",
        "email",
        "username",
        "bio",
        "profile_picture",
    ]);

describe("POST /api/users", () => {
    const path = "/api/users";

    it("should return 400 if no email is passed", async () => {
        let response = await request(app)
            .post(path)
            .send({ password: "auto-test-pass" });

        logCreatedId(response);

        console.log(response);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Non-empty email is required");
    });

    it("should return 400 if no password is passed", async () => {
        let response = await request(app)
            .post(path)
            .send({ email: "auto-test@corkboard.com" });

        logCreatedId(response);

        console.log(response);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Non-empty password is required");
    });

    it("should return 500 if an in-use email is passed", async () => {
        let response = await request(app).post(path).send({
            email: "auto-test-500@corkboard.com",
            password: "auto-test-pass",
        });

        logCreatedId(response);

        console.log(response);

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBeDefined();
        expect(response.body.success).toBe(false);
    });

    it("should return 200 if a valid email and password are passed", async () => {
        let user = {
            email: "auto-test@corkboard.com",
            password: "auto-test-pass",
        };

        let response = await request(app).post(path).send(user);

        logCreatedId(response);

        console.log(response);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.id).toBeDefined();

        let userInDb = await db.users.getById(response.body.id);

        expect(matchUsers(user, userInDb));
    });
});

afterAll(async () => {
    for (let i = 0; i < createdIds.length; i++) {
        let id = createdIds[i]!;

        console.log("Cleaning up venue: ", id);
        await db.venues.deleteById(id);
    }
});
