import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authApi } from "../services/api";

export default function RegisterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"register" | "verify">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }
    if (password.length < 8) {
      setError("密码至少8位，需包含英文字母和数字");
      return;
    }
    if (!/[a-zA-Z]/.test(password)) {
      setError("密码必须包含至少一个英文字母");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("密码必须包含至少一个数字");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.register({ email, password });
      if (res.code) {
        setDevCode(res.code);
        setSuccess(`注册成功，验证码：${res.code}`);
      } else {
        setSuccess("注册成功，验证码已发送到您的邮箱");
      }
      setStep("verify");
    } catch (err: any) {
      setError(err.message || "注册失败");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.verifyEmail({ email, code, purpose: "register" });
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "验证失败");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError("");
    try {
      await authApi.sendCode(email);
      setCountdown(60);
      setSuccess("验证码已重新发送");
    } catch (err: any) {
      setError(err.message || "发送失败");
    }
  };

  if (step === "verify") {
    return (
      <div className="max-w-md mx-auto mt-12">
        <h2 className="text-2xl font-bold text-center mb-8">验证邮箱</h2>
        <form onSubmit={handleVerify} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-5">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg">{success}</div>}

          {devCode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-xs text-yellow-600 mb-1">开发模式 — 自动填充验证码</div>
              <div className="text-3xl font-mono font-bold tracking-widest text-yellow-800">{devCode}</div>
            </div>
          )}

          <p className="text-sm text-gray-500">
            验证码已发送至 <strong>{email}</strong>
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">验证码</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              required
              autoFocus
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center text-2xl tracking-widest"
              placeholder={devCode || "000000"}
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "验证中..." : "验证邮箱"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0}
            className="w-full text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            {countdown > 0 ? `${countdown}秒后重新发送` : "重新发送验证码"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <h2 className="text-2xl font-bold text-center mb-8">注册</h2>
      <form onSubmit={handleRegister} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-5">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="至少8位，含字母+数字"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="再次输入密码"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "注册中..." : "注册"}
        </button>

        <p className="text-center text-sm text-gray-500">
          已有账号？{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            去登录
          </Link>
        </p>
      </form>
    </div>
  );
}
