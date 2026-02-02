export const generateUsername = async (Student) => {
  const year = new Date().getFullYear();
  const prefix = `GVS${year}`;

  const lastStudent = await Student.findOne({
    username: new RegExp(`^${prefix}`)
  }).sort({ createdAt: -1 });

  let nextNumber = 1;
  if (lastStudent) {
    nextNumber = parseInt(lastStudent.username.slice(-3)) + 1;
  }

  return `${prefix}${String(nextNumber).padStart(3, "0")}`;
};
