import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from  "dotenv";
import Teacher from "../models/Teacher.model.js";
dotenv.config();
// Generate username in format: GVS2024001, GVS2024002, etc.
const generateTeacherUsername = async () => {
  const count = await Teacher.countDocuments();
  return `GVS2024${String(count + 1).padStart(3, "0")}`;
};

// Sample teachers data with qualification and grade 9-12 subjects
const teachersData = [
  // Mathematics Teachers
  {
    fullName: "Dr. Sarah Johnson",
    email: "sarah.johnson@school.com",
    phone: "0912345678",
    address: "Addis Ababa, Ethiopia",
    qualification: "PhD",
    specialization: "Mathematics Education",
    subjects: ["Mathematics"],
    gradeLevels: [9, 10, 11, 12],
    stream: "Both",
    experience: {
      years: 12,
      previousSchool: "Addis Ababa University"
    },
    password: "ChangeMe@123"
  },
  {
    fullName: "Mr. Michael Brown",
    email: "michael.brown@school.com",
    phone: "0923456789",
    address: "Addis Ababa, Ethiopia",
    qualification: "Master's Degree",
    specialization: "Physics Education",
    subjects: ["Physics"],
    gradeLevels: [9, 10, 11, 12],
    stream: "Both",
    experience: {
      years: 8,
      previousSchool: "Unity University"
    },
    password: "ChangeMe@123"
  },
  {
    fullName: "Ms. Emily Davis",
    email: "emily.davis@school.com",
    phone: "0934567890",
    address: "Addis Ababa, Ethiopia",
    qualification: "Master's Degree",
    specialization: "English Literature",
    subjects: ["English"],
    gradeLevels: [9, 10, 11, 12],
    stream: "Both",
    experience: {
      years: 6,
      previousSchool: "International School"
    },
    password: "ChangeMe@123"
  },
  {
    fullName: "Dr. James Wilson",
    email: "james.wilson@school.com",
    phone: "0945678901",
    address: "Addis Ababa, Ethiopia",
    qualification: "PhD",
    specialization: "Chemistry Education",
    subjects: ["Chemistry"],
    gradeLevels: [9, 10, 11, 12],
    stream: "Natural",
    experience: {
      years: 15,
      previousSchool: "Ministry of Education"
    },
    password: "ChangeMe@123"
  },
  {
    fullName: "Ms. Lisa Anderson",
    email: "lisa.anderson@school.com",
    phone: "0956789012",
    address: "Addis Ababa, Ethiopia",
    qualification: "Master's Degree",
    specialization: "Biology Education",
    subjects: ["Biology"],
    gradeLevels: [9, 10, 11, 12],
    stream: "Natural",
    experience: {
      years: 7,
      previousSchool: "St. Mary's School"
    },
    password: "ChangeMe@123"
  },
  
  // Grade 9-10 Only Teachers
  {
    fullName: "Mr. Robert Taylor",
    email: "robert.taylor@school.com",
    phone: "0967890123",
    address: "Addis Ababa, Ethiopia",
    qualification: "Bachelor's Degree",
    specialization: "History",
    subjects: ["History"],
    gradeLevels: [9, 10],
    stream: "None",
    experience: {
      years: 4,
      previousSchool: "Government School"
    },
    password: "ChangeMe@123"
  },
  {
    fullName: "Ms. Patricia Martinez",
    email: "patricia.martinez@school.com",
    phone: "0978901234",
    address: "Addis Ababa, Ethiopia",
    qualification: "Bachelor's Degree",
    specialization: "Geography",
    subjects: ["Geography"],
    gradeLevels: [9, 10],
    stream: "None",
    experience: {
      years: 3,
      previousSchool: "Rift Valley Academy"
    },
    password: "ChangeMe@123"
  },
  
  // Grade 11-12 Natural Stream Teachers
  {
    fullName: "Dr. Thomas Clark",
    email: "thomas.clark@school.com",
    phone: "0989012345",
    address: "Addis Ababa, Ethiopia",
    qualification: "PhD",
    specialization: "Advanced Mathematics",
    subjects: ["Mathematics"],
    gradeLevels: [11, 12],
    stream: "Natural",
    experience: {
      years: 10,
      previousSchool: "Addis Ababa Science and Technology University"
    },
    password: "ChangeMe@123"
  },
  {
    fullName: "Ms. Jennifer Lee",
    email: "jennifer.lee@school.com",
    phone: "0990123456",
    address: "Addis Ababa, Ethiopia",
    qualification: "Master's Degree",
    specialization: "Information Technology",
    subjects: ["Information Technology"],
    gradeLevels: [11, 12],
    stream: "Natural",
    experience: {
      years: 5,
      previousSchool: "Tech Academy"
    },
    password: "ChangeMe@123"
  },
  
  // Grade 11-12 Social Stream Teachers
  {
    fullName: "Mr. Daniel White",
    email: "daniel.white@school.com",
    phone: "0912345679",
    address: "Addis Ababa, Ethiopia",
    qualification: "Master's Degree",
    specialization: "Economics",
    subjects: ["Economics"],
    gradeLevels: [11, 12],
    stream: "Social",
    experience: {
      years: 9,
      previousSchool: "Commercial College"
    },
    password: "ChangeMe@123"
  },
  {
    fullName: "Ms. Susan Miller",
    email: "susan.miller@school.com",
    phone: "0923456780",
    address: "Addis Ababa, Ethiopia",
    qualification: "Master's Degree",
    specialization: "Civics",
    subjects: ["Civics"],
    gradeLevels: [9, 10, 11, 12],
    stream: "Both",
    experience: {
      years: 6,
      previousSchool: "Law School"
    },
    password: "ChangeMe@123"
  },
  
  // Additional Subject Teachers
  {
    fullName: "Mr. David Kim",
    email: "david.kim@school.com",
    phone: "0934567891",
    address: "Addis Ababa, Ethiopia",
    qualification: "Master's Degree",
    specialization: "Computer Science",
    subjects: ["Computer Science", "Programming"],
    gradeLevels: [9, 10, 11, 12],
    stream: "Both",
    experience: {
      years: 8,
      previousSchool: "Tech Hub Academy"
    },
    password: "ChangeMe@123"
  },
  {
    fullName: "Ms. Maria Garcia",
    email: "maria.garcia@school.com",
    phone: "0945678902",
    address: "Addis Ababa, Ethiopia",
    qualification: "Master's Degree",
    specialization: "Physical Education",
    subjects: ["Physical Education", "Sports"],
    gradeLevels: [9, 10, 11, 12],
    stream: "Both",
    experience: {
      years: 10,
      previousSchool: "Sports Academy"
    },
    password: "ChangeMe@123"
  }
];

