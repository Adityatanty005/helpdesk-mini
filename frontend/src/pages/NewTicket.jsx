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

    if (!SLA_deadline) {
      setError("Please provide an SLA deadline.");
      setLoading(false);
      return;
    }

    try {
      const newTicket = { title, description };
      if (SLA_deadline) newTicket.SLA_deadline = SLA_deadline;
      await api.post("/api/tickets", newTicket);

      navigate("/tickets");
    } catch (err) {
      console.error(err);
      setError("Failed to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
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

      <div className="card p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Create New Ticket
          </h1>
          <p className="text-neutral-600">
            Submit a new support request to our team
          </p>
        </div>

        {error && (
          <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Title <span className="text-error-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Brief summary of your issue"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Description <span className="text-error-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[160px] resize-y"
              placeholder="Provide detailed information about your issue..."
              rows={6}
              required
            />
            <p className="mt-2 text-sm text-neutral-500">
              Include any relevant details that will help us resolve your issue
              faster
            </p>
          </div>

          <div>
            <label
              htmlFor="sla_deadline"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              SLA Deadline <span className="text-error-500">*</span>
            </label>
            <input
              id="sla_deadline"
              type="date"
              value={SLA_deadline}
              onChange={(e) => setSLA_deadline(e.target.value)}
              className="input-field"
              min={new Date().toISOString().split("T")[0]}
              required
            />
            <p className="mt-2 text-sm text-neutral-500">
              Select the deadline for this ticket resolution
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <>
                  <div className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Create Ticket
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/tickets")}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
