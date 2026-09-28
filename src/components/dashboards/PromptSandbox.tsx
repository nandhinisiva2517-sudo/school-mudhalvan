"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export function PromptSandbox() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setResponse("");

    const res = await fetch("/api/ai/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) { setError(json.error ?? "Request failed"); return; }
    setResponse(json.response);
  }

  return (
    <div className="rounded-2xl border p-6" style={{ background: "#0F0D1A", borderColor: "rgba(124,92,252,0.3)" }}>
      <h3 className="font-baloo text-lg font-bold mb-1" style={{ color: "#FFF9F0" }}>🤖 Prompt Engineering Sandbox</h3>
      <p className="text-sm mb-4" style={{ color: "rgba(255,249,240,0.5)" }}>
        Experiment with prompts. The AI response is generated server-side — your API key is always safe.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="Enter your prompt here... (max 2000 chars)"
          className="w-full p-3 rounded-xl text-sm font-mono resize-none outline-none transition-all"
          style={{ background: "#1A1630", border: "1.5px solid rgba(124,92,252,0.25)", color: "#FFF9F0", fontFamily: "JetBrains Mono, monospace" }}
          onFocus={(e) => e.target.style.borderColor = "rgba(124,92,252,0.7)"}
          onBlur={(e) => e.target.style.borderColor = "rgba(124,92,252,0.25)"}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "rgba(255,249,240,0.3)" }}>{prompt.length}/2000</span>
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-5 py-2 rounded-full text-sm font-semibold disabled:opacity-40 transition-all"
            style={{ background: "var(--spark-tech)", color: "#fff" }}
          >
            {loading ? "Generating…" : "Run Prompt ↵"}
          </button>
        </div>
      </form>
      {error && <p className="mt-3 text-sm" style={{ color: "var(--spark-secondary)" }}>{error}</p>}
      {response && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl text-sm"
          style={{ background: "#1A1630", border: "1.5px solid rgba(124,92,252,0.2)", color: "rgba(255,249,240,0.85)", whiteSpace: "pre-wrap", fontFamily: "Figtree, sans-serif", lineHeight: 1.7 }}
        >
          {response}
        </motion.div>
      )}
    </div>
  );
}