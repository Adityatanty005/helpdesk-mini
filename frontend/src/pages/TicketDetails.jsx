import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { getUser } from "../utils/auth";
import { Card, CardBody, CardHeader, CardTitle } from "../components/ui/Card";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { Skeleton, SkeletonText } from "../components/ui/Skeleton";

function isBreached(ticket) {
  if (!ticket?.SLA_deadline) return false;
  const due = new Date(ticket.SLA_deadline).getTime();
  const now = Date.now();
  return due < now && String(ticket.status).toLowerCase() !== "closed";
}

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

  if (loading)
    return (
      <div className="mx-auto mt-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardBody>
            <SkeletonText lines={3} />
          </CardBody>
        </Card>
      </div>
    );
  if (error)
    return (
      <div className="mx-auto mt-6">
        <Card>
          <CardBody>
            <p className="text-sm text-rose-700">{error}</p>
          </CardBody>
        </Card>
      </div>
    );

  return (
    <div className="mx-auto mt-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle>{ticket?.title}</CardTitle>
            <StatusBadge status={ticket?.status} />
          </div>
        </CardHeader>
        <CardBody>
          {ticket?.description && (
            <p className="text-sm text-gray-700 mb-4">{ticket.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mb-4">
            <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
            {ticket.SLA_deadline && (
              <span className={isBreached(ticket) ? "text-rose-600" : ""}>
                SLA due: {new Date(ticket.SLA_deadline).toLocaleDateString()}
              </span>
            )}
            {ticket.assignedTo?.name && (
              <span>Assigned: {ticket.assignedTo.name}</span>
            )}
          </div>

          <h2 className="text-base font-medium mb-3">Comments</h2>
          {comments.length === 0 ? (
            <Card className="mb-4">
              <CardBody>
                <p className="text-sm text-gray-600">No comments yet.</p>
              </CardBody>
            </Card>
          ) : (
            <ul className="space-y-3 mb-6">
              {comments.map((c) => (
                <li key={c._id} className="rounded-md border border-gray-100 bg-gray-50 p-3">
                  <p className="text-sm text-gray-800">{c.text}</p>
                  <div className="mt-1 text-[11px] text-gray-500">
                    — {c.author?.name || c.user?.name || "Unknown"} at {new Date(c.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleAddComment} className="space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={5}
            />
            <Button type="submit">Add Comment</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
