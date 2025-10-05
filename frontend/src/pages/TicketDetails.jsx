import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { getUser } from "../utils/auth";

export default function TicketDetails() {
  const { id } = useParams();
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

        // backend returns the ticket object directly
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

      // append the created comment
      setComments((prev) => [...prev, data]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Error adding comment.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="mx-auto mt-8">
      <div className="bg-white rounded-lg shadow p-6 max-w-full">
        <h1 className="text-2xl font-semibold mb-2">{ticket?.title}</h1>
        <p className="text-sm text-gray-600 mb-4">{ticket?.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div>
            Status: <span className="capitalize">{ticket?.status}</span>
          </div>
          <div>
            Created: {ticket && new Date(ticket.createdAt).toLocaleDateString()}
          </div>
        </div>

        <hr className="my-4" />

        <h2 className="text-lg font-medium mb-3">Comments</h2>
        {comments.length === 0 ? (
          <p className="text-gray-500 mb-4">No comments yet.</p>
        ) : (
          <ul className="space-y-3 mb-6">
            {comments.map((c) => (
              <li key={c._id} className="bg-gray-50 rounded-md p-3">
                <p className="text-sm">{c.text}</p>
                <small className="text-gray-400">
                  — {c.author?.name || c.user?.name || "Unknown"} at{" "}
                  {new Date(c.createdAt).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAddComment} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border border-gray-200 rounded-md p-3 h-28 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="submit"
            className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Comment
          </button>
        </form>
      </div>
    </div>
  );
}
