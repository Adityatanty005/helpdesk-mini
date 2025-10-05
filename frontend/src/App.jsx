import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import TicketList from "./pages/TicketList";
import TicketNew from "./pages/NewTicket";
import TicketDetail from "./pages/TicketDetails";
import { getUser, clearToken, clearUser } from "./utils/auth";

function Header() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    clearUser();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b border-gray-200">
      <div className="max-w-[var(--max-w-content)] mx-auto flex items-center justify-between px-5 py-3">
        <Link to="/tickets" className="text-xl font-semibold tracking-tight">
          <span className="text-indigo-600">Help</span>Desk
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden sm:block text-sm text-gray-600">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 text-sm text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <Header />
      <main className="max-w-[var(--max-w-content)] mx-auto p-5">
        <Routes>
          <Route path="/" element={<Navigate to="/tickets" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/tickets/new" element={<TicketNew />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
        </Routes>
      </main>
    </div>
  );
}
