const AssignmentTable = ({ assignments, onDelete, onEdit, loading }) => {
  return (
    <div className="mt-4">

      {loading && <p>Loading assignments...</p>}

      <table className="w-full border text-sm">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="p-2">Grade</th>
            <th className="p-2">Section</th>
            <th className="p-2">Stream</th>
            <th className="p-2">Course</th>
            <th className="p-2">Teacher</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {assignments?.map((row) => {
            // FIX: support both formats
            const a = row.assignment ? row.assignment : row;

            if (!a) return null; // extra safety

            return (
              <tr key={a._id} className="border-b">
                <td className="p-2">{a.grade}</td>
                <td className="p-2">{a.section}</td>
                <td className="p-2">{a.stream}</td>
                <td className="p-2">{a.course?.name || "—"}</td>
                <td className="p-2">{a.teacher?.fullName || "—"}</td>

                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => onEdit(a._id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(a._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
};

export default AssignmentTable;
