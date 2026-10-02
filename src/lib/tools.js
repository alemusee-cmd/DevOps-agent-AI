// first tool: check_service_health
// second tool: get_recent-logs
// third tool: get_production_info

import { tool } from "@openai/agents";
import { z } from "z";

export const checkServiceHealth=tool({
    name:"check_service_health",
    description:"checks the api....",
    parameters: z.object({}),

    async execute () {
    console.log("check_service_health running");   
    }
});

export const getRecentLogs=tool({
 name:"get_recent-logs",
    description:"returns the last 20 lines.....",
    parameters: z.object({}),

    async execute () {
    console.log("get_recent-logs running");   
    }
});

export const getProductionInfo=tool({
 name:"get_production_info",
    description:"returns which version of....",
    parameters: z.object({}),

    async execute () {
    console.log("get_production_info running");   
    }
});