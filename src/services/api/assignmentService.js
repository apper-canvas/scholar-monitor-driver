import assignmentsData from "@/services/mockData/assignments.json";

let assignments = [...assignmentsData];

export const assignmentService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...assignments];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const assignment = assignments.find(a => a.Id === parseInt(id));
    return assignment ? { ...assignment } : null;
  },

  async getByClassId(classId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return assignments.filter(a => a.classId === parseInt(classId)).map(a => ({ ...a }));
  },

  async create(assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...assignments.map(a => a.Id), 0);
    const newAssignment = {
      Id: maxId + 1,
      ...assignmentData,
      status: assignmentData.status || 'pending'
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      assignments[index] = { ...assignments[index], ...updateData };
      return { ...assignments[index] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      const deleted = assignments.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  },

  async updateDueDate(id, newDueDate) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      assignments[index] = { ...assignments[index], dueDate: newDueDate };
      return { ...assignments[index] };
    }
    return null;
  }
};