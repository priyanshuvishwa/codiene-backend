import { Router } from "express";
import multer from "multer";
import createClient from "../controllers/client.controllers.js";
import { contactLimiter } from "../middleware/rateLimiter.middleware.js";

const router = Router();
const parseFormData = multer().none();

router.route("/").post(contactLimiter, parseFormData, createClient);

export default router;