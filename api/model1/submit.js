const MODEL1_ENDPOINT = "https://model1-s2-1.onrender.com/quiz/submit";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "method-not-allowed" });
    return;
  }

  try {
    const upstreamResponse = await fetch(MODEL1_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
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
    console.error("Model 1 proxy request failed", error);
    response.status(502).json({ error: "model1-proxy-failed" });
  }
}
