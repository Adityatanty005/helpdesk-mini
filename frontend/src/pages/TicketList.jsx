import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get("/api/tickets");
        // backend returns { items, next_offset }
        setTickets(res.data.items || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);
  if (loading) return <p className="text-center mt-10">Loading tickets...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Tickets</h1>
        <Link
          to="/tickets/new"
          className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          + New Ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <p className="text-gray-600">
          No tickets found. Create one to get started.
        </p>
      ) : (
        <div className="grid gap-4">
          {tickets.map((t) => (
            <Link
              to={`/tickets/${t._id}`}
              key={t._id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {t.title || "Untitled"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {t.description?.slice(0, 120)}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        t.status === "open"
                          ? "bg-green-100 text-green-800"
                          : t.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
