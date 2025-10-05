// components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { getUser, clearToken, clearUser } from "../utils/auth";

export default function Header() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    clearUser();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
          <Link to="/tickets" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-primary-600 text-white grid place-items-center shadow-soft group-hover:shadow-medium transition-shadow">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">HelpDesk</span>
          </Link>

          <nav className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden sm:inline text-sm text-neutral-600 mr-2">Hi, {user.name}</span>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary">Sign in</Link>
                <Link to="/register" className="btn-primary">Sign up</Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}