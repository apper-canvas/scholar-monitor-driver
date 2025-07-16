import classesData from "@/services/mockData/classes.json";

let classes = [...classesData];

export const classService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...classes];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const classItem = classes.find(c => c.Id === parseInt(id));
    return classItem ? { ...classItem } : null;
  },

  async create(classData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...classes.map(c => c.Id), 0);
    const newClass = {
      Id: maxId + 1,
      ...classData,
      studentIds: classData.studentIds || []
    };
    classes.push(newClass);
    return { ...newClass };
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      classes[index] = { ...classes[index], ...updateData };
      return { ...classes[index] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      const deleted = classes.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  },

  async addStudentToClass(classId, studentId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const classItem = classes.find(c => c.Id === parseInt(classId));
    if (classItem && !classItem.studentIds.includes(parseInt(studentId))) {
      classItem.studentIds.push(parseInt(studentId));
      return { ...classItem };
    }
    return null;
  },

  async removeStudentFromClass(classId, studentId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const classItem = classes.find(c => c.Id === parseInt(classId));
    if (classItem) {
      classItem.studentIds = classItem.studentIds.filter(id => id !== parseInt(studentId));
      return { ...classItem };
    }
return null;
  },

  async getAssignmentsByClass(classId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const classItem = classes.find(c => c.Id === parseInt(classId));
    return classItem ? classItem.assignments || [] : [];
  },

  async addAssignmentToClass(classId, assignmentId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const classItem = classes.find(c => c.Id === parseInt(classId));
    if (classItem) {
      if (!classItem.assignments) classItem.assignments = [];
      if (!classItem.assignments.includes(parseInt(assignmentId))) {
        classItem.assignments.push(parseInt(assignmentId));
      }
      return { ...classItem };
    }
    return null;
  },

  async removeAssignmentFromClass(classId, assignmentId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const classItem = classes.find(c => c.Id === parseInt(classId));
    if (classItem && classItem.assignments) {
      classItem.assignments = classItem.assignments.filter(id => id !== parseInt(assignmentId));
      return { ...classItem };
    }
    return null;
  }
};