// Function to register teachers
async function registerTeachers() {
  try {
    const Mongo_URI=process.env.Mongo_URI;
    // Connect to MongoDB
    await mongoose.connect(Mongo_URI);
    console.log('✅ Connected to MongoDB\n');

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const teacherData of teachersData) {
      try {
        // Check if teacher already exists by email
        const existingTeacher = await Teacher.findOne({ 
          $or: [
            { email: teacherData.email },
            { fullName: teacherData.fullName }
          ]
        });
        
        if (existingTeacher) {
          console.log(`⚠️ Teacher ${teacherData.fullName} already exists, skipping...`);
          skipped++;
          continue;
        }
        
        // Generate unique username (GVS2024XXX format)
        let username = await generateTeacherUsername();
        let usernameExists = await Teacher.findOne({ username });
        let counter = 1;
        
        // If username exists, try with counter
        while (usernameExists) {
          const count = await Teacher.countDocuments();
          username = `GVS2024${String(count + counter).padStart(3, "0")}`;
          usernameExists = await Teacher.findOne({ username });
          counter++;
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(teacherData.password, 10);
        
        // Create teacher object
        const teacher = new Teacher({
          fullName: teacherData.fullName,
          phone: teacherData.phone,
          email: teacherData.email,
          address: teacherData.address,
          qualification: teacherData.qualification,
          specialization: teacherData.specialization,
          subjects: teacherData.subjects,
          gradeLevels: teacherData.gradeLevels,
          stream: teacherData.stream,
          experience: teacherData.experience,
          username: username,
          password: hashedPassword,
          role: "TEACHER",
          isActive: true,
          joinDate: new Date()
        });
        
        await teacher.save();
        
        console.log(`✅ Teacher ${teacher.fullName} registered successfully!`);
        console.log(`   📝 Username: ${teacher.username}`);
        console.log(`   🔑 Password: ${teacherData.password}`);
        console.log(`   📚 Subjects: ${teacher.subjects.join(', ')}`);
        console.log(`   🎓 Grades: ${teacher.gradeLevels.join(', ')}`);
        console.log(`   🏆 Qualification: ${teacher.qualification}`);
        console.log(`   📧 Email: ${teacher.email}\n`);
        created++;
        
      } catch (error) {
        console.error(`❌ Error creating teacher ${teacherData.fullName}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n=================================');
    console.log('📊 REGISTRATION SUMMARY');
    console.log('=================================');
    console.log(`✅ Created: ${created} teachers`);
    console.log(`⚠️ Skipped: ${skipped} teachers`);
    console.log(`❌ Errors: ${errors} teachers`);
    console.log(`📋 Total: ${teachersData.length} teachers processed`);
    console.log('=================================');
    
    if (created > 0) {
      console.log('\n🔑 LOGIN CREDENTIALS FORMAT:');
      console.log('Username: GVS2024XXX (e.g., GVS2024001, GVS2024002, etc.)');
      console.log('Password: ChangeMe@123');
      console.log('\n💡 Note: All teachers must change their password on first login');
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the registration
registerTeachers();