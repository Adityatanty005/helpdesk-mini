import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header";
import ProtectedRoute from "./components/protected-route";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import TicketList from "./pages/TicketList";
import TicketNew from "./pages/NewTicket";
import TicketDetail from "./pages/TicketDetails";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 [background-size:200%_200%] animate-gradient">
      <Header />
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-10">
        <Routes>
          <Route path="/" element={<Navigate to="/tickets" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tickets" element={<ProtectedRoute><TicketList /></ProtectedRoute>} />
          <Route path="/tickets/new" element={<ProtectedRoute><TicketNew /></ProtectedRoute>} />
          <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}