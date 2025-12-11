import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Not Found Middleware
export const notFound = (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: `API route ${req.originalUrl} not found` });
  }
  // For non-API paths, let SPA handle it
  res.status(404).sendFile(
    path.join(__dirname, "..", process.env.CLIENT_BUILD_FOLDER || "../client/dist", "index.html")
  );
};

// Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: "Validation error", errors: messages });
  }
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
};
