export async function onRequest() {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch("https://vpn-keys.ru/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `Upstream returned ${res.status}` }),
        { status: 502, headers: corsHeaders }
      );
    }

    const html = await res.text();

    // Page is sorted newest-first, so first vless:// is the latest key
    const match = html.match(/vless:\/\/[^\s"'<\n]+/);

    if (!match) {
      return new Response(
        JSON.stringify({ error: "No vless:// key found on the page." }),
        { status: 404, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ key: match[0] }),
      { headers: corsHeaders }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}