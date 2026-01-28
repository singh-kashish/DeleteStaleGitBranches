export type MCPCallPayload = {
  tool: string;
  input: Record<string, any>;
};

export async function callMCP(
  payload: MCPCallPayload
): Promise<any> {
  const url = process.env.MCP_SERVER_URL;

  if (!url) {
    throw new Error(
      "MCP_SERVER_URL is not configured. MCP is not active yet."
    );
  }

  const res = await fetch(`${url}/call`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `MCP call failed (${res.status}): ${text}`
    );
  }

  return res.json();
}
