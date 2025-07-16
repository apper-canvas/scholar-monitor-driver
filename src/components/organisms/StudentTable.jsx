import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const StudentTable = ({ 
  students, 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  onAdd, 
  onRetry 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("lastName");
  const [sortDirection, setSortDirection] = useState("asc");

  const filteredStudents = students.filter(student => 
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={onRetry} />;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Users" className="h-5 w-5 text-primary-600" />
            <span>Students</span>
            <Badge variant="secondary">{students.length}</Badge>
          </CardTitle>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <SearchBar
              placeholder="Search students..."
              onSearch={setSearchQuery}
              className="w-full sm:w-80"
            />
            <Button onClick={onAdd} size="sm">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {sortedStudents.length === 0 ? (
          <Empty
            title="No students found"
            description="Start building your class roster by adding students to the system."
            actionLabel="Add First Student"
            onAction={onAdd}
            icon="UserPlus"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => handleSort("lastName")}
                      className="flex items-center space-x-1 text-sm font-medium text-slate-700 hover:text-slate-900"
                    >
                      <span>Name</span>
                      <ApperIcon 
                        name={sortField === "lastName" ? (sortDirection === "asc" ? "ChevronUp" : "ChevronDown") : "ChevronsUpDown"} 
                        className="h-4 w-4" 
                      />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => handleSort("gradeLevel")}
                      className="flex items-center space-x-1 text-sm font-medium text-slate-700 hover:text-slate-900"
                    >
                      <span>Grade</span>
                      <ApperIcon 
                        name={sortField === "gradeLevel" ? (sortDirection === "asc" ? "ChevronUp" : "ChevronDown") : "ChevronsUpDown"} 
                        className="h-4 w-4" 
                      />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <span className="text-sm font-medium text-slate-700">Contact</span>
                  </th>
                  <th className="text-left py-3 px-4">
                    <span className="text-sm font-medium text-slate-700">Status</span>
                  </th>
                  <th className="text-right py-3 px-4">
                    <span className="text-sm font-medium text-slate-700">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student, index) => (
                  <tr key={student.Id} className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-slate-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-slate-500">{student.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">Grade {student.gradeLevel}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-slate-600">{student.phone}</div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={student.status === "Active" ? "success" : "warning"}>
                        {student.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(student)}
                        >
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(student.Id)}
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

export default StudentTable;