// import { createContext, useEffect, useState } from "react";
// import {getStudents,createStudent ,updateStudent,deleteStudent  } from "../api/studentService";

// export const StudentContext = createContext();

// export const StudentProvider = ({ children }) => {
//   const [students, setStudents] = useState([]);

//   const fetchStudents = async () => {
//     const res = await fetchStudents.get("/students");
//     setStudents(res.data);
//   };

//   const addStudent = async (data) => {
//     const res = await createStudent.post("/students", data);
//     setStudents([...students, res.data]);
//   };

//   const updateStudent = async (id, data) => {
//     const res = await updateStudent.put(`/students/${id}`, data);
//     setStudents(students.map(s => s._id === id ? res.data : s));
//   };

//   const deleteStudent = async (id) => {
//     await deleteStudent.delete(`/students/${id}`);
//     setStudents(students.filter(s => s._id !== id));
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   return (
//     <StudentContext.Provider
//       value={{ fetchStudents, addStudent, updateStudent, deleteStudent }}
//     >
//       {children}
//     </StudentContext.Provider>
//   );
// };
