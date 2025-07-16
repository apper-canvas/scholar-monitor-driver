import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import StudentPerformanceChart from "@/components/organisms/StudentPerformanceChart";
import { gradeService } from "@/services/api/gradeService";

const StudentOverview = ({ student, onBack }) => {
  const [performanceData, setPerformanceData] = useState([]);
  const [monthlyAverages, setMonthlyAverages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPerformanceData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const [trendData, monthlyData] = await Promise.all([
          gradeService.getPerformanceTrend(student.Id),
          gradeService.calculateMonthlyAverages(student.Id)
        ]);
        
        setPerformanceData(trendData);
        setMonthlyAverages(monthlyData);
      } catch (err) {
        console.error("Error loading performance data:", err);
        setError("Failed to load performance data");
      } finally {
        setLoading(false);
      }
    };

    loadPerformanceData();
  }, [student.Id]);

  const retryLoad = () => {
    const loadPerformanceData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const [trendData, monthlyData] = await Promise.all([
          gradeService.getPerformanceTrend(student.Id),
          gradeService.calculateMonthlyAverages(student.Id)
        ]);
        
        setPerformanceData(trendData);
        setMonthlyAverages(monthlyData);
      } catch (err) {
        console.error("Error loading performance data:", err);
        setError("Failed to load performance data");
      } finally {
        setLoading(false);
      }
    };

    loadPerformanceData();
  };

  if (loading) return <Loading type="page" />;
  if (error) return <Error message={error} onRetry={retryLoad} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="User" className="h-5 w-5 text-primary-600" />
                <span>{student.firstName} {student.lastName}</span>
                <Badge variant="outline">Grade {student.gradeLevel}</Badge>
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">{student.email}</p>
            </div>
            <Button onClick={onBack} variant="outline" size="sm">
              <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="TrendingUp" className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-sm font-medium text-slate-700">Total Assignments</p>
                <p className="text-2xl font-bold text-slate-900">{performanceData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Target" className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium text-slate-700">Average Score</p>
                <p className="text-2xl font-bold text-slate-900">
                  {performanceData.length > 0 
                    ? `${(performanceData.reduce((sum, item) => sum + item.score, 0) / performanceData.length).toFixed(1)}%`
                    : "N/A"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Calendar" className="h-5 w-5 text-accent-600" />
              <div>
                <p className="text-sm font-medium text-slate-700">Active Months</p>
                <p className="text-2xl font-bold text-slate-900">{monthlyAverages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      {performanceData.length > 0 ? (
        <StudentPerformanceChart 
          data={performanceData}
          monthlyAverages={monthlyAverages}
          studentName={`${student.firstName} ${student.lastName}`}
        />
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <ApperIcon name="BarChart3" className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">No Performance Data</h3>
            <p className="text-slate-500">
              No grades have been recorded for this student yet. 
              Performance charts will appear once assignments are graded.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentOverview;