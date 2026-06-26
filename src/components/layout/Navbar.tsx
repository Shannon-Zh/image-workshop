import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
            内容生成工作台
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/settings" className="text-sm text-gray-600 hover:text-gray-900">
                  个人设置
                </Link>
                {user.is_admin && (
                  <Link to="/admin" className="text-sm text-gray-600 hover:text-gray-900">
                    管理后台
                  </Link>
                )}
                <span className="text-sm text-gray-400">{user.email}</span>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  退出
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
                  登录
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
