import { cn } from "@/utils/cn";

const AttendanceIndicator = ({ status, size = "md" }) => {
  const getStatusColor = () => {
    switch (status) {
      case "Present":
        return "bg-green-500";
      case "Late":
        return "bg-yellow-500";
      case "Absent":
        return "bg-red-500";
      default:
        return "bg-slate-300";
    }
  };

  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={cn("rounded-full", getStatusColor(), sizes[size])} />
      <span className="text-sm text-slate-600">{status}</span>
    </div>
  );
};

export default AttendanceIndicator;