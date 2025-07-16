import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from "date-fns";
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { assignmentService } from "@/services/api/assignmentService";
import { toast } from "react-toastify";
import AssignmentForm from "./AssignmentForm";

const AssignmentCalendar = ({ classes }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [draggedAssignment, setDraggedAssignment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await assignmentService.getAll();
      setAssignments(data);
    } catch (err) {
      console.error("Error loading assignments:", err);
      setError("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAssignmentsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return assignments.filter(assignment => assignment.dueDate === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    const assignment = assignments.find(a => a.Id === parseInt(active.id));
    setDraggedAssignment(assignment);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setDraggedAssignment(null);
      return;
    }

    const assignmentId = parseInt(active.id);
    const newDate = over.id;

    if (draggedAssignment.dueDate !== newDate) {
      try {
        await assignmentService.updateDueDate(assignmentId, newDate);
        setAssignments(prev => 
          prev.map(a => 
            a.Id === assignmentId 
              ? { ...a, dueDate: newDate }
              : a
          )
        );
        toast.success("Assignment deadline updated successfully");
      } catch (err) {
        console.error("Error updating assignment:", err);
        toast.error("Failed to update assignment deadline");
      }
    }

    setActiveId(null);
    setDraggedAssignment(null);
  };

  const handleAddAssignment = (date) => {
    setSelectedDate(date);
    setEditingAssignment(null);
    setShowForm(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await assignmentService.delete(assignmentId);
        setAssignments(prev => prev.filter(a => a.Id !== assignmentId));
        toast.success("Assignment deleted successfully");
      } catch (err) {
        console.error("Error deleting assignment:", err);
        toast.error("Failed to delete assignment");
      }
    }
  };

  const handleFormSuccess = (assignment) => {
    if (editingAssignment) {
      setAssignments(prev => 
        prev.map(a => a.Id === assignment.Id ? assignment : a)
      );
    } else {
      setAssignments(prev => [assignment, ...prev]);
    }
    setShowForm(false);
    setEditingAssignment(null);
    setSelectedDate(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ApperIcon name="Loader2" className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadAssignments}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showForm && (
        <AssignmentForm
          assignment={editingAssignment}
          classes={classes}
          initialDate={selectedDate}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingAssignment(null);
            setSelectedDate(null);
          }}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Assignment Calendar</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevMonth}
              >
                <ApperIcon name="ChevronLeft" className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold min-w-[180px] text-center">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextMonth}
              >
                <ApperIcon name="ChevronRight" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-slate-600">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const dayAssignments = getAssignmentsForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isTodayDate = isToday(day);

                return (
                  <div
                    key={dateStr}
                    id={dateStr}
                    className={`
                      min-h-[120px] p-2 border border-slate-200 calendar-cell
                      ${isCurrentMonth ? 'bg-white' : 'bg-slate-50'}
                      ${isTodayDate ? 'bg-blue-50 border-blue-300' : ''}
                      hover:bg-slate-50 transition-colors
                    `}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-medium ${
                        isCurrentMonth ? 'text-slate-900' : 'text-slate-400'
                      } ${isTodayDate ? 'text-blue-600' : ''}`}>
                        {format(day, 'd')}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-blue-100"
                        onClick={() => handleAddAssignment(dateStr)}
                      >
                        <ApperIcon name="Plus" className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="space-y-1">
                      {dayAssignments.map(assignment => {
                        const classItem = classes.find(c => c.Id === assignment.classId);
                        return (
                          <div
                            key={assignment.Id}
                            id={assignment.Id.toString()}
                            className="assignment-item bg-primary-100 text-primary-800 p-1 rounded text-xs cursor-move hover:bg-primary-200 transition-colors"
                            draggable
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{assignment.title}</p>
                                <p className="text-xs text-primary-600 truncate">
                                  {classItem?.name || 'Unknown Class'}
                                </p>
                              </div>
                              <div className="flex space-x-1 ml-1">
                                <button
                                  onClick={() => handleEditAssignment(assignment)}
                                  className="hover:text-primary-900"
                                >
                                  <ApperIcon name="Edit" className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAssignment(assignment.Id)}
                                  className="hover:text-red-600"
                                >
                                  <ApperIcon name="Trash2" className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <DragOverlay>
              {draggedAssignment && (
                <div className="assignment-item bg-primary-200 text-primary-800 p-1 rounded text-xs shadow-lg">
                  <p className="font-medium">{draggedAssignment.title}</p>
                  <p className="text-xs text-primary-600">
                    {classes.find(c => c.Id === draggedAssignment.classId)?.name || 'Unknown Class'}
                  </p>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentCalendar;