import express from "express";
import dotenv from "dotenv";
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

// Middleware - cors
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null,origin);
      } else {
        console.log(" Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
  })
);

// Middleware - in which allows/parse json in req.body.
app.use(express.json());

// API routes
app.use("/api/products", verifyToken, productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", verifyToken, orderRoutes);
app.use("/api/carts", verifyToken, cartroutes)


// DB + start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log("✅ Allowed origins:", allowedOrigins);
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
// A stack trace tells you the path of function calls that led to an error — including file name and line number.
// process is a built-in global object that represents the current running program.The controller of the Node.js application.
// app.listen() a method to start the server and listen it on a port 3000.
// app.use() is used to apply middleware to your entire Express app.
// callback() is a function passed by CORS to your origin function.
// The callback function takes 2 arguments:
// callback(error, allowOrigin)

// error:
// If there’s an error (you want to block the origin), pass an Error object.
// If no error (you allow the request), pass null.

// allowOrigin:
// If allowed, pass the origin string.
// If blocked, you don’t need this argument.

// dev - to start development, build - to generate production files, lint - to check code quality and errors, and preview - to test production build locally.