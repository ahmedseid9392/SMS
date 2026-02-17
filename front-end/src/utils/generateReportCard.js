import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateReportCard = (student, sectionMeta) => {
  const doc = new jsPDF("p", "mm", "a4");

  // HEADER
  doc.setFontSize(20);
  doc.text("SCHOOL REPORT CARD", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Name: ${student.fullName}`, 20, 40);
  doc.text(`Grade: ${sectionMeta.grade}`, 20, 47);
  doc.text(`Section: ${sectionMeta.section}`, 20, 54);
  doc.text(`Stream: ${sectionMeta.stream}`, 20, 61);

  // TABLE DATA
  const tableData = Object.keys(student.courses).map((course) => {
    const c = student.courses[course];
    return [
      course,
      c.sem1Total,
      c.sem2Total,
      ((c.sem1Total + c.sem2Total) / 2).toFixed(2),
    ];
  });

  autoTable(doc, {
    startY: 75,
    head: [["Course", "Sem 1", "Sem 2", "Average"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [40, 40, 40],
      textColor: 255,
    },
  });

  // SUMMARY
  const finalY = doc.lastAutoTable.finalY + 15;

  doc.text(`Final Total: ${student.finalSum}`, 20, finalY);
  doc.text(`Average: ${student.average.toFixed(2)}`, 20, finalY + 7);
  doc.text(`Rank: ${student.rank}`, 20, finalY + 14);
  doc.text(`Status: ${student.status}`, 20, finalY + 21);

  // SIGNATURE
  doc.line(20, finalY + 40, 90, finalY + 40);
  doc.text("Principal Signature", 20, finalY + 46);

  doc.save(`${student.fullName}_ReportCard.pdf`);
};
