import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import ClassSelector from "../../components/common/ClassSelector";
import GradeList from "../../components/grades/GradeList";
import { mockTeacherClasses } from "../../data/mockClasses";

const Grades = () => {
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [gradesData, setGradesData] = useState({});
  const [submitted, setSubmitted] = useState(false);

 const selectedClass = mockTeacherClasses.find(
  c => c.grade === selectedGrade && 
       c.section === selectedSection && 
       c.subject === selectedSubject &&
       (!["11th", "12th"].includes(selectedGrade) || c.stream === selectedStream)
);

  const handleSelectorChange = (field, value) => {
    if (field === "grade") {
      setSelectedGrade(value);
      setSelectedStream("");
      setSelectedSection("");
      setSelectedSubject("");
    } 
    else if (field === "stream") {
  setSelectedStream(value);
  setSelectedSection("");
  setSelectedSubject("");
}
    
    else if (field === "section") {
      setSelectedSection(value);
      setSelectedSubject("");
    } else if (field === "subject") {
      setSelectedSubject(value);
    }
    setSubmitted(false);
  };

  const handleGradeChange = (studentId, field, value) => {
    const key = selectedClass.id;
    setGradesData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [studentId]: { ...prev[key]?.[studentId], [field]: value },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    alert(`Grades submitted for ${selectedClass.displayName}!`);
  };

  useEffect(() => {
    if (selectedClass && !gradesData[selectedClass.id]) {
      const initial = {};
      selectedClass.students.forEach(s => {
        initial[s.id] = { score: "", grade: "" };
      });
      setGradesData(prev => ({ ...prev, [selectedClass.id]: initial }));
    }
  }, [selectedClass]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Enter Grades</h1>

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
                ✓ Grades already submitted for this class.
              </div>
            )}

            <GradeList
              students={selectedClass.students}
              grades={gradesData[selectedClass.id] || {}}
              onChange={handleGradeChange}
              onSubmit={handleSubmit}
            />
          </>
        ) : selectedGrade && selectedSection && !selectedSubject ? null : (
          <div className="text-center py-12 text-gray-500">
            Please select Grade → Section → Subject to load student list.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Grades;