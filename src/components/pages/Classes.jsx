import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ClassGrid from "@/components/organisms/ClassGrid";
import AssignmentCalendar from "@/components/organisms/AssignmentCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";
const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    period: "",
    room: "",
    studentIds: []
  });

  const [errors, setErrors] = useState({});

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [classData, studentData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ]);
      setClasses(classData);
      setStudents(studentData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (editingClass) {
      setFormData({
        name: editingClass.name || "",
        subject: editingClass.subject || "",
        period: editingClass.period || "",
        room: editingClass.room || "",
        studentIds: editingClass.studentIds || []
      });
    } else {
      setFormData({
        name: "",
        subject: "",
        period: "",
        room: "",
        studentIds: []
      });
    }
  }, [editingClass]);

  const handleAdd = () => {
    setEditingClass(null);
    setShowForm(true);
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setShowForm(true);
  };

const handleView = (classItem) => {
    toast.info(`Viewing details for ${classItem.name}`);
  };

  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
  };
  const handleDelete = async (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await classService.delete(classId);
        setClasses(prev => prev.filter(c => c.Id !== classId));
        toast.success("Class deleted successfully");
      } catch (err) {
        console.error("Error deleting class:", err);
        toast.error("Failed to delete class");
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Class name is required";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.period.trim()) {
      newErrors.period = "Period is required";
    }

    if (!formData.room.trim()) {
      newErrors.room = "Room is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setFormLoading(true);
      
      if (editingClass) {
        const updated = await classService.update(editingClass.Id, formData);
        setClasses(prev => prev.map(c => c.Id === editingClass.Id ? updated : c));
        toast.success("Class updated successfully");
      } else {
        const newClass = await classService.create(formData);
        setClasses(prev => [newClass, ...prev]);
        toast.success("Class added successfully");
      }
      
      setShowForm(false);
      setEditingClass(null);
    } catch (err) {
      console.error("Error saving class:", err);
      toast.error(editingClass ? "Failed to update class" : "Failed to add class");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingClass(null);
    setErrors({});
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleStudentToggle = (studentId) => {
    setFormData(prev => ({
      ...prev,
      studentIds: prev.studentIds.includes(studentId)
        ? prev.studentIds.filter(id => id !== studentId)
        : [...prev.studentIds, studentId]
    }));
  };

  if (showForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="BookOpen" className="h-5 w-5 text-primary-600" />
            <span>{editingClass ? "Edit Class" : "Add New Class"}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Class Name"
                id="name"
                value={formData.name}
                onChange={handleChange("name")}
                error={errors.name}
                placeholder="e.g., AP Mathematics"
              />
              
              <FormField
                label="Subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange("subject")}
                error={errors.subject}
                placeholder="e.g., Mathematics"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Period"
                id="period"
                error={errors.period}
              >
                <Select
                  id="period"
                  value={formData.period}
                  onChange={handleChange("period")}
                >
                  <option value="">Select period</option>
                  <option value="1st Period">1st Period</option>
                  <option value="2nd Period">2nd Period</option>
                  <option value="3rd Period">3rd Period</option>
                  <option value="4th Period">4th Period</option>
                  <option value="5th Period">5th Period</option>
                  <option value="6th Period">6th Period</option>
                  <option value="7th Period">7th Period</option>
                </Select>
              </FormField>
              
              <FormField
                label="Room"
                id="room"
                value={formData.room}
                onChange={handleChange("room")}
                error={errors.room}
                placeholder="e.g., Room 101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Assign Students
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto border border-slate-200 rounded-lg p-4">
                {students.map(student => (
                  <label key={student.Id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.studentIds.includes(student.Id)}
                      onChange={() => handleStudentToggle(student.Id)}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm">
                      {student.firstName} {student.lastName}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {formData.studentIds.length} student(s) selected
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={formLoading}
              >
                {formLoading ? (
                  <>
                    <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                    {editingClass ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                    {editingClass ? "Update Class" : "Add Class"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

if (showCalendar) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Assignment Calendar</h2>
          <Button
            variant="outline"
            onClick={handleCalendarToggle}
          >
            <ApperIcon name="Grid" className="h-4 w-4 mr-2" />
            Grid View
          </Button>
        </div>
        <AssignmentCalendar classes={classes} />
      </div>
    );
  }

  return (
    <ClassGrid
      classes={classes}
      loading={loading}
      error={error}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAdd={handleAdd}
      onView={handleView}
      onRetry={loadData}
      onCalendarToggle={handleCalendarToggle}
    />
  );
};

export default Classes;