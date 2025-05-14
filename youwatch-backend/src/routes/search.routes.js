import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { searchUser } from "../controllers/search.controller.js";

const router = express.Router();

router.route("/search-user").get(verifyJWT, searchUser);

export default router;
