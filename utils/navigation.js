import {
    LayoutDashboard,
    Bell,
    Megaphone,
    MessageSquare,
    Calendar,
    Clock,
    ClipboardCheck,
    DollarSign,
    LifeBuoy
} from 'lucide-react';

export const NAV_ITEMS = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        roles: ['STUDENT', 'STAFF', 'PARENT']
    },
    {
        id: 'attendance',
        label: 'Attendance',
        icon: ClipboardCheck,
        href: '/dashboard/attendance',
        roles: ['STUDENT', 'STAFF', 'PARENT']
    },
    {
        id: 'notice',
        label: 'Notices',
        icon: Megaphone,
        href: '/dashboard/notice',
        roles: ['STUDENT', 'STAFF', 'PARENT']
    },
    {
        id: 'chat',
        label: 'Messages',
        icon: MessageSquare,
        href: '/dashboard/chat',
        roles: ['STUDENT', 'STAFF', 'PARENT']
    },
    // {
    //     id: 'event',
    //     label: 'Events',
    //     icon: Calendar,
    //     href: '/dashboard/event',
    //     roles: ['STUDENT', 'STAFF', 'PARENT']
    // },
    {
        id: 'leave',
        label: 'My Leaves',
        icon: Calendar,
        href: '/dashboard/leave',
        roles: ['STUDENT', 'STAFF', 'PARENT']
    },
    {
        id: 'student-leave',
        label: 'Student Leaves',
        icon: Calendar,
        href: '/dashboard/leave/studentLeave',
        roles: ['STAFF']
    },
    {
        id: 'fees',
        label: 'Fees',
        icon: DollarSign,
        href: '/dashboard/fees',
        roles: ['STAFF']
    },
    {
        id: 'timetable',
        label: 'Timetable',
        icon: Clock,
        href: '/dashboard/timetable',
        roles: ['STUDENT', 'STAFF', 'PARENT']
    },
    {
        id: 'support',
        label: 'Help & Support',
        icon: LifeBuoy,
        href: '/dashboard/support',
        roles: ['STUDENT', 'STAFF', 'PARENT']
    },
];

