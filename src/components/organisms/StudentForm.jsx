import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const StudentForm = ({ student, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gradeLevel: 9,
    email: "",
    phone: "",
    status: "Active"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        gradeLevel: student.gradeLevel || 9,
        email: student.email || "",
        phone: student.phone || "",
        status: student.status || "Active"
      });
    }
  }, [student]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field) => (e) => {
    const value = field === "gradeLevel" ? parseInt(e.target.value) : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ApperIcon name="UserPlus" className="h-5 w-5 text-primary-600" />
          <span>{student ? "Edit Student" : "Add New Student"}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="First Name"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange("firstName")}
              error={errors.firstName}
              placeholder="Enter first name"
            />
            
            <FormField
              label="Last Name"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange("lastName")}
              error={errors.lastName}
              placeholder="Enter last name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Grade Level"
              id="gradeLevel"
              error={errors.gradeLevel}
            >
              <Select
                id="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange("gradeLevel")}
              >
                {[9, 10, 11, 12].map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </Select>
            </FormField>
            
            <FormField
              label="Status"
              id="status"
              error={errors.status}
            >
              <Select
                id="status"
                value={formData.status}
                onChange={handleChange("status")}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Transferred">Transferred</option>
              </Select>
            </FormField>
          </div>

          <FormField
            label="Email Address"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            error={errors.email}
            placeholder="student@email.com"
          />

          <FormField
            label="Phone Number"
            id="phone"
            value={formData.phone}
            onChange={handleChange("phone")}
            error={errors.phone}
            placeholder="(555) 123-4567"
          />

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
                  {student ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                  {student ? "Update Student" : "Add Student"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;