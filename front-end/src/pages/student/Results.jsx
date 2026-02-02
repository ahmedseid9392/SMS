import React from "react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";

const Results = () => {
  const { user } = useAuth();
  const data = user.role === "PARENT" ? user.child : user;
  const isParent = user.role === "PARENT";

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          {isParent ? `${data.name}'s Results` : "My Results"}
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Academic Performance</h2>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Subject</th>
                <th className="px-4 py-2 text-center">Score</th>
                <th className="px-4 py-2 text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((result, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3">{result.subject}</td>
                  <td className="px-4 py-3 text-center">{result.score}</td>
                  <td className="px-4 py-3 text-center font-bold text-blue-600">{result.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.results.length === 0 && (
            <p className="text-center py-4 text-gray-500">No results available yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Results;