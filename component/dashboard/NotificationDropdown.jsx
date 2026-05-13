'use client';

import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  Button,
  Badge
} from '../ui/CustomUI';
import { Bell, MessageSquare, FileText, Calendar, CheckCircle, Info } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, connected } = useNotifications();
  const router = useRouter();

  const getIcon = (type) => {
    switch (type) {
      case 'CHAT': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'HOMEWORK': return <FileText className="h-4 w-4 text-orange-500" />;
      case 'LEAVE': return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'NOTICE': return <Bell className="h-4 w-4 text-primary" />;
      case 'ATTENDANCE': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      default: return <Info className="h-4 w-4 text-slate-400" />;
    }
  };

  const handleNotificationClick = (n) => {
    markAsRead(n.id);
    
    // Route based on type
    if (n.type === 'CHAT' || n.type === 'MESSAGE') {
      const roomId = n.data?.roomId || n.metadata?.roomId;
      if (roomId) {
        router.push(`/dashboard/chat?roomId=${roomId}`);
      } else {
        router.push('/dashboard/chat');
      }
    } else if (n.type === 'HOMEWORK') {
      const homeworkId = n.data?.homeworkId || n.metadata?.homeworkId;
      if (homeworkId) {
        router.push(`/dashboard/homework/${homeworkId}`);
      } else {
        router.push('/dashboard/homework');
      }
    } else if (n.type === 'NOTICE') {
      router.push('/dashboard/notice');
    } else if (n.type === 'LEAVE') {
      router.push('/dashboard/leave');
    } else if (n.type === 'ATTENDANCE') {
      router.push('/dashboard/attendance');
    } else if (n.type === 'TIMETABLE') {
      router.push('/dashboard/timetable');
    }
  };

  const displayNotifications = notifications.slice(0, 10);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 relative shrink-0">
          <Bell className={`h-4 w-4 sm:h-5 sm:w-5 ${connected ? 'text-slate-600 dark:text-slate-400' : 'text-slate-300'}`} />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 sm:right-2.5 sm:top-2.5 flex h-2 w-2 rounded-full bg-primary ring-2 ring-white dark:ring-slate-950">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[calc(100vw-32px)] sm:w-72 p-0 overflow-hidden rounded-2xl border-slate-100 dark:border-slate-800 shadow-2xl right-0"
      >
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Notifications</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {unreadCount} unread messages
            </p>
          </div>
          {unreadCount > 0 && (
            <button 
                onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {displayNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-flex p-3 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-300 mb-3">
                <Bell size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No notifications yet</p>
            </div>
          ) : (
            displayNotifications.map((n) => (
              <DropdownMenuItem 
                key={n.id} 
                className={`p-4 cursor-pointer border-b border-slate-50 dark:border-slate-900 last:border-0 focus:bg-slate-50 dark:focus:bg-slate-900 transition-colors ${!n.isRead ? 'bg-primary/5 dark:bg-primary/5' : ''}`}
                onClick={() => handleNotificationClick(n)}
              >
                <div className="flex gap-3 w-full">
                  <div className={`mt-0.5 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm shrink-0 h-fit`}>
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className={`text-xs font-black truncate ${!n.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                        {n.title}
                      </p>
                      <span className="text-[9px] font-bold text-slate-400 shrink-0 uppercase tracking-tight">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {n.body}
                    </p>
                  </div>
                  {!n.isRead && (
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50 text-center border-t border-slate-100 dark:border-slate-800">
           <button 
             onClick={() => router.push('/dashboard/notifications')}
             className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
           >
             View all history
           </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
