import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const ClassGrid = ({ 
  classes, 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  onAdd, 
  onRetry,
  onView,
  onCalendarToggle
}) => {
  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={onRetry} />;

  if (classes.length === 0) {
    return (
      <Empty
        title="No classes found"
        description="Create your first class to start organizing students and managing coursework."
        actionLabel="Add First Class"
        onAction={onAdd}
        icon="BookOpen"
      />
    );
  }

return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Classes</h2>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onCalendarToggle}
          >
            <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
          <Button onClick={onAdd}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.Id} className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{classItem.name}</CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {classItem.subject}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(classItem)}
                  >
                    <ApperIcon name="Edit" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(classItem.Id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <ApperIcon name="Clock" className="h-4 w-4" />
                  <span>{classItem.period}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <ApperIcon name="MapPin" className="h-4 w-4" />
                  <span>{classItem.room}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <ApperIcon name="Users" className="h-4 w-4" />
                  <span>{classItem.studentIds.length} students</span>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => onView(classItem)}
                >
                  <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClassGrid;