import { Card, CardContent } from "@/components/atoms/Card";

const Loading = ({ type = "table" }) => {
  if (type === "table") {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-32 animate-pulse" />
              <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-24 animate-pulse" />
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded flex-1 animate-pulse" />
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-20 animate-pulse" />
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-16 animate-pulse" />
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-12 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-20 animate-pulse" />
                <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-16 animate-pulse" />
                <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-24 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
      </div>
    </div>
  );
};

export default Loading;