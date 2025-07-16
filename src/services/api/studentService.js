import studentsData from "@/services/mockData/students.json";

let students = [...studentsData];

export const studentService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...students];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const student = students.find(s => s.Id === parseInt(id));
    return student ? { ...student } : null;
  },

  async create(studentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...students.map(s => s.Id), 0);
    const newStudent = {
      Id: maxId + 1,
      ...studentData,
      enrollmentDate: new Date().toISOString().split("T")[0],
      status: "Active"
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index !== -1) {
      students[index] = { ...students[index], ...updateData };
      return { ...students[index] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index !== -1) {
      const deleted = students.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  },

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const searchLower = query.toLowerCase();
    return students.filter(student => 
      student.firstName.toLowerCase().includes(searchLower) ||
      student.lastName.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower)
    );
  }
};