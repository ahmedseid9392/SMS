import React from "react";
import { mockTeacherClasses } from "../../data/mockClasses";

const ClassSelector = ({ selectedGrade, selectedSection, selectedSubject, selectedStream, onChange }) => {
  const grades = ["9th", "10th", "11th", "12th"];
  const sections = ["A", "B", "C", "D"];
  const subjects = ["Mathematics", "Science", "English", "History", "Computer Science"];
  const streams = ["Natural Science", "Social Science"];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-6">Select Class</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Grade */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Grade</label>
          <select
            value={selectedGrade}
            onChange={(e) => onChange("grade", e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          >
            <option value="">Choose Grade</option>
            {grades.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Stream (only for 11th/12th) */}
        {["11th", "12th"].includes(selectedGrade) && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Stream</label>
            <select
              value={selectedStream}
              onChange={(e) => onChange("stream", e.target.value)}
              disabled={!selectedGrade}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">Choose Stream</option>
              {streams.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        {/* Section */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Section</label>
          <select
            value={selectedSection}
            onChange={(e) => onChange("section", e.target.value)}
            disabled={!selectedGrade || (["11th", "12th"].includes(selectedGrade) && !selectedStream)}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">Choose Section</option>
            {sections.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => onChange("subject", e.target.value)}
            disabled={!selectedSection}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">Choose Subject</option>
            {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
          </select>
        </div>
      </div>

      {selectedGrade && selectedSection && selectedSubject && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="font-medium text-blue-800">
            Selected: <strong>{selectedSubject}</strong> — {selectedGrade} Section {selectedSection}
            {selectedStream && ` (${selectedStream})`}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            {mockTeacherClasses.find(c => 
              c.grade === selectedGrade && 
              c.section === selectedSection && 
              c.subject === selectedSubject &&
              (!["11th", "12th"].includes(selectedGrade) || c.stream === selectedStream)
            )?.students.length || 0} students enrolled
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassSelector;