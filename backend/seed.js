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
    username: "GVA2018012",
    password: "ChangeMe@123",
    role: "ADMIN",
  },
  {
    name: "Ahmed Ali",
    username: "GVA2018013",
    password: "ChangeMe@123",
    role: "ADMIN",
    
  },
  {
    name: "John Doe",
    username: "GVP2018014",
    password: "ChangeMe@123",
    role: "ADMIN",
  },
]);

console.log("Users seeded")
process.exit(0);
