import { useEffect, useState } from "react";
import { getAllGrades, adminReleaseGrades, adminUnlockGrade } from "../../api/gradeService";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { generateReportCard } from "../../utils/generateReportCard";



const GradeDashboard = () => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
   const [year, setYear] = useState("");
const [availableYears, setAvailableYears] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllGrades();

        setSections(data.sections || {});

        const yearList = Object.values(data.sections).map(s => s.meta.year);
        const uniqueYears = [...new Set(yearList)];

        setAvailableYears(uniqueYears);
        setYear(uniqueYears[0]); // default year

      } catch (error) {
        console.error("Failed to load grades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRelease = async (sectionKey) => {
    try {
      await adminReleaseGrades(sectionKey);
      alert("Grades Released Successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to release grades");
    }
  };

   const handleUnlock = async (gradeId) => {
  if (!gradeId) {
    console.error("Missing gradeId");
    return toast.error("Invalid grade ID");
  }

  try {
    await adminUnlockGrade(gradeId);
    toast.success("Grade unlocked!");

    // refresh UI
    const data = await getAllGrades();
    setSections(data.sections || {});

  } catch (error) {
    console.error("Unlock failed:", error);
    toast.error("Unlock failed");
  }
};


  if (loading) {
    return <div className="p-6 text-lg">Loading...</div>;
  }

  


  return (
    <div className="p-6 space-y-12 dark:text-white">
      
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/admin")}
        className="flex items-center gap-2 px-4 py-2 
             bg-blue-200 dark:bg-blue-800 
             hover:bg-blue-300 dark:hover:bg-blue-700 
             text-gray-900 dark:text-white 
             rounded"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h1 className="text-3xl font-bold dark:text-gray-900"
       style={{
              color: "var(--text)",
              }}>Admin Grade Dashboard</h1>

     {Object.entries(sections)
  .filter(([key, sec]) => sec.meta.year == year)
  .map(([key, sectionData]) => {

        const { meta, students } = sectionData;
        const courseNames = Object.keys(meta.courses);

        // AUTO DETECT TOP 3
        const topThree = [...students]
          .sort((a, b) => a.rank - b.rank)
          .slice(0, 3);

        return (
          <div key={key} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow space-y-6">

            {/* SECTION INFO */}
            <div>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Grade {meta.grade} | Stream {meta.stream} | Section {meta.section}
                </h2>

                {/* RELEASE BUTTON */}
                <button
                  onClick={() => handleRelease(key)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 
                             text-white rounded text-sm"
                >
                  Release Grades
                </button>
              </div>

              {/* Course - Teacher List */}
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {courseNames.map((course) => (
                  <div key={course}>
                    {course} — {meta.courses[course]}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
  <label className="mr-2 font-semibold">Select Year:</label>
  <select
    value={year}
    onChange={(e) => setYear(e.target.value)}
    className="p-2 border rounded dark:bg-gray-800 dark:text-white"
  >
    {availableYears.map((yr) => (
      <option key={yr} value={yr}>{yr}</option>
    ))}
  </select>
</div>


            {/* TOP 3 TABLE */}
            <div className="overflow-x-auto">
              <h3 className="text-lg font-bold mb-2">Top 3 Students</h3>
              <table className="min-w-full border text-sm">
                <thead className="bg-yellow-200 dark:bg-yellow-900">
                  <tr>
                    <th className="border p-2">Rank</th>
                    <th className="border p-2">Student</th>
                    <th className="border p-2">Total</th>
                    <th className="border p-2">Average</th>
                  </tr>
                </thead>
                <tbody>
                  {topThree.map((s) => (
                    <tr key={s.studentId} className="hover:bg-yellow-50 dark:hover:bg-yellow-800">
                      <td className="border p-2 text-center">{s.rank}</td>
                      <td className="border p-2">{s.fullName}</td>
                      <td className="border p-2 text-center">{s.finalSum.toFixed(2)}</td>
                      <td className="border p-2 text-center">{s.average.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MAIN TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th rowSpan="2" className="border p-2">Student</th>

                    {courseNames.map((course) => (
                      <th
                        key={course}
                        colSpan="3"
                        className="border p-2 text-center"
                      >
                        {course}
                      </th>
                    ))}

                    <th rowSpan="2" className="border p-2">Total</th>
                    <th rowSpan="2" className="border p-2">Average</th>
                    <th rowSpan="2" className="border p-2">Rank</th>
                    <th rowSpan="2" className="border p-2">Status</th>
                     <th rowSpan="2" className="border p-2">Card</th>
                    <th rowSpan="2" className="border p-2">Unloack</th>
                  </tr>

                  <tr className="bg-gray-50 dark:bg-gray-800">
                    {courseNames.map((course) => (
                      <>
                        <th key={course + "1"} className="border p-2">Sem 1</th>
                        <th key={course + "2"} className="border p-2">Sem 2</th>
                        <th key={course + "3"} className="border p-2">Avg</th>
                      </>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student.studentId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="border p-2 font-medium">{student.fullName}</td>

                      {courseNames.map((course) => {
                        const c = student.courses[course] || {
                          sem1Total: 0,
                          sem2Total: 0,
                          AVG: 0,
                        };

                        return (
                          <>
                            <td className="border p-2 text-center">{c.sem1Total}</td>
                            <td className="border p-2 text-center">{c.sem2Total}</td>
                            <td className="border p-2 text-center">{c.AVG}</td>
                          </>
                        );
                      })}

                      <td className="border p-2 text-center font-semibold">
                        {student.finalSum.toFixed(2)}
                      </td>

                      <td className="border p-2 text-center">
                        {student.average.toFixed(2)}
                      </td>

                      <td className="border p-2 text-center">
                        {student.rank}
                      </td>

                      <td
                        className={`border p-2 text-center font-bold ${
                          student.status === "Pass"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {student.status}
                      </td>
                   {/* GENERATE REPORT CARD BUTTON */}
    <td className="border p-2 text-center">
      <button
        onClick={() => generateReportCard(student, meta)}
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700 text-xs"
      >
        PDF
      </button>
    </td>

    {/* UNLOCK GRADE BUTTON */}
    <td className="border p-2 text-center">
     <button onClick={() => handleUnlock(student.gradeId)}

        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-xs"
      >
        Unlock
      </button>
    </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default GradeDashboard;
