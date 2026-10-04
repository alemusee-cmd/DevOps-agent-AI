// first tool: check_service_health
// second tool: get_recent-logs
// third tool: get_production_info

import { tool } from "@openai/agents";
import { z } from "z";
import { callDemoService } from "./demo-service";

export const checkServiceHealth = tool({
  name: "check_service_health",
  description: "checks the orders api /health request GET /api/orders",
  parameters: z.object({}),

  async execute() {
    console.log("check_service_health running");
    const health = await callDemoService("/health");
    const orders = await callDemoService("/api/orders");

    return { health, orders };
  },
});

export const getRecentLogs = tool({
  name: "get_recent-logs",
  description: "returns the last 20 lines of orders api, newest first.",
  parameters: z.object({}),

  async execute() {
    console.log("get_recent-logs running");
    const tesult = await callDemoService("/logs");
    if (!result.body) return result;

    return result.body.map((line) => ({
      ...line,
      message: line.message.slice(0, 200),
    }));
  },
});

export const getProductionInfo = tool({
  name: "get_production_info",
  description: "returns which version of orders api is currently running",
  parameters: z.object({}),

  async execute() {
    console.log("get_production_info running");
    await callDemoService("/version");
  },
});
