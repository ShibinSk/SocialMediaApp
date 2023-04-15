import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import authRoutes from "./routes/auth.js"
import { fileURLToPath } from "url";
import userRoutes from './routes/users.js'

import register from "./controllers/auth.js"
import { verifyToken } from "./middleware/auth.js";

// configuartion

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("./assests", express.static(path.join(__dirname, "public/assests")));

// FILE STORAGE

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cd(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cd(null, file.originalname);
  },
});

const upload = multer({ storage });


app.post("/auth/register", upload.single("picture"),register)
 
//ROUTES

app.use("/auth",authRoutes)
app.use("/users",userRoutes)

const PORT = process.env.PORT || 6001;


mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`server connected: ${PORT}`));
  })
  .catch((err) => {
    console.log(`${err} not connected`);
  });
