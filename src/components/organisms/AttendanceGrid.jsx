import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import AttendanceIndicator from "@/components/molecules/AttendanceIndicator";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const AttendanceGrid = ({ 
  students, 
  classes, 
  attendance, 
  loading, 
  error, 
  onMarkAttendance, 
  onRetry 
}) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const filteredStudents = selectedClass 
    ? students.filter(student => {
        const classItem = classes.find(c => c.Id === parseInt(selectedClass));
        return classItem && classItem.studentIds.includes(student.Id);
      })
    : [];

  const getAttendanceStatus = (studentId) => {
    const record = attendance.find(a => 
      a.studentId === studentId && 
      a.classId === parseInt(selectedClass) && 
      a.date === selectedDate
    );
    return record ? record.status : "Not Marked";
  };

  const handleStatusChange = async (studentId, status) => {
    if (selectedClass) {
      await onMarkAttendance(studentId, parseInt(selectedClass), selectedDate, status);
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={onRetry} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ApperIcon name="CheckSquare" className="h-5 w-5 text-primary-600" />
          <span>Attendance Tracking</span>
        </CardTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Class
            </label>
            <Select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Choose a class</option>
              {classes.map(classItem => (
                <option key={classItem.Id} value={classItem.Id}>
                  {classItem.name} - {classItem.period}
                </option>
              ))}
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex h-10 w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {!selectedClass ? (
          <Empty
            title="Select a class to continue"
            description="Choose a class from the dropdown above to start taking attendance."
            icon="BookOpen"
          />
        ) : filteredStudents.length === 0 ? (
          <Empty
            title="No students in this class"
            description="This class doesn't have any enrolled students yet."
            icon="Users"
          />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map(student => {
                const status = getAttendanceStatus(student.Id);
                return (
                  <div key={student.Id} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-slate-900">
                          {student.firstName} {student.lastName}
                        </h4>
                        <p className="text-sm text-slate-500">Grade {student.gradeLevel}</p>
                      </div>
                      <AttendanceIndicator status={status} />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={status === "Present" ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handleStatusChange(student.Id, "Present")}
                        className="text-xs"
                      >
                        Present
                      </Button>
                      <Button
                        variant={status === "Late" ? "warning" : "outline"}
                        size="sm"
                        onClick={() => handleStatusChange(student.Id, "Late")}
                        className="text-xs"
                      >
                        Late
                      </Button>
                      <Button
                        variant={status === "Absent" ? "danger" : "outline"}
                        size="sm"
                        onClick={() => handleStatusChange(student.Id, "Absent")}
                        className="text-xs"
                      >
                        Absent
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="pt-4 border-t border-slate-200">
              <div className="text-sm text-slate-600">
                <span className="font-medium">
                  {filteredStudents.filter(s => getAttendanceStatus(s.Id) === "Present").length}
                </span> present, 
                <span className="font-medium ml-1">
                  {filteredStudents.filter(s => getAttendanceStatus(s.Id) === "Late").length}
                </span> late, 
                <span className="font-medium ml-1">
                  {filteredStudents.filter(s => getAttendanceStatus(s.Id) === "Absent").length}
                </span> absent of {filteredStudents.length} students
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceGrid;