import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getUser } from "../utils/auth";

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getUser();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data } = await api.get(`/api/tickets/${id}`);
        setTicket(data);
        setComments(data.comments || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load ticket details.");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id, user?.token]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await api.post(`/api/tickets/${id}/comments`, {
        text: newComment,
      });

      setComments((prev) => [...prev, data]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Error adding comment.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-600">Loading ticket...</p>
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
          <p className="text-error-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => navigate("/tickets")}
            className="btn-secondary"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/tickets")}
        className="btn-ghost mb-6 -ml-2"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Tickets
      </button>

      <div className="card p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-neutral-900 mb-3">
              {ticket?.title}
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed">
              {ticket?.description}
            </p>
          </div>
          <span
            className={`flex-shrink-0 ml-4 ${
              ticket?.status === "open"
                ? "badge-success"
                : ticket?.status === "in-progress"
                ? "badge-warning"
                : "badge-neutral"
            }`}
          >
            {ticket?.status === "in-progress"
              ? "In Progress"
              : ticket?.status
              ? ticket?.status?.charAt(0).toUpperCase() +
                ticket?.status?.slice(1)
              : "Unknown"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-neutral-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-primary-600"
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
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 mb-1">
                Created
              </p>
              <p className="text-neutral-900 font-medium">
                {ticket &&
                  new Date(ticket.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
              </p>
            </div>
          </div>

          {ticket?.SLA_deadline && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-warning-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-warning-600"
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
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">
                  SLA Deadline
                </p>
                <p className="text-neutral-900 font-medium">
                  {new Date(ticket.SLA_deadline).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card p-8">
        {ticket?.events && ticket.events.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">
              Timeline
            </h3>
            <div className="space-y-3">
              {ticket.events.map((e) => (
                <div
                  key={e._id || e.createdAt}
                  className="flex items-start gap-3 text-sm text-neutral-700"
                >
                  <div className="w-8 text-neutral-500">
                    {new Date(e.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900">
                      {e.message}
                    </div>
                    <div className="text-neutral-500">
                      {e.actor?.name || "System"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 mb-6">
          <svg
            className="w-6 h-6 text-neutral-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-neutral-900">
            Comments
            {comments.length > 0 && (
              <span className="ml-2 text-lg font-normal text-neutral-500">
                ({comments.length})
              </span>
            )}
          </h2>
        </div>

        {comments.length === 0 ? (
          <div className="text-center py-8 mb-6 bg-neutral-50 rounded-lg border border-neutral-200">
            <svg
              className="w-12 h-12 text-neutral-300 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-neutral-600">
              No comments yet. Start the conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {comments.map((c) => (
              <div
                key={c._id}
                className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 hover:bg-neutral-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary-700">
                      {(c.author?.name || c.user?.name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-neutral-900">
                        {c.author?.name || c.user?.name || "Unknown"}
                      </span>
                      <span className="text-neutral-400">•</span>
                      <span className="text-sm text-neutral-500">
                        {new Date(c.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-neutral-700 leading-relaxed">{c.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddComment} className="space-y-4">
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Add a comment
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts or updates..."
              className="input-field min-h-[120px] resize-y"
              rows={4}
            />
          </div>
          <button type="submit" className="btn-primary">
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
}
