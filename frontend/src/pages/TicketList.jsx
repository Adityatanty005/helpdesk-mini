import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const LIMIT = 10;

function isBreached(ticket) {
  if (!ticket?.SLA_deadline) return false;
  const due = new Date(ticket.SLA_deadline).getTime();
  const now = Date.now();
  return due < now && String(ticket.status).toLowerCase() !== "closed";
}

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [breachedOnly, setBreachedOnly] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchTickets = async ({ reset = false } = {}) => {
    try {
      if (reset) {
        setLoading(true);
        setOffset(0);
      } else {
        setLoadingMore(true);
      }

      const res = await api.get("/api/tickets", {
        params: {
          limit: LIMIT,
          offset: reset ? 0 : offset,
          search: search || undefined,
          breached: breachedOnly ? "true" : undefined,
        },
      });

      const items = res.data.items || [];
      setTickets((prev) => (reset ? items : [...prev, ...items]));
      const newOffset = (reset ? 0 : offset) + items.length;
      setOffset(newOffset);
      setHasMore(items.length === LIMIT);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTickets({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breachedOnly]);

  useEffect(() => {
    // initial load
    fetchTickets({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitSearch = (e) => {
    e?.preventDefault();
    fetchTickets({ reset: true });
  };

  // ✅ Move the return INSIDE the component
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Tickets</h1>
        <Link
          to="/tickets/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + New Ticket
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : tickets.length === 0 ? (
        <div className="text-center text-gray-500">No tickets found.</div>
      ) : (
        <div className="grid gap-3">
          {tickets.map((t) => (
            <Link
              key={t._id}
              to={`/tickets/${t._id}`}
              className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition ${
                isBreached(t) ? "border-red-400" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {t.title || "Untitled"}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {t.description}
                  </p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  {new Date(t.createdAt).toLocaleDateString()}
                </div>
              </div>

              {t.SLA_deadline && (
                <p
                  className={`mt-2 text-xs ${
                    isBreached(t) ? "text-red-600 font-medium" : "text-gray-500"
                  }`}
                >
                  SLA due: {new Date(t.SLA_deadline).toLocaleDateString()}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
