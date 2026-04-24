import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
// import ClassSelector from "../../components/common/ClassSelector";
// import AttendanceList from "../../components/attendance/AttendanceList";
// import { mockTeacherClasses } from "../../data/mockClasses";

const Attendance = () => {
//   const [selectedGrade, setSelectedGrade] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [selectedStream, setSelectedStream] = useState("");
//   const [attendanceData, setAttendanceData] = useState({});
//   const [submitted, setSubmitted] = useState(false);

//   const selectedClass = mockTeacherClasses.find(
//   c => c.grade === selectedGrade && 
//        c.section === selectedSection && 
//        c.subject === selectedSubject &&
//        (!["11th", "12th"].includes(selectedGrade) || c.stream === selectedStream)
// );

//   const handleSelectorChange = (field, value) => {
//     if (field === "grade") {
//       setSelectedGrade(value);
//       setSelectedStream("");
//       setSelectedSection("");
//       setSelectedSubject("");
//     } else if (field === "stream") {
//     setSelectedStream(value);
//   setSelectedSection("");
//   setSelectedSubject("");
    
//      } else if (field === "section") {
//       setSelectedSection(value);
//       setSelectedSubject("");
//     } else if (field === "subject") {
//       setSelectedSubject(value);
//     }
//     setSubmitted(false);
//   };

//   const handleAttendanceChange = (studentId, status) => {
//     const key = `${selectedClass.id}`;
//     setAttendanceData(prev => ({
//       ...prev,
//       [key]: { ...prev[key], [studentId]: status },
//     }));
//   };

//   const handleSubmit = (e) => {
//   e.preventDefault();

//   const stats = {
//     present: 0,
//     absent: 0,
//     permission: 0,
//   };
//   Object.values(attendanceData[selectedClass.id] || {}).forEach(status => {
//     stats[status]++;
//   });

//   alert(
//     `Attendance Submitted!\n\n` +
//     `Present: ${stats.present}\n` +
//     `Absent: ${stats.absent}\n` +
//     `Permission: ${stats.permission}\n\n` +
//     `Class: ${selectedClass.displayName}`
//   );

//   setSubmitted(true);
// };

//   // Auto-initialize attendance as "present" when class is selected
//   React.useEffect(() => {
//     if (selectedClass && !attendanceData[selectedClass.id]) {
//       const initial = {};
//       selectedClass.students.forEach(s => { initial[s.id] = "present"; });
//       setAttendanceData(prev => ({ ...prev, [selectedClass.id]: initial }));
//     }
//   }, [selectedClass]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Take Attendance</h1>
{/* 
        <ClassSelector
          selectedGrade={selectedGrade}
          selectedSection={selectedSection}
          selectedSubject={selectedSubject}
          selectedStream={selectedStream}
          onChange={handleSelectorChange}
        />

        {selectedClass ? (
          <>
            {submitted && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg font-medium">
                ✓ Attendance already submitted for this class today.
              </div>
            )}

            <AttendanceList
              students={selectedClass.students}
              attendance={attendanceData[selectedClass.id] || {}}
              onChange={handleAttendanceChange}
              onSubmit={handleSubmit}
            />
          </>
        ) : selectedGrade && selectedSection && !selectedSubject ? null : (
          <div className="text-center py-12 text-gray-500">
            Please select Grade → Section → Subject to load student list.
          </div>
        )} */}
      </div>
    </Layout>
  );
};

export default Attendance;