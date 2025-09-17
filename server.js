import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
import authRoutes from "./routes/authRoute.js"
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import postRoutes from "./routes/postRoutes.js";
dotenv.config();


const app = express();
const port = process.env.PORT || 4000;

// Connect to DB
connectDB();

// const middleware1 = (obj) =>{
//     return (req,res,next) =>{
//         req.name = obj.name;
//         req.email = obj.email;
//         console.log("This is the middleware 1");
//         next();
//     }
// }

// const middleware2 = (req,res,next) =>{
//     console.log("This is middleware 2...");
//     next();
// };
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/posts", postRoutes);
//app.use("/api/admin", adminRoutes);

app.get("/health", (_req, res) => res.send("OK"));

// Routes
app.get('/', (req, res) => {
  res.send("<h1>This is the Server.</h1>");
});

// app.get('/example',middleware1({name:"Shivam",email:"Shivam@gmail.com"}),(req,res,next) =>{
//     console.log(req.name);
//     console.log(req.email);
//     res.send("This is the Example route.");
//     next();
// });


// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
