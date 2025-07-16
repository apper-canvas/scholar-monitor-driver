import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend,
  trendValue,
  className,
  gradient = "primary"
}) => {
  const gradients = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-500 to-secondary-600",
    accent: "from-accent-500 to-accent-600",
    success: "from-green-500 to-green-600",
    warning: "from-yellow-500 to-yellow-600",
    error: "from-red-500 to-red-600"
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold gradient-text">{value}</h3>
              {trendValue && (
                <span className={cn(
                  "text-sm font-medium flex items-center",
                  trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-slate-600"
                )}>
                  {trend === "up" && <ApperIcon name="TrendingUp" className="h-3 w-3 mr-1" />}
                  {trend === "down" && <ApperIcon name="TrendingDown" className="h-3 w-3 mr-1" />}
                  {trendValue}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className={cn("p-3 rounded-full bg-gradient-to-r", gradients[gradient])}>
              <ApperIcon name={icon} className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;