import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { Card, CardBody } from "../components/ui/Card";
import { Button, ButtonLink } from "../components/ui/Button";
import { Input, Label, Field } from "../components/ui/Input";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Skeleton, SkeletonText } from "../components/ui/Skeleton";

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

  return (
    <div className="mx-auto mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Your Tickets</h1>
        <ButtonLink to="/tickets/new" size="md">+ New Ticket</ButtonLink>
      </div>

      <form onSubmit={onSubmitSearch} className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field className="sm:col-span-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by title, description, latest comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Field>
        <div className="flex items-end gap-2">
          <Button type="submit" className="w-full sm:w-auto">Search</Button>
          <Button
            type="button"
            variant={breachedOnly ? "primary" : "secondary"}
            onClick={() => setBreachedOnly((v) => !v)}
          >
            SLA breached
          </Button>
        </div>
      </form>

      {error && (
        <Card className="mb-4">
          <CardBody>
            <p className="text-sm text-rose-700">{error}</p>
          </CardBody>
        </Card>
      )}

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardBody>
                <Skeleton className="h-5 w-2/3 mb-2" />
                <SkeletonText lines={2} />
              </CardBody>
            </Card>
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-gray-600">No tickets found. Try adjusting your search.</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-3">
          {tickets.map((t) => {
            const breached = isBreached(t);
            return (
              <Link to={`/tickets/${t._id}`} key={t._id} className="block">
                <Card className="hover:shadow-md transition-shadow">
                  <CardBody>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          {t.title || "Untitled"}
                        </h3>
                        {t.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {t.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <StatusBadge status={t.status} />
                        <div className="text-[11px] text-gray-500">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-600">
                      {t.SLA_deadline && (
                        <span className={breached ? "text-rose-600" : ""}>
                          Due: {new Date(t.SLA_deadline).toLocaleDateString()}
                        </span>
                      )}
                      {breached && (
                        <span className="inline-flex items-center gap-1 text-rose-600">
                          • SLA breached
                        </span>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {!loading && hasMore && (
        <div className="flex justify-center mt-6">
          <Button onClick={() => fetchTickets({ reset: false })} disabled={loadingMore}>
            {loadingMore ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}
