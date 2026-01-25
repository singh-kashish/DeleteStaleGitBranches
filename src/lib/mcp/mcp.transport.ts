/**
 * MCP Transport Layer
 * Safe-by-default implementation
 */

const MCP_BASE_URL = process.env.MCP_SERVER_URL;

/**
 * Call an MCP tool
 * Falls back gracefully if MCP is not configured
 */
export async function callMCP<TInput, TOutput>(
  tool: string,
  input: TInput
): Promise<TOutput> {
  if (!MCP_BASE_URL) {
    throw new Error(
      "MCP_SERVER_URL is not configured. MCP is not active yet."
    );
  }

  const url = `${MCP_BASE_URL}/call`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tool,
      input,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MCP call failed: ${text}`);
  }

  return res.json();
}
