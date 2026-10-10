const FIREBASE_ASSISTANT_ENDPOINT =
  "https://us-central1-the-way-6f882.cloudfunctions.net/assistantChat";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "method-not-allowed" });
    return;
  }

  const authorization = request.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    response.status(401).json({ error: "authentication-required" });
    return;
  }

  try {
    const upstreamResponse = await fetch(FIREBASE_ASSISTANT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authorization
      },
      body: JSON.stringify(request.body)
    });
    const body = await upstreamResponse.text();

    response.status(upstreamResponse.status);
    response.setHeader(
      "Content-Type",
      upstreamResponse.headers.get("content-type") || "application/json"
    );
    response.send(body);
  } catch (error) {
    console.error("Firebase assistant proxy request failed", error);
    response.status(502).json({ error: "assistant-proxy-failed" });
  }
}
