// ── 用户相关类型 ──

export interface User {
  id: number;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

export interface UserSetting {
  brand_name: string;
  activity_guide: string;
  contact_info: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  captcha_key: string;
  captcha_text: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface CaptchaData {
  captcha_key: string;
  captcha_image: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ── 图片生成相关类型 ──

export interface ProviderInfo {
  id: string;
  name: string;
  type: "llm" | "image";
  models: string[];
}

export interface PromptOptimizeRequest {
  user_prompt: string;
  reference_image_url: string;
  subject_image_url?: string;
  llm_provider: string;
  reference_mode: string;
  target_aspect_ratio?: string;
}

export interface PromptOptimizeResponse {
  optimized_prompt: string;
  reference_summary: string | null;
}

export interface ImageGenerateRequest {
  prompt: string;
  img_provider: string;
  img_model: string;
  size: string;
  reference_image_url?: string;
}

export interface ImageGenerateResponse {
  image_url: string;
  prompt: string;
  size: string;
}

export interface UploadResponse {
  url: string;
  filename: string;
  role: string;
}

// ── 比例与分辨率 ──

export interface AspectRatioOption {
  label: string;
  value: string;
  resolutions: Record<string, string>; // "1K" -> "1024x1024", etc.
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { label: "1:1 方图", value: "1:1", resolutions: { "1K": "1024x1024", "2K": "2048x2048", "4K": "4096x4096" } },
  { label: "4:3 横图", value: "4:3", resolutions: { "1K": "1184x888", "2K": "2368x1776", "4K": "4736x3552" } },
  { label: "3:4 竖图", value: "3:4", resolutions: { "1K": "888x1184", "2K": "1776x2368", "4K": "3552x4736" } },
  { label: "3:2 横图", value: "3:2", resolutions: { "1K": "1296x864", "2K": "2592x1728", "4K": "5184x3456" } },
  { label: "2:3 竖图", value: "2:3", resolutions: { "1K": "864x1296", "2K": "1728x2592", "4K": "3456x5184" } },
  { label: "16:9 宽屏", value: "16:9", resolutions: { "1K": "1360x768", "2K": "2720x1536", "4K": "5440x3072" } },
  { label: "9:16 竖屏", value: "9:16", resolutions: { "1K": "768x1360", "2K": "1536x2720", "4K": "3072x5440" } },
  { label: "20:9 超宽", value: "20:9", resolutions: { "1K": "1440x648", "2K": "2880x1296", "4K": "5760x2592" } },
  { label: "9:20 超竖", value: "9:20", resolutions: { "1K": "648x1440", "2K": "1296x2880", "4K": "2592x5760" } },
  { label: "3:1 长条", value: "3:1", resolutions: { "1K": "1536x512", "2K": "3072x1024", "4K": "6144x2048" } },
  { label: "1:3 长条", value: "1:3", resolutions: { "1K": "512x1536", "2K": "1024x3072", "4K": "2048x6144" } },
  { label: "4:5 竖图", value: "4:5", resolutions: { "1K": "896x1120", "2K": "1792x2240", "4K": "3584x4480" } },
  { label: "5:4 横图", value: "5:4", resolutions: { "1K": "1120x896", "2K": "2240x1792", "4K": "4480x3584" } },
];

export const REFERENCE_MODES = [
  { label: "自动（推荐）", value: "auto" },
  { label: "综合参考", value: "full_reference" },
  { label: "仅风格", value: "style_only" },
  { label: "仅构图", value: "composition_only" },
  { label: "仅色彩光影", value: "color_lighting_only" },
  { label: "仅版式", value: "layout_only" },
];

export const RESOLUTIONS = ["1K", "2K", "4K"];
