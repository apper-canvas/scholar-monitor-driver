import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

export const gradeService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...grades];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const grade = grades.find(g => g.Id === parseInt(id));
    return grade ? { ...grade } : null;
  },

  async getByStudentId(studentId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return grades.filter(g => g.studentId === parseInt(studentId));
  },

  async getByClassId(classId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return grades.filter(g => g.classId === parseInt(classId));
  },

  async create(gradeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...grades.map(g => g.Id), 0);
    const newGrade = {
      Id: maxId + 1,
      ...gradeData,
      date: gradeData.date || new Date().toISOString().split("T")[0]
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      grades[index] = { ...grades[index], ...updateData };
      return { ...grades[index] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      const deleted = grades.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  },

  async calculateStudentGPA(studentId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const studentGrades = grades.filter(g => g.studentId === parseInt(studentId));
    if (studentGrades.length === 0) return 0;
    
    const totalPoints = studentGrades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0);
    return Number((totalPoints / studentGrades.length).toFixed(2));
  }
};