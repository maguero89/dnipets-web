// Test alternative AI API endpoints

async function testGroq() {
  console.log("Testing Groq / Llama 3 free endpoint...");
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer gsk_free_demo_test"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: "Hola VetAI" }]
      })
    });
    console.log("Groq Status:", res.status, await res.text());
  } catch (e) {
    console.error("Groq error:", e.message);
  }
}

async function testHuggingFace() {
  console.log("\nTesting HuggingFace free Inference API...");
  try {
    const res = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: "Hola VetAI" })
    });
    console.log("HuggingFace Status:", res.status, await res.text());
  } catch (e) {
    console.error("HuggingFace error:", e.message);
  }
}

async function testOpenRouter() {
  console.log("\nTesting OpenRouter free endpoint...");
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemma-2-9b-it:free",
        messages: [{ role: "user", content: "Hola VetAI" }]
      })
    });
    console.log("OpenRouter Status:", res.status, await res.text());
  } catch (e) {
    console.error("OpenRouter error:", e.message);
  }
}

async function testAll() {
  await testGroq();
  await testHuggingFace();
  await testOpenRouter();
}

testAll();
