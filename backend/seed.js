import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import User from "./src/models/User.model.js";

dotenv.config();
await connectDB();

await User.deleteMany();

await User.create([
  {
    name: "System Admin",
    username: "GVA2018011",
    password: "ChangeMe@123",
    role: "ADMIN",
  },
  {
    name: "Sarah Johnson",
    username: "GVT2018011",
    password: "ChangeMe@123",
    role: "TEACHER",
  },
  {
    name: "Ahmed Ali",
    username: "GVS2018011",
    password: "ChangeMe@123",
    role: "STUDENT",
    grade: "10",
    section: "A",
  },
  {
    name: "John Doe",
    username: "GVP2018011",
    password: "ChangeMe@123",
    role: "PARENT",
  },
]);

console.log("Users seeded")
process.exit(0);
