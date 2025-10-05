import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { getToken } from "../utils/auth";

export default function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTicket = async () => {
    try {
      const res = await api.get(`/api/tickets/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setTicket(res.data);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Failed to fetch ticket:", err);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await api.post(
        `/api/tickets/${id}/comments`,
        { text: newComment },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading ticket...</p>;
  if (!ticket)
    return <p className="text-center text-red-500 mt-10">Ticket not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {ticket.title}
          </h1>
          <p className="text-gray-600 mt-2 whitespace-pre-line">
            {ticket.description}
          </p>

          <div className="flex items-center gap-3 mt-4 text-sm text-gray-500">
            <span>
              Status:{" "}
              <span className="capitalize font-medium text-gray-700">
                {ticket.status}
              </span>
            </span>
            <span>•</span>
            <span>
              Created on {new Date(ticket.createdAt).toLocaleDateString()}
            </span>
          </div>

          {ticket.SLA_deadline && (
            <p className="text-sm text-gray-500 mt-1">
              SLA Deadline: {new Date(ticket.SLA_deadline).toLocaleDateString()}
            </p>
          )}
        </div>

        <hr className="my-6" />

        <div>
          <h2 className="text-lg font-semibold mb-3">Comments</h2>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm">No comments yet.</p>
            ) : (
              comments.map((c, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-100 rounded-lg p-3"
                >
                  <p className="text-sm text-gray-800">{c.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={addComment} className="mt-5 flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
