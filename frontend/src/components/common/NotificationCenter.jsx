

import React, { useMemo, useCallback, useState } from 'react';
import { 
  Bell, Check, X, Clock, User, 
  Briefcase, Mail, AlertCircle 
} from 'lucide-react';
import { 
  useNotifications, 
  useMarkAsRead, 
  useMarkAllAsRead 
} from '../../hooks/useNotification';
import { useNavigate } from 'react-router-dom';

const getNotificationType = (title) => {
  if (!title) return 'system';
  
  const lcTitle = title.toLowerCase();
  if (lcTitle.includes('application received')) return 'application';
  if (lcTitle.includes('application submitted')) return 'status';
  if (lcTitle.includes('referral')) return 'referral';
  if (lcTitle.includes('message')) return 'message';
  if (lcTitle.includes('reminder')) return 'reminder';
  
  return 'system';
};

const NotificationCenter = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  
  // React Query hooks
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  // Transform notifications
  const transformedNotifications = useMemo(() => {
    return notifications.map(notif => ({
      ...notif,
      id: notif._id,
      type: getNotificationType(notif.title),
      timestamp: notif.createdAt ? new Date(notif.createdAt) : new Date(),
      read: notif.isRead,
    }));
  }, [notifications]);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return transformedNotifications.filter(notif => !notif.read).length;
  }, [transformedNotifications]);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return transformedNotifications.filter(notif => {
      if (filter === 'all') return true;
      if (filter === 'unread') return !notif.read;
      return notif.type === filter;
    });
  }, [transformedNotifications, filter]);

  // Date grouping logic
  const groupNotificationsByDate = useCallback(() => {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    
    const thisWeekStart = new Date(todayStart);
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);
    
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      earlier: []
    };
    
    filteredNotifications.forEach(notif => {
      const notifDate = new Date(notif.timestamp);
      
      if (notifDate >= todayStart) {
        groups.today.push(notif);
      } else if (notifDate >= yesterdayStart) {
        groups.yesterday.push(notif);
      } else if (notifDate >= thisWeekStart) {
        groups.thisWeek.push(notif);
      } else {
        groups.earlier.push(notif);
      }
    });
    
    return groups;
  }, [filteredNotifications]);
  
  const notificationGroups = useMemo(groupNotificationsByDate, [filteredNotifications]);

  // Handle notification click
  const handleNotificationClick = useCallback((notif) => {
    if (!notif.read) markAsRead.mutate(notif.id);
    if (notif.link) navigate(notif.link);
  }, [markAsRead, navigate]);

  // Mark all as read
  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead.mutate();
  }, [markAllAsRead]);

  // Get icon based on notification type
  const getNotificationIcon = useCallback((type) => {
    switch(type) {
      case 'application': return <User className="text-blue-500 dark:text-blue-400" size={18} />;
      case 'status': return <Briefcase className="text-green-500 dark:text-green-400" size={18} />;
      case 'referral': return <Check className="text-purple-500 dark:text-purple-400" size={18} />;
      case 'message': return <Mail className="text-yellow-500 dark:text-yellow-400" size={18} />;
      case 'reminder': return <Clock className="text-orange-500 dark:text-orange-400" size={18} />;
      default: return <AlertCircle className="text-indigo-500 dark:text-indigo-400" size={18} />;
    }
  }, []);

  // Format relative time
  const formatTime = useCallback((date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden dark:shadow-gray-900/50">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] px-6 py-8 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Bell className="w-6 h-6 mr-3" />
              <h1 className="text-xl font-bold mr-2">Notifications</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-300 rounded-full px-2 py-1 font-medium text-sm">
                {unreadCount} unread
              </span>
              <button 
                onClick={handleMarkAllAsRead}
                className="bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                Mark all as read
              </button>
            </div>
          </div>
          
          <p className="mt-4 text-blue-100 max-w-lg text-sm">
            Stay updated on your job applications, referrals, and important system updates
          </p>
        </div>
        
        {/* Filter Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 flex flex-wrap">
          <button 
            className={`px-4 py-3 font-medium text-sm border-b-2 ${filter === 'all' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-4 py-3 font-medium text-sm border-b-2 ${filter === 'unread' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setFilter('unread')}
          >
            Unread
          </button>
          <button 
            className={`px-4 py-3 font-medium text-sm border-b-2 ${filter === 'application' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setFilter('application')}
          >
            Applications
          </button>
          <button 
            className={`px-4 py-3 font-medium text-sm border-b-2 ${filter === 'status' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setFilter('status')}
          >
            Status Updates
          </button>
        </div>
        
        {/* Notification List */}
        <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[60vh] overflow-y-auto">
          {/* Today */}
          {notificationGroups.today.length > 0 && (
            <div className="py-4">
              <div className="px-6 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Today
              </div>
              {notificationGroups.today.map(notif => (
                <NotificationItem 
                  key={notif.id} 
                  notif={notif} 
                  markAsRead={handleNotificationClick}
                  getNotificationIcon={getNotificationIcon}
                  formatTime={formatTime}
                />
              ))}
            </div>
          )}
          
          {/* Yesterday */}
          {notificationGroups.yesterday.length > 0 && (
            <div className="py-4">
              <div className="px-6 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Yesterday
              </div>
              {notificationGroups.yesterday.map(notif => (
                <NotificationItem 
                  key={notif.id} 
                  notif={notif} 
                  markAsRead={handleNotificationClick}
                  getNotificationIcon={getNotificationIcon}
                  formatTime={formatTime}
                />
              ))}
            </div>
          )}
          
          {/* This Week */}
          {notificationGroups.thisWeek.length > 0 && (
            <div className="py-4">
              <div className="px-6 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                This Week
              </div>
              {notificationGroups.thisWeek.map(notif => (
                <NotificationItem 
                  key={notif.id} 
                  notif={notif} 
                  markAsRead={handleNotificationClick}
                  getNotificationIcon={getNotificationIcon}
                  formatTime={formatTime}
                />
              ))}
            </div>
          )}
          
          {/* Earlier */}
          {notificationGroups.earlier.length > 0 && (
            <div className="py-4">
              <div className="px-6 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Earlier
              </div>
              {notificationGroups.earlier.map(notif => (
                <NotificationItem 
                  key={notif.id} 
                  notif={notif} 
                  markAsRead={handleNotificationClick}
                  getNotificationIcon={getNotificationIcon}
                  formatTime={formatTime}
                />
              ))}
            </div>
          )}
          
          {/* Empty State */}
          {filteredNotifications.length === 0 && !isLoading && (
            <div className="py-16 text-center">
              <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No notifications found
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : "No notifications match your current filter."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NotificationItem = React.memo(({ notif, markAsRead, getNotificationIcon, formatTime }) => {
  return (
    <div 
      className={`px-6 py-4 flex hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
      onClick={() => markAsRead(notif)}
    >
      <div className="flex-shrink-0 mr-4 mt-1">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
          {getNotificationIcon(notif.type)}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <h3 className={`text-sm font-medium ${!notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
            {notif.title}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
            {formatTime(notif.timestamp)}
          </span>
        </div>
        
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {notif.message}
        </p>
        
        {notif.link && (
          <div className="mt-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(notif);
              }}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              View Details
            </button>
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center">
        {!notif.read && (
          <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mb-2"></div>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            markAsRead(notif);
          }}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
});

export default NotificationCenter;