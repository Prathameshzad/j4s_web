'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow, 
    Badge, 
    Button,
    Breadcrumb, 
    BreadcrumbItem, 
    BreadcrumbLink, 
    BreadcrumbList, 
    BreadcrumbPage, 
    BreadcrumbSeparator,
    Input
} from '@/component/ui/CustomUI';
import { Users, Calendar, Eye, Search } from 'lucide-react';

export default function StudentLeavesPage() {
    const { token, selectedRole, selectedUserId, user } = useAuth();
    const router = useRouter();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Only staff can access this page
        if (selectedRole !== 'STAFF') {
            router.push('/dashboard');
            return;
        }

        const fetchStudentLeaves = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const response = await fetch(`${baseUrl}/leave`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'x-selected-role': selectedRole,
                        'x-selected-user-id': selectedUserId || ''
                    }
                });
                const result = await response.json();
                
                if (result.success) {
                    setLeaves(result.data);
                }
            } catch (error) {
                console.error('Error fetching student leaves:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchStudentLeaves();
        }
    }, [token, selectedRole, selectedUserId, router]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED':
                return <Badge className="bg-green-500 hover:bg-green-600 uppercase text-[10px]">Approved</Badge>;
            case 'REJECTED':
                return <Badge variant="destructive" className="uppercase text-[10px]">Rejected</Badge>;
            default:
                return <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-yellow-50 uppercase text-[10px]">Pending</Badge>;
        }
    };

    const filteredLeaves = leaves.filter(leave => 
        leave.student?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Student Leave Requests</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search student or parent..."
                        className="pl-8 bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="shadow-md border-none overflow-hidden">
                <CardHeader className="bg-primary text-primary-foreground p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Leaves Received from Students & Parents
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-100/80">
                                <TableRow>
                                    <TableHead className="font-bold py-4">Student Name</TableHead>
                                    <TableHead className="font-bold">Sender Role</TableHead>
                                    <TableHead className="font-bold">Duration</TableHead>
                                    <TableHead className="font-bold">Status</TableHead>
                                    <TableHead className="font-bold text-right pr-6">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-white">
                                {filteredLeaves.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                                            No student leave requests found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLeaves.map((leave) => (
                                        <TableRow key={leave.id} className="hover:bg-blue-50/30 transition-colors">
                                            <TableCell className="py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-800">{leave.student?.user?.name}</span>
                                                    <span className="text-[11px] text-muted-foreground">Class ID: {leave.classId}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-normal capitalize">
                                                    {leave.sender?.role?.toLowerCase() || 'Student'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(leave.status)}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="hover:bg-primary hover:text-white"
                                                    onClick={() => router.push(`/dashboard/leave/studentLeave/${leave.id}`)}
                                                >
                                                    <Eye className="h-4 w-4 mr-1" /> View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
