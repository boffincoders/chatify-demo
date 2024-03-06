import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import http from "http";
import passport from "passport";
import path from "path";
import { Server } from "socket.io";
import { connectdb } from "./config/db";
import ioStrategy from "./config/io.config";
import { jwtStrategy } from "./config/passport.config";
import authRoutes from "./routes/auth.route";
import chatRoutes from "./routes/chat.route";
import groupRoutes from "./routes/group.route";
import userRoutes from "./routes/user.route";
const app = express();
app.use(express.static(path.join(__dirname, "upload")));
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const port = process.env.CHATIFY_DEMO_PORT ?? 9000;
connectdb();
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
jwtStrategy(passport);
app.use("/users", userRoutes);
app.use("/chat", chatRoutes);
app.use("/group", groupRoutes);
app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});
app.use("/auth", authRoutes);
ioStrategy(io);

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
