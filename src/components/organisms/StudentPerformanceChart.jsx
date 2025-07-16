import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Chart from "react-apexcharts";

const StudentPerformanceChart = ({ data, monthlyAverages, studentName }) => {
  const [chartType, setChartType] = useState("individual"); // individual or monthly

  const getIndividualChartOptions = () => ({
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      responsive: [{
        breakpoint: 768,
        options: {
          chart: {
            height: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    colors: ['#2C5282'],
    xaxis: {
      categories: data.map(item => new Date(item.date).toLocaleDateString()),
      title: {
        text: 'Assignment Date'
      }
    },
    yaxis: {
      title: {
        text: 'Score (%)'
      },
      min: 0,
      max: 100
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const point = data[dataPointIndex];
        return `
          <div class="px-3 py-2">
            <div class="font-medium">${point.assignment}</div>
            <div class="text-sm text-slate-600">${point.category}</div>
            <div class="text-sm">Score: ${point.score.toFixed(1)}%</div>
            <div class="text-sm">Date: ${new Date(point.date).toLocaleDateString()}</div>
          </div>
        `;
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
    },
    markers: {
      size: 6,
      strokeWidth: 2,
      strokeColors: '#fff',
      hover: {
        size: 8
      }
    }
  });

  const getMonthlyChartOptions = () => ({
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      responsive: [{
        breakpoint: 768,
        options: {
          chart: {
            height: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    colors: ['#38B2AC'],
    xaxis: {
      categories: monthlyAverages.map(item => {
        const [year, month] = item.month.split('-');
        return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }),
      title: {
        text: 'Month'
      }
    },
    yaxis: {
      title: {
        text: 'Average Score (%)'
      },
      min: 0,
      max: 100
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const point = monthlyAverages[dataPointIndex];
        return `
          <div class="px-3 py-2">
            <div class="font-medium">Monthly Average</div>
            <div class="text-sm">Score: ${point.average}%</div>
            <div class="text-sm">Assignments: ${point.assignmentCount}</div>
          </div>
        `;
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
    },
    markers: {
      size: 6,
      strokeWidth: 2,
      strokeColors: '#fff',
      hover: {
        size: 8
      }
    }
  });

  const getChartSeries = () => {
    if (chartType === "individual") {
      return [{
        name: 'Score',
        data: data.map(item => item.score)
      }];
    } else {
      return [{
        name: 'Monthly Average',
        data: monthlyAverages.map(item => item.average)
      }];
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="TrendingUp" className="h-5 w-5 text-primary-600" />
            <span>Performance Trends - {studentName}</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={chartType === "individual" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("individual")}
            >
              <ApperIcon name="Activity" className="h-4 w-4 mr-2" />
              Individual
            </Button>
            <Button
              variant={chartType === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("monthly")}
              disabled={monthlyAverages.length === 0}
            >
              <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
              Monthly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <Chart
            options={chartType === "individual" ? getIndividualChartOptions() : getMonthlyChartOptions()}
            series={getChartSeries()}
            type="line"
            height={350}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentPerformanceChart;