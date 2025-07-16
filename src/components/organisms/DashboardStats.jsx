import { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    averageGPA: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");

      const [students, classes, grades, attendance] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);

      // Calculate average GPA
      const studentGPAs = await Promise.all(
        students.map(student => gradeService.calculateStudentGPA(student.Id))
      );
      const averageGPA = studentGPAs.length > 0 
        ? studentGPAs.reduce((sum, gpa) => sum + gpa, 0) / studentGPAs.length
        : 0;

      // Calculate attendance rate
      const presentCount = attendance.filter(record => record.status === "Present").length;
      const attendanceRate = attendance.length > 0 
        ? (presentCount / attendance.length) * 100
        : 100;

      setStats({
        totalStudents: students.length,
        totalClasses: classes.length,
        averageGPA: Number(averageGPA.toFixed(2)),
        attendanceRate: Number(attendanceRate.toFixed(1))
      });

    } catch (err) {
      console.error("Error loading dashboard stats:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadStats} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Students"
        value={stats.totalStudents}
        subtitle="Enrolled students"
        icon="Users"
        gradient="primary"
      />
      
      <StatCard
        title="Total Classes"
        value={stats.totalClasses}
        subtitle="Active classes"
        icon="BookOpen"
        gradient="secondary"
      />
      
      <StatCard
        title="Average GPA"
        value={stats.averageGPA}
        subtitle="Class performance"
        icon="TrendingUp"
        gradient="success"
        trend="up"
        trendValue="+2.3%"
      />
      
      <StatCard
        title="Attendance Rate"
        value={`${stats.attendanceRate}%`}
        subtitle="Overall attendance"
        icon="CheckSquare"
        gradient="accent"
        trend="up"
        trendValue="+1.5%"
      />
    </div>
  );
};

export default DashboardStats;