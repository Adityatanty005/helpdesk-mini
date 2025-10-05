import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import TicketList from "./pages/TicketList";
import TicketNew from "./pages/NewTicket";
import TicketDetail from "./pages/TicketDetails";
import { getUser, clearToken, clearUser } from "./utils/auth";
import { Button, ButtonLink } from "./components/ui/Button";

function Header() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    clearUser();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-100">
      <div className="max-w-[var(--max-w-content)] mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/tickets" className="text-lg sm:text-xl font-semibold text-gray-900">
          <span className="text-indigo-600">Help</span>Desk
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <ButtonLink to="/tickets/new" size="sm" className="hidden sm:inline-flex">
            + New Ticket
          </ButtonLink>
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:block text-sm text-gray-700">{user.name}</div>
              <Button
                variant="ghost"
                size="sm"
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <ButtonLink to="/login" variant="ghost" size="sm">
              Login
            </ButtonLink>
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
      <main className="max-w-[var(--max-w-content)] mx-auto p-4 sm:p-6">
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
