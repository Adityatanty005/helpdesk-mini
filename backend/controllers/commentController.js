import Comment from "../models/commentModel.js";
import Ticket from "../models/ticketModel.js";

export const addComment = async (req, res) => {
  try {
    const { text, parent } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket)
      return res.status(404).json({ error: { code: "TICKET_NOT_FOUND" } });

    const comment = await Comment.create({
      ticket: ticket._id,
      author: req.user.id,
      text,
      parent,
    });

    ticket.comments.push(comment._id);
    ticket.events = ticket.events || [];
    ticket.events.push({
      type: "commented",
      actor: req.user.id,
      message: "Comment added",
      meta: { comment: comment._id },
    });
    await ticket.save();

    const populatedComment = await comment.populate("author", "name email");
    await populatedComment.populate("parent");

    res.status(201).json(populatedComment);
  } catch (err) {
    res
      .status(500)
      .json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};
