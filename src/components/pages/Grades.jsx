import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import GradeEntryForm from "@/components/organisms/GradeEntryForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import GradeBadge from "@/components/molecules/GradeBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { gradeService } from "@/services/api/gradeService";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [filterClass, setFilterClass] = useState("");
  const [filterStudent, setFilterStudent] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [gradeData, studentData, classData] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll(),
        classService.getAll()
      ]);
      setGrades(gradeData);
      setStudents(studentData);
      setClasses(classData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load grades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredGrades = grades.filter(grade => {
    const classMatch = !filterClass || grade.classId === parseInt(filterClass);
    const studentMatch = !filterStudent || grade.studentId === parseInt(filterStudent);
    return classMatch && studentMatch;
  });

  const handleAdd = () => {
    setEditingGrade(null);
    setShowForm(true);
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setShowForm(true);
  };

  const handleDelete = async (gradeId) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      try {
        await gradeService.delete(gradeId);
        setGrades(prev => prev.filter(g => g.Id !== gradeId));
        toast.success("Grade deleted successfully");
      } catch (err) {
        console.error("Error deleting grade:", err);
        toast.error("Failed to delete grade");
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (editingGrade) {
        const updated = await gradeService.update(editingGrade.Id, formData);
        setGrades(prev => prev.map(g => g.Id === editingGrade.Id ? updated : g));
        toast.success("Grade updated successfully");
      } else {
        const newGrade = await gradeService.create(formData);
        setGrades(prev => [newGrade, ...prev]);
        toast.success("Grade added successfully");
      }
      
      setShowForm(false);
      setEditingGrade(null);
    } catch (err) {
      console.error("Error saving grade:", err);
      toast.error(editingGrade ? "Failed to update grade" : "Failed to add grade");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGrade(null);
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
  };

  const getClassName = (classId) => {
    const classItem = classes.find(c => c.Id === classId);
    return classItem ? classItem.name : "Unknown Class";
  };

  if (showForm) {
    return (
      <GradeEntryForm
        students={students}
        classes={classes}
        grade={editingGrade}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={formLoading}
      />
    );
  }

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="GraduationCap" className="h-5 w-5 text-primary-600" />
            <span>Grade Management</span>
            <Badge variant="secondary">{filteredGrades.length}</Badge>
          </CardTitle>
          <Button onClick={handleAdd} size="sm">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Grade
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Class
            </label>
            <Select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="">All classes</option>
              {classes.map(classItem => (
                <option key={classItem.Id} value={classItem.Id}>
                  {classItem.name}
                </option>
              ))}
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Student
            </label>
            <Select
              value={filterStudent}
              onChange={(e) => setFilterStudent(e.target.value)}
            >
              <option value="">All students</option>
              {students.map(student => (
                <option key={student.Id} value={student.Id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredGrades.length === 0 ? (
          <Empty
            title="No grades found"
            description="Start tracking student progress by adding grades for assignments, tests, and projects."
            actionLabel="Add First Grade"
            onAction={handleAdd}
            icon="GraduationCap"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4">
                    <span className="text-sm font-medium text-slate-700">Student</span>
                  </th>
                  <th className="text-left py-3 px-4">
                    <span className="text-sm font-medium text-slate-700">Class</span>
                  </th>
                  <th className="text-left py-3 px-4">
                    <span className="text-sm font-medium text-slate-700">Assignment</span>
                  </th>
                  <th className="text-left py-3 px-4">
                    <span className="text-sm font-medium text-slate-700">Score</span>
                  </th>
                  <th className="text-left py-3 px-4">
                    <span className="text-sm font-medium text-slate-700">Grade</span>
                  </th>
                  <th className="text-left py-3 px-4">
                    <span className="text-sm font-medium text-slate-700">Date</span>
                  </th>
                  <th className="text-right py-3 px-4">
                    <span className="text-sm font-medium text-slate-700">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade, index) => (
                  <tr key={grade.Id} className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-900">
                        {getStudentName(grade.studentId)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">
                        {getClassName(grade.classId)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-slate-900">{grade.assignmentName}</div>
                        <div className="text-sm text-slate-500">{grade.category}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-slate-900 font-medium">
                        {grade.score}/{grade.maxScore}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <GradeBadge score={grade.score} maxScore={grade.maxScore} />
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-600">
                        {new Date(grade.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(grade)}
                        >
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(grade.Id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Grades;