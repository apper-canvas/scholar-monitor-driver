import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const GradeEntryForm = ({ 
  students, 
  classes, 
  grade, 
  onSubmit, 
  onCancel, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    studentId: "",
    classId: "",
    assignmentName: "",
    score: "",
    maxScore: "100",
    category: "Assignment"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (grade) {
      setFormData({
        studentId: grade.studentId.toString(),
        classId: grade.classId.toString(),
        assignmentName: grade.assignmentName || "",
        score: grade.score.toString(),
        maxScore: grade.maxScore.toString(),
        category: grade.category || "Assignment"
      });
    }
  }, [grade]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentId) {
      newErrors.studentId = "Please select a student";
    }

    if (!formData.classId) {
      newErrors.classId = "Please select a class";
    }

    if (!formData.assignmentName.trim()) {
      newErrors.assignmentName = "Assignment name is required";
    }

    if (!formData.score) {
      newErrors.score = "Score is required";
    } else if (isNaN(formData.score) || parseFloat(formData.score) < 0) {
      newErrors.score = "Score must be a valid number";
    }

    if (!formData.maxScore) {
      newErrors.maxScore = "Max score is required";
    } else if (isNaN(formData.maxScore) || parseFloat(formData.maxScore) <= 0) {
      newErrors.maxScore = "Max score must be a positive number";
    }

    if (parseFloat(formData.score) > parseFloat(formData.maxScore)) {
      newErrors.score = "Score cannot exceed max score";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        studentId: parseInt(formData.studentId),
        classId: parseInt(formData.classId),
        score: parseFloat(formData.score),
        maxScore: parseFloat(formData.maxScore)
      });
    }
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

  const selectedStudent = students.find(s => s.Id === parseInt(formData.studentId));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ApperIcon name="GraduationCap" className="h-5 w-5 text-primary-600" />
          <span>{grade ? "Edit Grade" : "Add New Grade"}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Student"
              id="studentId"
              error={errors.studentId}
            >
              <Select
                id="studentId"
                value={formData.studentId}
                onChange={handleChange("studentId")}
              >
                <option value="">Select a student</option>
                {students.map(student => (
                  <option key={student.Id} value={student.Id}>
                    {student.firstName} {student.lastName}
                  </option>
                ))}
              </Select>
            </FormField>
            
            <FormField
              label="Class"
              id="classId"
              error={errors.classId}
            >
              <Select
                id="classId"
                value={formData.classId}
                onChange={handleChange("classId")}
              >
                <option value="">Select a class</option>
                {classes.map(classItem => (
                  <option key={classItem.Id} value={classItem.Id}>
                    {classItem.name} - {classItem.subject}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField
            label="Assignment Name"
            id="assignmentName"
            value={formData.assignmentName}
            onChange={handleChange("assignmentName")}
            error={errors.assignmentName}
            placeholder="e.g., Quiz 1, Essay Assignment, Final Exam"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              label="Score"
              id="score"
              type="number"
              value={formData.score}
              onChange={handleChange("score")}
              error={errors.score}
              placeholder="85"
              min="0"
              step="0.1"
            />
            
            <FormField
              label="Max Score"
              id="maxScore"
              type="number"
              value={formData.maxScore}
              onChange={handleChange("maxScore")}
              error={errors.maxScore}
              placeholder="100"
              min="1"
              step="0.1"
            />
            
            <FormField
              label="Category"
              id="category"
              error={errors.category}
            >
              <Select
                id="category"
                value={formData.category}
                onChange={handleChange("category")}
              >
                <option value="Assignment">Assignment</option>
                <option value="Quiz">Quiz</option>
                <option value="Test">Test</option>
                <option value="Exam">Exam</option>
                <option value="Project">Project</option>
                <option value="Homework">Homework</option>
                <option value="Lab">Lab</option>
                <option value="Essay">Essay</option>
              </Select>
            </FormField>
          </div>

          {formData.score && formData.maxScore && (
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">Percentage:</span>
                <span className="text-lg font-bold text-primary-600">
                  {((parseFloat(formData.score) / parseFloat(formData.maxScore)) * 100).toFixed(1)}%
                </span>
              </div>
              {selectedStudent && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium text-slate-700">Student:</span>
                  <span className="text-sm text-slate-600">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                  {grade ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                  {grade ? "Update Grade" : "Add Grade"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GradeEntryForm;