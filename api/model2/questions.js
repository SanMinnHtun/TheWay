const MODEL2_ENDPOINT = `${(process.env.MODEL2_API_URL || "https://model2-s2.onrender.com").replace(/\/$/, "")}/api/v1/career/questions`;

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "method-not-allowed" });
    return;
  }

  try {
    const upstreamResponse = await fetch(MODEL2_ENDPOINT, {
      headers: { Accept: "application/json" }
    });
    const body = await upstreamResponse.text();
    response.status(upstreamResponse.status);
    response.setHeader("Content-Type", upstreamResponse.headers.get("content-type") || "application/json");
    response.send(body);
  } catch (error) {
    console.error("Model 2 questions proxy request failed", error);
    response.status(502).json({ error: "model2-proxy-failed" });
  }
}
