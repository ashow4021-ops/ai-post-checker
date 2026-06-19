import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;


async function callAI(prompt) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await res.json();

  if (!data.choices) {
    console.log("AIレスポンス:", data);
    return "エラー（AI応答失敗）";
  }

  return data.choices[0].message.content;
}

app.post("/api", async (req, res) => {
  const text = req.body.text;

  const prompt = `
あなたはSNS投稿をチェックするAIです。

投稿:
「${text}」

以下をわかりやすく日本語で出力してください：

【想定コメント】
3つ

【添削改善】
投稿を自然で印象良く書き直す

【スコア】
100点満点で評価

【炎上リスク】
低・中・高で判定＋理由
`;

  const result = await callAI(prompt);

  res.json({ result });
});

app.listen(3000, () => {
  console.log("server running http://localhost:3000");
});