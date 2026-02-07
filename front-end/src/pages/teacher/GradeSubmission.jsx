import { useEffect, useState } from "react";
import { getAssignedStudents, getGradingSetting } from "../../api/gradeService";
import GradeEntryTable from "../../components/teachers/GradeEntryTable";
import { useNavigate } from "react-router-dom";

export default function GradeSubmission() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [weights, setWeights] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const studentsRes = await getAssignedStudents();
    const weightRes = await getGradingSetting();

    setClasses(studentsRes.data);
    setWeights(weightRes.data.setting);
  };

  const handleSelectClass = (cls) => setSelectedClass(cls);

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Grade Submission</h1>

      {/* CLASS SELECTOR */}
      <div className="space-y-3">
        {classes.map((cls, i) => (
          <button
            key={i}
            onClick={() => handleSelectClass(cls)}
            className="w-full p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Grade {cls.classInfo.grade} - {cls.classInfo.section} ({cls.classInfo.stream})  
            — {cls.classInfo.course}
          </button>
        ))}
      </div>

      {/* BACK BUTTON */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/teacher")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>

      {/* TABLE SECTION */}
      {selectedClass && weights && (
        <div className="mt-6">
          <GradeEntryTable selectedClass={selectedClass} weights={weights} />
        </div>
      )}
    </div>
  );
}
