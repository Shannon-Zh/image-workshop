// 开发环境：使用 VITE_API_BASE 或自动检测当前 host（手机访问自动适配）
const API_BASE = import.meta.env.VITE_API_BASE
  || (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? `http://${window.location.hostname}:8000`
    : "http://localhost:8000");

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 如果不是 FormData，设置 Content-Type
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const resp = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: "请求失败" }));
    throw new Error(err.detail || `HTTP ${resp.status}`);
  }

  return resp.json();
}

// ── 认证 ──
export const authApi = {
  getCaptcha: () => request<{ captcha_key: string; captcha_image: string }>("/api/auth/captcha"),

  register: (data: { email: string; password: string }) =>
    request<{ message: string; email: string; code?: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  verifyEmail: (data: { email: string; code: string; purpose: string }) =>
    request<{ message: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  sendCode: (email: string, purpose: string = "register") =>
    request<{ message: string }>(`/api/auth/send-code?email=${encodeURIComponent(email)}&purpose=${purpose}`, {
      method: "POST",
    }),

  login: (data: { email: string; password: string; captcha_key: string; captcha_text: string }) =>
    request<import("../types").TokenResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: () => request<import("../types").User>("/api/auth/me"),
};

// ── 上传 ──
export const uploadApi = {
  upload: async (file: File, role: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);
    return request<import("../types").UploadResponse>(`/api/upload`, {
      method: "POST",
      body: formData,
    });
  },
};

// ── 生成 ──
export const generateApi = {
  getProviders: () =>
    request<{ providers: import("../types").ProviderInfo[] }>("/api/generate/models/providers"),

  optimizePrompt: (data: import("../types").PromptOptimizeRequest) =>
    request<import("../types").PromptOptimizeResponse>("/api/generate/prompt", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  generateImage: (data: import("../types").ImageGenerateRequest) =>
    request<import("../types").ImageGenerateResponse>("/api/generate/image", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── 用户设置 ──
export const userApi = {
  getSettings: () => request<import("../types").UserSetting>("/api/user/settings"),

  updateSettings: (data: import("../types").UserSetting) =>
    request<import("../types").UserSetting>("/api/user/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ── 管理员 ──
export const adminApi = {
  getStats: () => request<any>("/api/admin/stats"),
  listUsers: () => request<any[]>("/api/admin/users"),
  toggleUser: (userId: number, isActive: boolean) =>
    request<any>(`/api/admin/users/${userId}/status?is_active=${isActive}`, { method: "PATCH" }),
  listTags: (module?: string) =>
    request<any[]>(module ? `/api/admin/tags?module=${module}` : "/api/admin/tags"),
  createTag: (data: any) => request<any>("/api/admin/tags", { method: "POST", body: JSON.stringify(data) }),
  updateTag: (id: number, data: any) =>
    request<any>(`/api/admin/tags/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteTag: (id: number) => request<any>(`/api/admin/tags/${id}`, { method: "DELETE" }),
  listStrategies: () => request<any[]>("/api/admin/strategies"),
  createStrategy: (data: any) =>
    request<any>("/api/admin/strategies", { method: "POST", body: JSON.stringify(data) }),
  updateStrategy: (id: number, data: any) =>
    request<any>(`/api/admin/strategies/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteStrategy: (id: number) => request<any>(`/api/admin/strategies/${id}`, { method: "DELETE" }),
};
