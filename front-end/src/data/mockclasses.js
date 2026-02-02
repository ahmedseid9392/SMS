import { mockStudents } from "./mockStudents";

const subjects = ["Mathematics", "Science", "English", "History", "Computer Science", "Physics", "Chemistry", "Biology", "Geography", "Economics", "Civics", "Sociology"];

// Generate classes only for subjects that students are actually enrolled in
export const mockTeacherClasses = [];

mockStudents.forEach(student => {
  student.courses.forEach(subject => {
    const existingClass = mockTeacherClasses.find(
      c => c.subject === subject && c.grade === student.grade && c.section === student.section
    );

    if (!existingClass) {
      mockTeacherClasses.push({
        id: mockTeacherClasses.length + 1,
        subject,
        grade: student.grade,
        section: student.section,
        stream: student.stream,
        displayName: `${subject} - ${student.grade} ${student.section}`,
        students: mockStudents.filter(
          s => s.grade === student.grade && 
               s.section === student.section && 
               s.courses.includes(subject) &&
               s.stream === student.stream
        ),
      });
    }
  });
});