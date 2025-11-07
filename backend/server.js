import express from "express";
import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";   
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import authRoutes from "./routes/authRoutes.js"
import orderRoutes from "./routes/order.route.js";
import cartroutes from "./routes/cart.route.js"
import cors from "cors";
import verifyToken from "./middlewares/authMiddleware.js";


// transfers the content from env file to process.env
dotenv.config();

// creates an express app
const app = express();

const PORT = process.env.PORT || 5001;


const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(" Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
  })
);

// in this filename we get a absolute path of a current file(server.js) and dirname gives the folder nam of a server.js file.
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// Middleware - in which allows json in req.body.
app.use(express.json());

// API routes
app.use("/api/products", verifyToken, productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", verifyToken, orderRoutes);
app.use("/api/carts", verifyToken, cartroutes)

// 👉 Serve React frontend in production - result in frontendpath would be(D:\Desktop\My project\frontend\dist)../frontend/dist = go up one folder (My project), then into frontend/dist .so the path does not involve backend.
// const frontendPath = path.resolve(__dirname, "../frontend/dist");

// console.log("Serving frontend from:", frontendPath);

// process.env.NODE_ENV tell whether u run development or production
// if (process.env.NODE_ENV === "production") {
//   // express.static is a express middleware that serves all files in frontend/dist.
//   app.use(express.static(frontendPath));

//   // * catch-all route that returns index.html for any GET request not handled earlier. This is necessary for client-side routing (React Router): if the browser requests /about, the server still returns index.html and React Router shows the right page.
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(frontendPath, "index.html"));
//   });
// }

// DB + start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" Database not connected", err);
    process.exit(1);
  });

// Express is a bridge between react frontend and the database. It builds API and handles HTTP req and responses.

// dotenv stores sensitive informations like passwords, keys, url etc....

// Mongoose is a object data modelling library for mongoDB and Node.js.

// The server can be connected if also database does not connected. this may create a error while hitting the api routes for any request where database is not connected but server is running.

// Frontend (ProtectedRoute.jsx) → UX-based security (hides restricted pages).

// Backend (authMiddleware.js + roleMiddleware.js) → real security (stops unauthorized API access even if someone manipulates the frontend).