import mongoose from "mongoose";
import dotenv from "dotenv";
import Parent from "../models/Parent.model.js";
import Student from "../models/Student.model.js";

dotenv.config();

const parentStudentLinks = [
  {
    parentUsername: "GVP2024001",
    childUsernames: ["GVS2024001", "GVS2024002"],
  },
  {
    parentUsername: "GVP2024002",
    childUsernames: ["GVS2024003"],
  },
  {
    parentUsername: "GVP2024003",
    childUsernames: ["GVS2024004", "GVS2024005"],
  },
];

const linkStudentsToParents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const link of parentStudentLinks) {
      const parent = await Parent.findOne({ username: link.parentUsername });

      if (!parent) {
        console.log(`Parent ${link.parentUsername} not found, skipping`);
        continue;
      }

      const students = await Student.find({ username: { $in: link.childUsernames } });
      if (students.length === 0) {
        console.log(`No matching students found for parent ${link.parentUsername}`);
        continue;
      }

      await Student.updateMany(
        { _id: { $in: students.map((student) => student._id) } },
        { $set: { parent: parent._id } }
      );

      parent.children = students.map((student) => ({
        studentId: student._id,
        name: student.fullName,
        grade: student.grade,
        section: student.section,
      }));

      await parent.save();
      console.log(`Linked ${students.length} student(s) to ${link.parentUsername}`);
    }

    console.log("Student-to-parent linking completed");
  } catch (error) {
    console.error("Failed to link students to parents:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

linkStudentsToParents();
