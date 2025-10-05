import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [nextOffset, setNextOffset] = useState(null);
  const [breached, setBreached] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const params = { limit, offset };
        if (breached) params.breached = true;
        const res = await api.get("/api/tickets", { params });
        setTickets((prev) =>
          offset === 0
            ? res.data.items || []
            : [...prev, ...(res.data.items || [])]
        );
        setNextOffset(res.data.next_offset ?? null);
      } catch (err) {
        console.error(err);
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [offset, breached]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-error-50 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-error-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-error-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Your Tickets
          </h1>
          <p className="text-neutral-600">
            Manage and track all your support requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={breached}
              onChange={() => {
                setOffset(0);
                setBreached(!breached);
              }}
            />
            Show breached
          </label>
          <Link to="/tickets/new" className="btn-primary">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Ticket
          </Link>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-100 rounded-full mb-6">
            <svg
              className="w-10 h-10 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
            No tickets yet
          </h2>
          <p className="text-neutral-600 mb-6">
            Get started by creating your first support ticket
          </p>
          <Link to="/tickets/new" className="btn-primary">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create First Ticket
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {tickets.map((t) => (
            <Link
              to={`/tickets/${t._id}`}
              key={t._id}
              className="card-hover p-6 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors truncate">
                      {t.title || "Untitled"}
                    </h3>
                    <span
                      className={`flex-shrink-0 ${
                        t.status === "open"
                          ? "badge-success"
                          : t.status === "in-progress"
                          ? "badge-warning"
                          : "badge-neutral"
                      }`}
                    >
                      {t.status === "in-progress"
                        ? "In Progress"
                        : t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </span>
                    {/* breached indicator */}
                    {t.SLA_deadline &&
                      new Date(t.SLA_deadline) < Date.now() &&
                      t.status !== "closed" && (
                        <span className="ml-2 inline-block text-xs font-semibold text-error-600">
                          Breached
                        </span>
                      )}
                  </div>
                  <p className="text-neutral-600 line-clamp-2 mb-3">
                    {t.description?.slice(0, 150) || "No description provided"}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <div className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {new Date(t.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {t.SLA_deadline && (
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          Due:{" "}
                          {new Date(t.SLA_deadline).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}

      {nextOffset !== null && nextOffset > offset && (
        <div className="text-center mt-6">
          <button
            className="btn-secondary"
            onClick={() => setOffset(nextOffset)}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
