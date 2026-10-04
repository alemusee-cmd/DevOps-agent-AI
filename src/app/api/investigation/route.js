import { run } from "@openai/agents";
import { opsAgent } from "../../../lib/agent";
import { saveInvestigation } from "../../../lib/db";

export async function POST(request) {
  const encoder = new TextEncoder();

  // Object => String => bytes => Stream
  const stream = new ReadableStream({
    async start(controller) {
      function send(event) {
        controller.enqueue(encoder.encode(JSON.stringify(event)));
      }

      const toolResults = [];

      try {
        const result = await run(opsAgent, "Investigate orders-api.", {
          stream: true,
          maxTurns: 6,
          signal: AbortSignal.any([
            request.signal,
            AbortSignal.timeout(60_000),
          ]),
        });

        for await (const event of result) {
          if (event.name === "tool_called") {
            send({ type: "tool_called", tool: event.item.rawItem.name });
          }

          const tool = event.item.rawItem.name;

          if (event.name === "tool_output") {
            send({ type: "tool_output", tool, output: event.item.output });
            toolResults.push({ tool, output: event.item.output });
          }
        }
      } catch (error) {}
    },
  });
}
