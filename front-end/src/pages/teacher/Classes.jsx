import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAssignedClasses } from "../../api/assignedService";
import AssignedStudentsTable from "../../components/teachers/AssignedStudentsTable";

const Classes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadAssigned();
  }, []);

  const loadAssigned = async () => {
    try {
      const res = await getAssignedClasses();
      setData(res);
    } catch (err) {
      console.error("Failed to load assigned classes", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="p-4 text-blue-600 dark:text-blue-300">Loading...</p>;

  if (data.length === 0)
    return (
      <div className="p-4">
        <button
          onClick={() => navigate("/teacher")}
          className="mb-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          ← Back to Dashboard
        </button>

        <p className="text-black-500 dark:text-gray-300">
          No classes assigned to you yet.
        </p>
      </div>
    );

  return (
    <div className="p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate("/teacher")}
        className="mb-6 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
        Assigned Classes
      </h1>

      {data.map((item, index) => (
        <div
          key={index}
          className="mb-8 p-4 rounded-lg border bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
        >
          {/* Class Header */}
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Grade {item.classInfo.grade} – Section {item.classInfo.section}{" "}
              ({item.classInfo.stream})
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Course: {item.classInfo.course}
            </p>
          </div>

          {/* Students Table */}
          <AssignedStudentsTable students={item.students} />
        </div>
      ))}
    </div>
  );
};

export default Classes;
