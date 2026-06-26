import { useState, useEffect } from "react";
import { userApi } from "../services/api";
import type { UserSetting } from "../types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSetting>({
    brand_name: "",
    activity_guide: "",
    contact_info: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    userApi
      .getSettings()
      .then(setSettings)
      .catch(() => setMessage("加载设置失败"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await userApi.updateSettings(settings);
      setMessage("保存成功！");
    } catch {
      setMessage("保存失败");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">加载中...</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-8">个人设置</h2>
      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-5">
        {message && (
          <div className={`text-sm p-3 rounded-lg ${message.includes("成功") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
            {message}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">品牌名称</label>
          <input
            type="text"
            value={settings.brand_name ?? ""}
            onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder='如 "鹏起成才" 或 "单词科记"'
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">当期活动引导</label>
          <textarea
            value={settings.activity_guide ?? ""}
            onChange={(e) => setSettings({ ...settings, activity_guide: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-24 resize-none"
            placeholder='如 "报名暑期集训营，加微信 xxx"'
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">联系方式</label>
          <input
            type="text"
            value={settings.contact_info ?? ""}
            onChange={(e) => setSettings({ ...settings, contact_info: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="微信号或手机号"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "保存中..." : "保存设置"}
        </button>
      </form>
    </div>
  );
}
