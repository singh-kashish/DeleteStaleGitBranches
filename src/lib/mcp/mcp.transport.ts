/**
 * MCP Transport Layer
 * Domain-friendly adapter over MCP protocol
 */

const MCP_BASE_URL = process.env.MCP_SERVER_URL;

/* ---------------- Types ---------------- */

export interface MCPCallPayload {
  tool: string;
  input: unknown;
}

/**
 * Transport contract used by MCP clients
 */
export interface McpTransport {
  call<T = unknown>(
    tool: string,
    payload: Record<string, unknown>
  ): Promise<T>;
}


/* ---------------- Low-level protocol call ---------------- */

async function rawCallMCP<T>(payload: MCPCallPayload): Promise<T> {
  if (!MCP_BASE_URL) {
    throw new Error("MCP_SERVER_URL is not configured");
  }
  console.log('K>',MCP_BASE_URL);
  const res = await fetch(`${MCP_BASE_URL}/call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MCP call failed: ${text}`);
  }

  return res.json();
}

/* ---------------- Default transport ---------------- */

export const httpMcpTransport: McpTransport = {
  call<T>(tool: string, args: unknown) {
    return rawCallMCP<T>({
      tool,
      input: args,
    });
  },
};
