export async function GET() {
  return new Response("google-site-verification: googlee2d45e51890ac94d.html", {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
