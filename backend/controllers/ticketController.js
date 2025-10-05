import Ticket from "../models/ticketModel.js";
import Comment from "../models/commentModel.js";
import mongoose from "mongoose";

// Create ticket
export const createTicket = async (req, res) => {
  try {
    const { title, description, SLA_deadline } = req.body;
    const ticket = await Ticket.create({
      title,
      description,
      SLA_deadline,
      createdBy: req.user.id,
    });
    // log event
    ticket.events = ticket.events || [];
    ticket.events.push({
      type: "created",
      actor: req.user.id,
      message: "Ticket created",
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res
      .status(500)
      .json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};

// Get tickets with pagination & search
export const getTickets = async (req, res) => {
  try {
    const { limit = 10, offset = 0, search = "", breached } = req.query;

    // Base query
    const baseQuery = [];

    if (search) {
      // Search title/description
      baseQuery.push({ title: { $regex: search, $options: "i" } });
      baseQuery.push({ description: { $regex: search, $options: "i" } });
      // Also search latest comment text (join via comments)
      const matchingComments = await Comment.find({
        text: { $regex: search, $options: "i" },
      }).select("ticket");
      if (matchingComments.length) {
        const ticketIds = matchingComments.map((c) => c.ticket);
        baseQuery.push({ _id: { $in: ticketIds } });
      }
    }

    const query = baseQuery.length ? { $or: baseQuery } : {};

    if (breached === "true") {
      // tickets where SLA_deadline < now and status not closed
      query.SLA_deadline = { $lt: new Date() };
      query.status = { $ne: "closed" };
    }

    const items = await Ticket.find(query)
      .skip(Number(offset))
      .limit(Number(limit))
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    const next_offset = Number(offset) + items.length;

    res.json({ items, next_offset });
  } catch (err) {
    res
      .status(500)
      .json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};

// Get single ticket with comments
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email")
      .populate({
        path: "comments",
        populate: { path: "author", select: "name email" },
      })
      .populate({
        path: "events.actor",
        select: "name email",
      });

    if (!ticket)
      return res.status(404).json({ error: { code: "TICKET_NOT_FOUND" } });
    res.json(ticket);
  } catch (err) {
    res
      .status(500)
      .json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};

// Update ticket (optimistic locking)
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket)
      return res.status(404).json({ error: { code: "TICKET_NOT_FOUND" } });

    // optimistic locking: compare updatedAt
    if (
      req.body.updatedAt &&
      new Date(req.body.updatedAt).getTime() !== ticket.updatedAt.getTime()
    ) {
      return res.status(409).json({ error: { code: "STALE_TICKET" } });
    }

    // Role-based: only admins or agents can assign tickets; creators or agents can update
    const requesterRole = req.user.role;
    if (req.body.assignedTo && !["agent", "admin"].includes(requesterRole)) {
      return res.status(403).json({ error: { code: "FORBIDDEN" } });
    }

    ["title", "description", "status", "assignedTo", "SLA_deadline"].forEach(
      (field) => {
        if (req.body[field] !== undefined) ticket[field] = req.body[field];
      }
    );

    // push timeline event
    ticket.events = ticket.events || [];
    ticket.events.push({
      type: "updated",
      actor: req.user.id,
      message: "Ticket updated",
      meta: { fields: Object.keys(req.body) },
    });

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res
      .status(500)
      .json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};
