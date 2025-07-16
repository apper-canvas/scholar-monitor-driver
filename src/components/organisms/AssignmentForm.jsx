import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { assignmentService } from "@/services/api/assignmentService";
import { toast } from "react-toastify";

const AssignmentForm = ({ assignment, classes, initialDate, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    classId: "",
    points: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title || "",
        description: assignment.description || "",
        dueDate: assignment.dueDate || "",
        classId: assignment.classId || "",
        points: assignment.points || ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        dueDate: initialDate || "",
        classId: "",
        points: ""
      });
    }
  }, [assignment, initialDate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (!formData.classId) {
      newErrors.classId = "Class is required";
    }

    if (!formData.points || formData.points < 0) {
      newErrors.points = "Points must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const submissionData = {
        ...formData,
        classId: parseInt(formData.classId),
        points: parseInt(formData.points)
      };

      let result;
      if (assignment) {
        result = await assignmentService.update(assignment.Id, submissionData);
        toast.success("Assignment updated successfully");
      } else {
        result = await assignmentService.create(submissionData);
        toast.success("Assignment created successfully");
      }
      
      onSuccess(result);
    } catch (err) {
      console.error("Error saving assignment:", err);
      toast.error(assignment ? "Failed to update assignment" : "Failed to create assignment");
    } finally {
      setLoading(false);
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

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ApperIcon name="Calendar" className="h-5 w-5 text-primary-600" />
          <span>{assignment ? "Edit Assignment" : "Create New Assignment"}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Assignment Title"
              id="title"
              value={formData.title}
              onChange={handleChange("title")}
              error={errors.title}
              placeholder="e.g., Chapter 5 Quiz"
            />
            
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
            label="Description"
            id="description"
            value={formData.description}
            onChange={handleChange("description")}
            error={errors.description}
            placeholder="Describe the assignment requirements..."
            type="textarea"
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Due Date"
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange("dueDate")}
              error={errors.dueDate}
            />
            
            <FormField
              label="Points"
              id="points"
              type="number"
              value={formData.points}
              onChange={handleChange("points")}
              error={errors.points}
              placeholder="100"
              min="0"
            />
          </div>

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
                  {assignment ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                  {assignment ? "Update Assignment" : "Create Assignment"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AssignmentForm;