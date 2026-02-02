import React from "react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";

const Assignments = () => {
  const { user } = useAuth();
  const data = user.role === "PARENT" ? user.child : user;
  const isParent = user.role === "PARENT";

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          {isParent ? `${data.name}'s Assignments` : "My Assignments"}
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {data.assignments.map((assignment, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">{assignment.title}</h3>
              <p className="text-gray-600 mb-2">Due: {assignment.due}</p>
              <p className={`font-medium ${assignment.status === "Pending" ? "text-red-600" : "text-green-600"}`}>
                Status: {assignment.status}
              </p>
            </div>
          ))}
          {data.assignments.length === 0 && (
            <p className="col-span-2 text-center py-4 text-gray-500">No assignments available yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Assignments;