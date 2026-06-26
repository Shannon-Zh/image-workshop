import { useState, useEffect } from "react";
import { adminApi } from "../services/api";

export default function AdminPage() {
  const [tab, setTab] = useState<"users" | "tags" | "strategies">("users");
  const [stats, setStats] = useState({ total_users: 0, active_users: 0, total_generations: 0, today_generations: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [_tags, setTags] = useState<any[]>([]);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await adminApi.getStats();
      setStats(statsData);

      if (tab === "users") {
        const usersData = await adminApi.listUsers();
        setUsers(usersData);
      } else if (tab === "tags") {
        const tagsData = await adminApi.listTags();
        setTags(tagsData);
      } else if (tab === "strategies") {
        const stratsData = await adminApi.listStrategies();
        setStrategies(stratsData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const viewUserHistory = async (user: any) => {
    setSelectedUser(user);
    setHistoryLoading(true);
    try {
      const records = await fetch(`http://localhost:8000/api/admin/users/${user.id}/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then((r) => r.json());
      setUserHistory(records);
    } catch (e) {
      console.error(e);
    } finally {
      setHistoryLoading(false);
    }
  };

  const tabs = [
    { key: "users", label: "用户管理" },
    { key: "tags", label: "标签管理" },
    { key: "strategies", label: "策略文件" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">管理员后台</h2>

      {/* 概览统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "总用户数", value: stats.total_users, color: "blue" },
          { label: "活跃用户", value: stats.active_users, color: "green" },
          { label: "总生成次数", value: stats.total_generations, color: "purple" },
          { label: "今日生成", value: stats.today_generations, color: "orange" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{item.value}</div>
            <div className="text-sm text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Tab 导航 */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl border border-gray-200 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">加载中...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 overflow-x-auto">
          {tab === "users" && (
            <div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">邮箱</th>
                    <th className="pb-3 font-medium">品牌</th>
                    <th className="pb-3 font-medium">生成次数</th>
                    <th className="pb-3 font-medium">注册时间</th>
                    <th className="pb-3 font-medium">状态</th>
                    <th className="pb-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-3">{u.id}</td>
                      <td>{u.email}</td>
                      <td>{u.brand_name || "-"}</td>
                      <td>{u.total_generations}</td>
                      <td className="text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs ${u.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {u.is_active ? "活跃" : "禁用"}
                        </span>
                      </td>
                      <td className="space-x-2">
                        <button
                          onClick={() => viewUserHistory(u)}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          查看记录
                        </button>
                        <button
                          onClick={async () => {
                            await adminApi.toggleUser(u.id, !u.is_active);
                            loadData();
                          }}
                          className="text-red-500 hover:underline text-xs"
                        >
                          {u.is_active ? "禁用" : "启用"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 用户生图记录弹窗 */}
              {selectedUser && (
                <div className="mt-6 border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">
                      {selectedUser.email} 的生图记录
                    </h3>
                    <button onClick={() => { setSelectedUser(null); setUserHistory([]); }} className="text-gray-400 hover:text-gray-600 text-sm">
                      关闭
                    </button>
                  </div>
                  {historyLoading ? (
                    <div className="text-center py-8 text-gray-400">加载中...</div>
                  ) : userHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">暂无记录</div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {userHistory.map((h: any) => (
                        <div key={h.id} className="border rounded-lg p-4 flex gap-4">
                          {h.image_url && (
                            <img
                              src={`http://localhost:8000${h.image_url}`}
                              alt="生成图"
                              className="w-24 h-24 object-cover rounded-lg shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400">{new Date(h.created_at).toLocaleString()}</p>
                            <p className="text-sm text-gray-700 mt-1 line-clamp-3 whitespace-pre-wrap">{h.prompt}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {h.img_provider} / {h.img_model} / {h.size}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === "tags" && (
            <div className="text-gray-500 text-center py-8">
              标签管理界面 — 为 Phase 2 准备，当前可通过 API 管理
            </div>
          )}

          {tab === "strategies" && (
            <div className="space-y-4">
              {strategies.map((s) => (
                <div key={s.id} className="border rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{s.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${s.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {s.is_active ? "启用" : "禁用"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{s.description}</p>
                  <pre className="text-xs bg-gray-50 rounded-lg p-3 max-h-40 overflow-auto whitespace-pre-wrap">
                    {s.content.slice(0, 500)}...
                  </pre>
                </div>
              ))}
              {strategies.length === 0 && (
                <div className="text-gray-400 text-center py-8">暂无策略文件</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
