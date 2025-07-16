import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuClick, title }) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" className="h-5 w-5" />
            </Button>
            
            <div className="lg:hidden flex items-center space-x-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500">
                <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">Scholar Hub</span>
            </div>
            
            {title && (
              <h1 className="hidden sm:block text-2xl font-bold text-slate-900">
                {title}
              </h1>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-600">
              <ApperIcon name="Calendar" className="h-4 w-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500">
              <ApperIcon name="User" className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;