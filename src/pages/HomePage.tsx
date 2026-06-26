import { Link } from "react-router-dom";

const modules = [
  {
    key: "video",
    title: "短视频脚本",
    desc: "AI 智能生成抖音短视频脚本，支持口播、剧情、混剪等多类型",
    icon: "🎬",
    available: false,
  },
  {
    key: "moment",
    title: "朋友圈转发语",
    desc: "自动生成适配朋友圈的营销转发文案，精准触达目标受众",
    icon: "💬",
    available: false,
  },
  {
    key: "image",
    title: "AI 生图",
    desc: "上传参考图 + 输入需求 → AI 智能优化提示词 → 一键出图",
    icon: "🎨",
    available: true,
  },
];

export default function HomePage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">内容生成工作台</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          为单词科记品牌加盟商提供一站式内容创作工具，让专业内容触手可及
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <div
            key={mod.key}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow"
          >
            <div className="text-5xl mb-4">{mod.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{mod.title}</h3>
            <p className="text-gray-500 text-sm mb-6 flex-1">{mod.desc}</p>
            {mod.available ? (
              <Link
                to={`/${mod.key}`}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                立即使用
              </Link>
            ) : (
              <button
                disabled
                className="w-full bg-gray-100 text-gray-400 py-3 rounded-xl font-medium cursor-not-allowed"
              >
                即将上线
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
