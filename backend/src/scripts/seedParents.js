import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Parent from "../models/Parent.model.js";
import Student from "../models/Student.model.js";

dotenv.config();

const parentSeeds = [
  {
    username: "GVP2024001",
    password: "ChangeMe@123",
    fullName: "Hana Bekele",
    sex: "Female",
    childUsernames: ["GVS2024001", "GVS2024002"],
  },
  {
    username: "GVP2024002",
    password: "ChangeMe@123",
    fullName: "Abel Tesfaye",
    sex: "Male",
    childUsernames: ["GVS2024003"],
  },
  {
    username: "GVP2024003",
    password: "ChangeMe@123",
    fullName: "Mimi Solomon",
    sex: "Female",
    childUsernames: ["GVS2024004", "GVS2024005"],
  },
];

const seedParents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const seed of parentSeeds) {
      const existingParent = await Parent.findOne({ username: seed.username });
      const children = await Student.find({ username: { $in: seed.childUsernames } }).select(
        "_id fullName grade section username"
      );

      const childRefs = children.map((child) => ({
        studentId: child._id,
        name: child.fullName,
        grade: child.grade,
        section: child.section,
      }));

      if (existingParent) {
        existingParent.fullName = seed.fullName;
        existingParent.sex = seed.sex;
        existingParent.children = childRefs;
        await existingParent.save();
        console.log(`Updated parent ${seed.username}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(seed.password, 10);

      await Parent.create({
        username: seed.username,
        password: hashedPassword,
        fullName: seed.fullName,
        sex: seed.sex,
        role: "PARENT",
        mustChangePassword: true,
        children: childRefs,
      });

      console.log(`Created parent ${seed.username}`);
    }

    console.log("Parent sample accounts seeded successfully");
  } catch (error) {
    console.error("Failed to seed parents:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedParents();
