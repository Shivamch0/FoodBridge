import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import { User } from "../src/model/user.model.js";

test("health endpoint responds without a database", async () => {
  const response = await request(app).get("/api/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
});

test("auth registration and login work against configured MongoDB", { skip: !process.env.MONGO_TEST_URI }, async () => {
  await mongoose.connect(process.env.MONGO_TEST_URI);
  const email = `integration-${Date.now()}@example.com`;
  try {
    const registration = await request(app).post("/api/auth/register").send({ username: "Integration User", email, password: "StrongPass123!", phoneNumber: "9876543210", role: "donor" });
    assert.equal(registration.status, 201);
    const login = await request.agent(app).post("/api/auth/login").send({ email, password: "StrongPass123!" });
    assert.equal(login.status, 200);
  } finally {
    await User.deleteOne({ email });
    await mongoose.disconnect();
  }
});