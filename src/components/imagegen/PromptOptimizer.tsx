import { useState } from "react";
import { generateApi } from "../../services/api";
import { REFERENCE_MODES, ASPECT_RATIOS } from "../../types";

interface PromptOptimizerProps {
  userPrompt: string;
  referenceImageUrl: string;
  subjectImageUrl: string;
  onApplyPrompt: (prompt: string) => void;
}

export default function PromptOptimizer({
  userPrompt,
  referenceImageUrl,
  subjectImageUrl,
  onApplyPrompt,
}: PromptOptimizerProps) {
  const [referenceMode, setReferenceMode] = useState("auto");
  const [targetAspect, setTargetAspect] = useState("");
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const canOptimize = !!referenceImageUrl && !optimizing;

  const handleOptimize = async () => {
    if (!canOptimize) return;
    setError("");
    setOptimizing(true);

    try {
      const res = await generateApi.optimizePrompt({
        user_prompt: userPrompt || "请生成一张图片",
        reference_image_url: `http://localhost:8000${referenceImageUrl}`,
        subject_image_url: subjectImageUrl ? `http://localhost:8000${subjectImageUrl}` : undefined,
        llm_provider: "mimo",
        reference_mode: referenceMode,
        target_aspect_ratio: targetAspect || undefined,
      });
      setOptimizedPrompt(res.optimized_prompt);
      setSummary(res.reference_summary || "");
    } catch (err: any) {
      setError(err.message || "优化失败");
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">提示词优化</h3>

      <div className="flex gap-3">
        <select
          value={referenceMode}
          onChange={(e) => setReferenceMode(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {REFERENCE_MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <select
          value={targetAspect}
          onChange={(e) => setTargetAspect(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">目标比例（可选）</option>
          {ASPECT_RATIOS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleOptimize}
        disabled={!canOptimize}
        title={!referenceImageUrl ? "请先上传参考图" : undefined}
        className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${
          canOptimize
            ? "bg-purple-600 text-white hover:bg-purple-700"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {optimizing ? "思考中..." : "🪄 优化提示词"}
      </button>

      {error && <div className="text-red-500 text-xs">{error}</div>}

      {optimizedPrompt && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="text-xs font-medium text-gray-500">优化结果</div>
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">{optimizedPrompt}</pre>
          {summary && (
            <div className="text-xs text-gray-400 border-t border-gray-200 pt-2 mt-2">
              参考图分析：{summary}
            </div>
          )}
          <button
            onClick={() => onApplyPrompt(optimizedPrompt)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            应用此提示词
          </button>
        </div>
      )}
    </div>
  );
}
