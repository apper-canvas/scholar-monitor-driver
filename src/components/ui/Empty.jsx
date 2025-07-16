import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.", 
  actionLabel = "Add New",
  onAction,
  icon = "FileX"
}) => {
  return (
    <Card className="border-dashed border-2 border-slate-300">
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 rounded-full bg-gradient-to-r from-slate-100 to-slate-200">
            <ApperIcon name={icon} className="h-12 w-12 text-slate-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {title}
            </h3>
            <p className="text-slate-600 mb-6 max-w-sm">
              {description}
            </p>
            {onAction && (
              <Button 
                onClick={onAction}
                variant="primary"
                size="lg"
              >
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                {actionLabel}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Empty;