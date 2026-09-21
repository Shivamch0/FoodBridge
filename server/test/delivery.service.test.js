import test from "node:test";
import assert from "node:assert/strict";
import { statusTransitions } from "../src/services/delivery.service.js";

test("delivery status transitions allow the expected lifecycle", () => {
  assert.deepEqual(statusTransitions.assigned, ["accepted", "failed"]);
  assert.deepEqual(statusTransitions.in_transit, ["delivered", "failed"]);
  assert.deepEqual(statusTransitions.delivered, ["completed"]);
});

test("delivery status transitions reject terminal-state changes", () => {
  assert.deepEqual(statusTransitions.completed, []);
  assert.deepEqual(statusTransitions.failed, []);
});