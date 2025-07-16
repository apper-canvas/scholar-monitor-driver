import { useState, useEffect } from "react";
import DashboardStats from "@/components/organisms/DashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";

const Dashboard = () => {
  const [recentActivity, setRecentActivity] = useState([]);
  const [quickStats, setQuickStats] = useState({
    todayAttendance: 0,
    recentGrades: 0,
    upcomingTasks: 3
  });

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    try {
      const [students, grades, attendance] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);

      // Get today's attendance
      const today = new Date().toISOString().split("T")[0];
      const todayAttendance = attendance.filter(a => a.date === today);

      // Get recent grades (last 5)
      const sortedGrades = grades.sort((a, b) => new Date(b.date) - new Date(a.date));
      const recentGrades = sortedGrades.slice(0, 5);

      const activities = [
        ...todayAttendance.map(a => {
          const student = students.find(s => s.Id === a.studentId);
          return {
            id: `attendance-${a.Id}`,
            type: "attendance",
            message: `${student?.firstName} ${student?.lastName} marked ${a.status.toLowerCase()}`,
            time: "Today",
            icon: "CheckSquare",
            status: a.status
          };
        }),
        ...recentGrades.map(g => {
          const student = students.find(s => s.Id === g.studentId);
          const percentage = (g.score / g.maxScore) * 100;
          return {
            id: `grade-${g.Id}`,
            type: "grade",
            message: `${student?.firstName} ${student?.lastName} scored ${percentage.toFixed(0)}% on ${g.assignmentName}`,
            time: new Date(g.date).toLocaleDateString(),
            icon: "GraduationCap",
            score: percentage
          };
        })
      ].slice(0, 8);

      setRecentActivity(activities);
      setQuickStats({
        todayAttendance: todayAttendance.length,
        recentGrades: recentGrades.length,
        upcomingTasks: 3
      });

    } catch (err) {
      console.error("Error loading recent activity:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Scholar Hub</h1>
        <p className="text-white/90 text-lg">
          Manage your students, track progress, and stay organized with your daily tasks.
        </p>
        <div className="mt-6 flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Calendar" className="h-4 w-4" />
            <span>{new Date().toLocaleDateString("en-US", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Clock" className="h-4 w-4" />
            <span>{new Date().toLocaleTimeString("en-US", { 
              hour: "2-digit", 
              minute: "2-digit" 
            })}</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <DashboardStats />

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Zap" className="h-5 w-5 text-accent-500" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary-100">
                    <ApperIcon name="UserPlus" className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="font-medium text-slate-900">Add Student</span>
                </div>
                <ApperIcon name="ChevronRight" className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            
            <div className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-secondary-100">
                    <ApperIcon name="CheckSquare" className="h-4 w-4 text-secondary-600" />
                  </div>
                  <span className="font-medium text-slate-900">Take Attendance</span>
                </div>
                <Badge variant="warning">{quickStats.todayAttendance}</Badge>
              </div>
            </div>
            
            <div className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-accent-100">
                    <ApperIcon name="GraduationCap" className="h-4 w-4 text-accent-600" />
                  </div>
                  <span className="font-medium text-slate-900">Enter Grades</span>
                </div>
                <Badge variant="success">{quickStats.recentGrades}</Badge>
              </div>
            </div>
            
            <div className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <ApperIcon name="BookOpen" className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium text-slate-900">Manage Classes</span>
                </div>
                <ApperIcon name="ChevronRight" className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Activity" className="h-5 w-5 text-primary-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Calendar" className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No recent activity to display</p>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50">
                    <div className={`p-2 rounded-lg ${
                      activity.type === "attendance" ? "bg-blue-100" : "bg-green-100"
                    }`}>
                      <ApperIcon 
                        name={activity.icon} 
                        className={`h-4 w-4 ${
                          activity.type === "attendance" ? "text-blue-600" : "text-green-600"
                        }`} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                    {activity.status && (
                      <Badge 
                        variant={
                          activity.status === "Present" ? "success" : 
                          activity.status === "Late" ? "warning" : "error"
                        }
                      >
                        {activity.status}
                      </Badge>
                    )}
                    {activity.score && (
                      <Badge 
                        variant={
                          activity.score >= 90 ? "success" : 
                          activity.score >= 80 ? "primary" : 
                          activity.score >= 70 ? "warning" : "error"
                        }
                      >
                        {activity.score.toFixed(0)}%
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;