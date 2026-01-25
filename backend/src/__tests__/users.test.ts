import request from "supertest";
import { afterAll, expect, it } from "@jest/globals";
import { db } from "../db/supabaseClient.js";
import { describe } from "node:test";
import app from "../app.js";
import { strictMatchFields } from "../utils/cmp.js";

let createdJWTs: Array<string> = [];

const logCreatedJWT = (response: any) => {
    if (response.body == undefined) {
        return;
    }

    if (response.body.jwt == undefined) {
        return;
    }

    createdJWTs.push(response.body.jwt);
};

const matchUsers = (userA: any, userB: any): boolean =>
    strictMatchFields(userA, userB, [
        "id",
        "email",
        "name",
        "username",
        "bio",
        "profile_picture",
    ]);

describe("POST /api/users", () => {
    const path = "/api/users";

    it("should be unimplemented pending an investigation into auth testing", () => {
        console.warn("Test suite is unimplemented due to auth warnings");
    });

    /*it("should return 400 if no email is passed", async () => {
        let response = await request(app)
            .post(path)
            .send({ password: "auto-test-pass" });

        logCreatedJWT(response);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Non-empty email is required");
    });

    it("should return 400 if no password is passed", async () => {
        let response = await request(app)
            .post(path)
            .send({ email: "auto-test@corkboard.com" });

        logCreatedJWT(response);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Non-empty password is required");
    });

    it("should return 500 if an in-use email is passed", async () => {
        let response = await request(app).post(path).send({
            email: "auto-test-inuse@gmail.com",
            password: "any-password",
        });

        logCreatedJWT(response);

        expect(response.statusCode).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBeDefined();
    });

    it("should return 200 if a valid email and password are passed", async () => {
        let user = {
            email: "cork.test@gmail.com",
            password: "auto-test-pass",
        };

        let response = await request(app).post(path).send(user);

        logCreatedJWT(response);

        expect(response.statusCode).toBe(200);
        expect(response.body.success);
        expect(response.body.jwt).toBeDefined();

        let id = (await db.auth.validateJWT(response.body.jwt)).data.user?.id!;

        let userInDb = await db.users.getById(id);

        expect(matchUsers(user, userInDb));
    });*/
});

afterAll(async () => {
    for (let i = 0; i < createdJWTs.length; i++) {
        let jwt = createdJWTs[i]!;

        let id = (await db.auth.validateJWT(jwt)).data.user?.id!;

        console.log("Cleaning up user: ", id);
        await db.auth.deleteUser(id);
    }
});
