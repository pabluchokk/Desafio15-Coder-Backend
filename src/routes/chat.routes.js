import { Router } from "express";
import { MessageModel } from "../dao/models/MessageModel.js";
import { isUser } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/chat", isUser, async (req, res) => {
    const messages = await MessageModel.find();
    res.render("chat", { messages })
})

router.post("/chat", async (req, res) => {
    const { user, message } = req.body;

    const newMessage = new MessageModel({ user, message });
    await newMessage.save();
    res.redirect("/chat")
})

export { router as chatRouter }