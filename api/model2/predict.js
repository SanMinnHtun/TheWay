const MODEL2_ENDPOINT = `${(process.env.MODEL2_API_URL || "https://model2-s2.onrender.com").replace(/\/$/, "")}/api/v1/career/predict`;

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "method-not-allowed" });
    return;
  }

  try {
    const upstreamResponse = await fetch(MODEL2_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(request.body)
    });
    const body = await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      console.error("Model 2 upstream request failed", {
        status: upstreamResponse.status,
        body: body.slice(0, 1000)
      });
      response.status(upstreamResponse.status);
      response.setHeader(
        "Content-Type",
        upstreamResponse.headers.get("content-type") || "application/json"
      );
      response.send(body);
      return;
    }

    response.status(upstreamResponse.status);
    response.setHeader(
      "Content-Type",
      upstreamResponse.headers.get("content-type") || "application/json"
    );
    response.send(body);
  } catch (error) {
    console.error("Model 2 proxy request failed", error);
    response.status(502).json({ error: "model2-proxy-failed" });
  }
}
