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
  },

  async getPerformanceTrend(studentId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const studentGrades = grades.filter(g => g.studentId === parseInt(studentId));
    
    // Sort by date and calculate trend data
    const sortedGrades = studentGrades.sort((a, b) => new Date(a.date) - new Date(b.date));
    return sortedGrades.map(grade => ({
      date: grade.date,
      score: (grade.score / grade.maxScore) * 100,
      assignment: grade.assignmentName,
      category: grade.category
    }));
  },

  async calculateMonthlyAverages(studentId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const studentGrades = grades.filter(g => g.studentId === parseInt(studentId));
    
    // Group by month-year
    const monthlyData = {};
    studentGrades.forEach(grade => {
      const date = new Date(grade.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { scores: [], total: 0, count: 0 };
      }
      
      const percentage = (grade.score / grade.maxScore) * 100;
      monthlyData[monthKey].scores.push(percentage);
      monthlyData[monthKey].total += percentage;
      monthlyData[monthKey].count++;
    });
    
    // Calculate averages and format for chart
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      average: Number((data.total / data.count).toFixed(1)),
      assignmentCount: data.count
    })).sort((a, b) => a.month.localeCompare(b.month));
  }
};