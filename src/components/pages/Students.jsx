import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StudentTable from "@/components/organisms/StudentTable";
import StudentForm from "@/components/organisms/StudentForm";
import StudentOverview from "@/components/organisms/StudentOverview";
import { studentService } from "@/services/api/studentService";
const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      console.error("Error loading students:", err);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAdd = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleView = (student) => {
    setViewingStudent(student);
  };
  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(studentId);
        setStudents(prev => prev.filter(s => s.Id !== studentId));
        toast.success("Student deleted successfully");
      } catch (err) {
        console.error("Error deleting student:", err);
        toast.error("Failed to delete student");
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (editingStudent) {
        const updated = await studentService.update(editingStudent.Id, formData);
        setStudents(prev => prev.map(s => s.Id === editingStudent.Id ? updated : s));
        toast.success("Student updated successfully");
      } else {
        const newStudent = await studentService.create(formData);
        setStudents(prev => [newStudent, ...prev]);
        toast.success("Student added successfully");
      }
      
      setShowForm(false);
      setEditingStudent(null);
    } catch (err) {
      console.error("Error saving student:", err);
      toast.error(editingStudent ? "Failed to update student" : "Failed to add student");
    } finally {
      setFormLoading(false);
    }
  };

const handleCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleBackToList = () => {
    setViewingStudent(null);
  };
if (showForm) {
    return (
      <StudentForm
        student={editingStudent}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={formLoading}
      />
    );
  }

  if (viewingStudent) {
    return (
      <StudentOverview
        student={viewingStudent}
        onBack={handleBackToList}
      />
    );
  }

return (
    <StudentTable
      students={students}
      loading={loading}
      error={error}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAdd={handleAdd}
      onView={handleView}
      onRetry={loadStudents}
    />
  );
};

export default Students;