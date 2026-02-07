const AssignedStudentsTable = ({ students }) => {
  return (
    <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="p-2 text-gray-900 dark:text-gray-100">#</th>
             <th className="p-2 text-gray-900 dark:text-gray-100">Username</th>
            <th className="p-2 text-gray-900 dark:text-gray-100">Student Name</th>
            <th className="p-2 text-gray-900 dark:text-gray-100">Gender</th>
           
            <th className="p-2 text-gray-900 dark:text-gray-100">Status</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="p-3 text-center text-gray-600 dark:text-gray-300"
              >
                No students found in this class.
              </td>
            </tr>
          ) : (
            students.map((stu, index) => (
              <tr
                key={stu._id}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40"
              >
                <td className="p-2 text-gray-800 dark:text-gray-200">{index + 1}</td>
                 <td className="p-2 text-gray-800 dark:text-gray-200">
                  {stu.username || "—"}
                </td>
                <td className="p-2 text-gray-800 dark:text-gray-200">
                  {stu.fullName}
                </td>
                <td className="p-2 text-gray-800 dark:text-gray-200">
                  {stu.sex}
                </td>
               
                <td className="p-2 text-gray-800 dark:text-gray-200">
                  {stu.status || "Active"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignedStudentsTable;
