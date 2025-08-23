
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

const NotificationBell = ({ notifications = [] }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  return (
    <div className="relative">
      <button
        onClick={() => navigate("/notifications")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          p-2 rounded-full transition-all duration-300
          ${isHovered ? 'bg-blue-100 shadow-sm' : 'bg-transparent'}
          relative focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer
        `}
        aria-label="Notifications"
      >
        <Bell className={`h-6 w-6 ${isHovered ? 'text-blue-600' : 'text-gray-600'}`} />
        
        {unreadCount > 0 && (
          <span className={`
            absolute -top-1 -right-1 flex items-center justify-center rounded-full
            min-w-[20px] h-5 px-1 text-xs font-medium transition-all
            ${unreadCount > 9 ? 'px-1' : 'px-1.5'}
            ${isHovered ? 'bg-red-500 text-white scale-110' : 'bg-red-500 text-white'}
            animate-pulse-once
          `}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};


export default NotificationBell;
