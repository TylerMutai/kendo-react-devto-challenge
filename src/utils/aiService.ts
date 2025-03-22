"use server";

import aiPrompt from "@/utils/aiPrompt";

const promptAI = async (messages: { content: string; role: "system" | "user" }[]) => {
  console.log("messages: ", messages);
  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [{content: aiPrompt, role: "system"}, ...messages],
        "model": "deepseek-chat",
        "frequency_penalty": 0,
        "max_tokens": 2048,
        "presence_penalty": 0,
        "response_format": {
          "type": "text",
        },
        "stop": null,
        "stream": false,
        "stream_options": null,
        "temperature": 1,
        "top_p": 1,
        "tools": null,
        "tool_choice": "none",
        "logprobs": false,
        "top_logprobs": null,
      }),
    });
    const json = await res.json();
    return json?.choices?.map((c: any) => c.message?.content).join("\n");
  } catch (e) {
    console.error(e);
    return '';
  }

};

export default promptAI;