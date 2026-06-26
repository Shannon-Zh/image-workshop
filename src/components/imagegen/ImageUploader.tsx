import { useState, useCallback, useRef } from "react";

interface ImageUploaderProps {
  onReferenceUpload: (url: string) => void;
  onSubjectUpload: (url: string) => void;
}

export default function ImageUploader({ onReferenceUpload, onSubjectUpload }: ImageUploaderProps) {
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const [subjectPreview, setSubjectPreview] = useState<string | null>(null);
  const [uploadingRef, setUploadingRef] = useState(false);
  const [uploadingSub, setUploadingSub] = useState(false);
  const [error, setError] = useState("");
  const refInputRef = useRef<HTMLInputElement>(null);
  const subInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File, role: "reference" | "subject") => {
      const setPreview = role === "reference" ? setReferencePreview : setSubjectPreview;
      const setUploading = role === "reference" ? setUploadingRef : setUploadingSub;
      const onUpload = role === "reference" ? onReferenceUpload : onSubjectUpload;

      if (file.size > 5 * 1024 * 1024) {
        setError("文件大小不能超过 5MB");
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("仅支持 JPG / PNG / WebP 格式");
        return;
      }

      setError("");
      setUploading(true);

      try {
        // 本地预览
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        // 上传到服务器
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("role", role);

        const resp = await fetch(`http://localhost:8000/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!resp.ok) throw new Error("上传失败");
        const data = await resp.json();
        onUpload(data.url);
      } catch (err: any) {
        setError(err.message || "上传失败");
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [onReferenceUpload, onSubjectUpload]
  );

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">图片上传</h3>

      <div className="grid grid-cols-3 gap-3">
        {/* 参考图 — 占2格 */}
        <div className="col-span-2">
          <div
            onClick={() => !uploadingRef && refInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors h-40 flex flex-col items-center justify-center ${
              referencePreview
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-blue-400 bg-gray-50"
            }`}
          >
            {uploadingRef ? (
              <span className="text-gray-400">上传中...</span>
            ) : referencePreview ? (
              <img src={referencePreview} alt="参考图" className="max-h-full max-w-full object-contain rounded-lg" />
            ) : (
              <>
                <span className="text-2xl mb-1">🖼️</span>
                <span className="text-sm font-medium text-gray-700">参考图（必填）</span>
                <span className="text-xs text-gray-400 mt-1">风格 / 构图参考，上传前不能优化</span>
              </>
            )}
          </div>
          <input
            ref={refInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "reference")}
          />
        </div>

        {/* 主体图 — 占1格 */}
        <div className="col-span-1">
          <div
            onClick={() => !uploadingSub && subInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors h-40 flex flex-col items-center justify-center ${
              subjectPreview
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-blue-400 bg-gray-50"
            }`}
          >
            {uploadingSub ? (
              <span className="text-gray-400 text-sm">上传中...</span>
            ) : subjectPreview ? (
              <img src={subjectPreview} alt="主体图" className="max-h-full max-w-full object-contain rounded-lg" />
            ) : (
              <>
                <span className="text-lg mb-1">📷</span>
                <span className="text-sm font-medium text-gray-700">主体图</span>
                <span className="text-xs text-gray-400 mt-1">选填</span>
              </>
            )}
          </div>
          <input
            ref={subInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "subject")}
          />
        </div>
      </div>

      {error && <div className="text-red-500 text-xs">{error}</div>}
    </div>
  );
}
