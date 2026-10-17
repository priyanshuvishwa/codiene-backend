import { Router } from "express";
import multer from "multer";
import createClient from "../controllers/client.controllers.js";

const router = Router();
const parseFormData = multer().none();

router.route("/").post(parseFormData, createClient);

export default router;