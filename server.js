import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ APIキー（Renderの環境変数から取得）
const API_KEY = process.env.OPENAI_API_KEY;

// ✅ AI呼び出し
async function callAI(prompt) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await res.json();

  // デバッグ表示
  console.log("AIレスポンス:", data);

  if (!data.choices) {
    return "❌ AI応答エラー";
  }

  return data.choices[0].message.content;
}

// ✅ APIエンドポイント
app.post("/api", async (req, res) => {
  const text = req.body.text;

  const prompt = `
あなたはSNS投稿をチェックするAIです。

投稿:
「${text}」

以下を出力してください：

【想定コメント】
3つ

【添削改善】
自然で印象良く書き直す

【スコア】
100点満点で評価

【炎上リスク】
低・中・高＋理由
`;

  const result = await callAI(prompt);

  res.json({ result });
});

// ✅ Render対応ポート（これが超重要）
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("✅ server running on port " + PORT);
});
