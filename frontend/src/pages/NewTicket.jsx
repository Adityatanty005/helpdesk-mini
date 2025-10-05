import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Field, Input, Label } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";

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
    <div className="max-w-2xl mx-auto mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Ticket</CardTitle>
        </CardHeader>
        <CardBody>
          {error && (
            <div className="mb-4 text-sm text-rose-700">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <Field>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter ticket title"
                required
              />
            </Field>

            <Field>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue..."
                rows={6}
                required
              />
            </Field>

            <Field>
              <Label htmlFor="sla">SLA deadline</Label>
              <Input
                id="sla"
                type="date"
                value={SLA_deadline}
                onChange={(e) => setSLA_deadline(e.target.value)}
                required
              />
            </Field>

            <div className="pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Ticket"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
