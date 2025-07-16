import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

export const attendanceService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...attendance];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const record = attendance.find(a => a.Id === parseInt(id));
    return record ? { ...record } : null;
  },

  async getByStudentId(studentId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return attendance.filter(a => a.studentId === parseInt(studentId));
  },

  async getByClassId(classId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return attendance.filter(a => a.classId === parseInt(classId));
  },

  async getByDate(date) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return attendance.filter(a => a.date === date);
  },

  async create(attendanceData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...attendance.map(a => a.Id), 0);
    const newRecord = {
      Id: maxId + 1,
      ...attendanceData,
      date: attendanceData.date || new Date().toISOString().split("T")[0]
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      attendance[index] = { ...attendance[index], ...updateData };
      return { ...attendance[index] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      const deleted = attendance.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  },

  async markAttendance(studentId, classId, date, status, notes = "") {
    await new Promise(resolve => setTimeout(resolve, 350));
    const existingRecord = attendance.find(a => 
      a.studentId === parseInt(studentId) && 
      a.classId === parseInt(classId) && 
      a.date === date
    );

    if (existingRecord) {
      const index = attendance.findIndex(a => a.Id === existingRecord.Id);
      attendance[index] = { ...attendance[index], status, notes };
      return { ...attendance[index] };
    } else {
      const maxId = Math.max(...attendance.map(a => a.Id), 0);
      const newRecord = {
        Id: maxId + 1,
        studentId: parseInt(studentId),
        classId: parseInt(classId),
        date,
        status,
        notes
      };
      attendance.push(newRecord);
      return { ...newRecord };
    }
  },

  async calculateAttendanceRate(studentId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const studentAttendance = attendance.filter(a => a.studentId === parseInt(studentId));
    if (studentAttendance.length === 0) return 100;
    
    const presentCount = studentAttendance.filter(a => a.status === "Present").length;
    return Number((presentCount / studentAttendance.length * 100).toFixed(1));
  }
};