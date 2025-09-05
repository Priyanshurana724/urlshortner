import express from "express";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import connectDB from "./src/config/monogo.config.js";
import short_url from "./src/routes/short_url.route.js";
import user_routes from "./src/routes/user.routes.js";
import auth_routes from "./src/routes/auth.routes.js";
import { redirectFromShortUrl } from "./src/controller/short_url.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import cors from "cors";
import { attachUser } from "./src/utils/attachUser.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// ✅ Allow frontend (Vercel + Local)
app.use(
  cors({
    origin: [
      "https://urlshortner-tvgb.vercel.app", // frontend deployed on Vercel
      "http://localhost:5173"                // frontend local dev
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Middleware
app.use(attachUser);

// ✅ Routes
app.use("/api/user", user_routes);
app.use("/api/auth", auth_routes);
app.use("/api/create", short_url);
app.get("/:id", redirectFromShortUrl);

// ✅ Health check route (test if backend works)
app.get("/ping", (req, res) => {
  res.json({ message: "pong 🏓 Backend is live!" });
});

// ✅ Error handler
app.use(errorHandler);

// ✅ Connect DB once
connectDB();

// ✅ Export app for Vercel
export default app;

// ✅ Still support local dev
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on http://localhost:${PORT}`);
  });
}
