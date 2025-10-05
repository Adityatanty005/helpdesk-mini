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
    <header className="bg-white shadow-sm">
      <div className="max-w-[var(--max-w-content)] mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/tickets" className="text-xl font-bold text-indigo-600">
          Helpdesk
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="/tickets/new"
            className="text-sm text-indigo-600 hover:underline"
          >
            + New Ticket
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-700">{user.name}</div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm text-indigo-600 hover:underline"
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-[var(--max-w-content)] mx-auto p-4">
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
