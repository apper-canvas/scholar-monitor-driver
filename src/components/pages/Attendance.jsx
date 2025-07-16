import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import { attendanceService } from "@/services/api/attendanceService";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [studentData, classData, attendanceData] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        attendanceService.getAll()
      ]);
      setStudents(studentData);
      setClasses(classData);
      setAttendance(attendanceData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkAttendance = async (studentId, classId, date, status, notes = "") => {
    try {
      const result = await attendanceService.markAttendance(
        studentId, 
        classId, 
        date, 
        status, 
        notes
      );
      
      // Update local state
      setAttendance(prev => {
        const existingIndex = prev.findIndex(a => 
          a.studentId === studentId && 
          a.classId === classId && 
          a.date === date
        );
        
        if (existingIndex !== -1) {
          // Update existing record
          const updated = [...prev];
          updated[existingIndex] = result;
          return updated;
        } else {
          // Add new record
          return [result, ...prev];
        }
      });
      
      const student = students.find(s => s.Id === studentId);
      toast.success(`Marked ${student?.firstName} ${student?.lastName} as ${status.toLowerCase()}`);
    } catch (err) {
      console.error("Error marking attendance:", err);
      toast.error("Failed to mark attendance");
    }
  };

  return (
    <AttendanceGrid
      students={students}
      classes={classes}
      attendance={attendance}
      loading={loading}
      error={error}
      onMarkAttendance={handleMarkAttendance}
      onRetry={loadData}
    />
  );
};

export default Attendance;