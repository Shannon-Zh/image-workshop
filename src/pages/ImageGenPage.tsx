import { useState } from "react";
import ImageUploader from "../components/imagegen/ImageUploader";
import PromptOptimizer from "../components/imagegen/PromptOptimizer";
import ImageParams from "../components/imagegen/ImageParams";

export default function ImageGenPage() {
  const [userPrompt, setUserPrompt] = useState("");
  const [referenceImageUrl, setReferenceImageUrl] = useState("");
  const [subjectImageUrl, setSubjectImageUrl] = useState("");
  const [resultImageUrl, setResultImageUrl] = useState("");

  const handleApplyPrompt = (prompt: string) => {
    setUserPrompt(prompt);
  };

  const handleDownload = async () => {
    if (!resultImageUrl) return;
    try {
      const resp = await fetch(resultImageUrl);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generated_${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(resultImageUrl, "_blank");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">AI 生图</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左栏 — 输入区 */}
        <div className="lg:w-[55%] space-y-6">
          {/* 提示词输入 */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">提示词</h3>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full h-[200px] px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm"
              placeholder="输入您想要生成图片的文字描述..."
            />
          </div>

          {/* 图片上传 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <ImageUploader
              onReferenceUpload={setReferenceImageUrl}
              onSubjectUpload={setSubjectImageUrl}
            />
          </div>

          {/* 提示词优化 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <PromptOptimizer
              userPrompt={userPrompt}
              referenceImageUrl={referenceImageUrl}
              subjectImageUrl={subjectImageUrl}
              onApplyPrompt={handleApplyPrompt}
            />
          </div>

          {/* 生图参数 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <ImageParams
              prompt={userPrompt}
              referenceImageUrl={referenceImageUrl}
              onImageGenerated={setResultImageUrl}
            />
          </div>
        </div>

        {/* 右栏 — 结果展示区 */}
        <div className="lg:w-[45%]">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">结果展示</h3>

            {resultImageUrl ? (
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-xl p-2">
                  <img
                    src={resultImageUrl}
                    alt="生成结果"
                    className="w-full rounded-lg object-contain"
                    style={{ maxHeight: "500px" }}
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  下载图片
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center text-gray-400">
                <div className="text-5xl mb-3">🖼️</div>
                <p className="text-sm">生成图片后将在此处展示</p>
                <p className="text-xs mt-1">输入提示词并点击生成</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
