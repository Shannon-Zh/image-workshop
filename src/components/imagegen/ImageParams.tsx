import { useState } from "react";
import { generateApi } from "../../services/api";
import { ASPECT_RATIOS, RESOLUTIONS } from "../../types";

interface ImageParamsProps {
  prompt: string;
  referenceImageUrl: string;
  onImageGenerated: (url: string) => void;
}

export default function ImageParams({ prompt, referenceImageUrl, onImageGenerated }: ImageParamsProps) {
  const [ratioValue, setRatioValue] = useState("1:1");
  const [customRatio, setCustomRatio] = useState("");
  const [resolution, setResolution] = useState("1K");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const isCustom = ratioValue === "custom";
  const currentRatio = ASPECT_RATIOS.find((r) => r.value === ratioValue);
  const size = isCustom
    ? customRatio.replace(":", "x")
    : (currentRatio?.resolutions[resolution] || "1024x1024");

  const handleGenerate = async () => {
    if (!prompt) return;
    setError("");
    setGenerating(true);

    try {
      const res = await generateApi.generateImage({
        prompt,
        img_provider: "highland",
        img_model: "gpt-image-2",
        size,
        reference_image_url: referenceImageUrl ? `http://localhost:8000${referenceImageUrl}` : undefined,
      });
      onImageGenerated(`http://localhost:8000${res.image_url}`);
    } catch (err: any) {
      setError(err.message || "生成失败");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">生图参数</h3>

      <div className="flex gap-3">
        <select
          value={ratioValue}
          onChange={(e) => setRatioValue(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {ASPECT_RATIOS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
          <option value="custom">自定义比例</option>
        </select>

        {!isCustom ? (
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {RESOLUTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={customRatio}
            onChange={(e) => setCustomRatio(e.target.value.replace(/[^\d:]/g, ""))}
            placeholder="宽:高  如 16:9"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        )}
      </div>

      <div className="text-xs text-gray-400 text-center">
        输出尺寸：{size || "请填写比例"}
      </div>

      <button
        onClick={handleGenerate}
        disabled={!prompt || generating || (isCustom && !customRatio)}
        className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${
          prompt && !generating
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {generating ? "生成中..." : "🖼 生成图片"}
      </button>

      {error && <div className="text-red-500 text-xs">{error}</div>}
    </div>
  );
}
