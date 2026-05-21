/**
 * Vercel Function: /api/claude
 * Claude APIへの安全な中継エンドポイント
 *
 * ブラウザ → /api/claude（Vercelサーバー） → api.anthropic.com
 *
 * APIキーはVercelの環境変数に保管し、ブラウザには一切渡さない
 */

export default async function handler(req, res) {
  // POSTのみ許可
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 環境変数からAPIキーを取得（Vercelダッシュボードで設定）
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    // CORSヘッダー（同一オリジンのみ許可）
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    return res.status(response.status).json(data);
  } catch (err) {
    console.error("Claude API proxy error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

