import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function NewTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [SLA_deadline, setSLA_deadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // SLA_deadline is required by the backend model
    if (!SLA_deadline) {
      setError("Please provide an SLA deadline.");
      setLoading(false);
      return;
    }

    try {
      // the api client automatically injects the token header
      const newTicket = { title, description };
      if (SLA_deadline) newTicket.SLA_deadline = SLA_deadline;
      await api.post("/api/tickets", newTicket);

      // After creating, navigate back to tickets list
      navigate("/tickets");
    } catch (err) {
      console.error(err);
      setError("Failed to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-6">Create New Ticket</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-md p-2"
            placeholder="Enter ticket title"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-200 rounded-md p-3 h-28"
            placeholder="Describe the issue..."
            rows={5}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">SLA deadline</label>
          <input
            type="date"
            value={SLA_deadline}
            onChange={(e) => setSLA_deadline(e.target.value)}
            className="w-full border border-gray-200 rounded-md p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          {loading ? "Creating..." : "Create Ticket"}
        </button>
      </form>
    </div>
  );
}
