import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Users, Clock, CalendarIcon, CheckCircle, Pencil, Trash2 } from 'lucide-react';
import { getAuthUser, staffApi, attendanceApi } from '@/lib/api';

export function AttendancePage() {
    const [staffList, setStaffList] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0 });

    const [isMarkDialogOpen, setIsMarkDialogOpen] = useState(false);
    const [markData, setMarkData] = useState({ staffId: '', status: 'Present', shift: '', time: '' });

    const [selectedDate, setSelectedDate] = useState(() => new Date());
    const [userHospital, setUserHospital] = useState("");
    const [userCity, setUserCity] = useState("");

    useEffect(() => {
        const user = getAuthUser();
        if (user) {
            setUserHospital(user.hospital);
            setUserCity(user.city || "");
        }
        loadStaffList();
    }, []);

    useEffect(() => {
        loadAttendance();
    }, [selectedDate]);

    const loadStaffList = async () => {
        try {
            const res = await staffApi.list();
            setStaffList(res || []);
        } catch (e) {
            console.error("Failed to load staff list", e);
        }
    };

    const loadAttendance = async () => {
        try {
            const dateIso = selectedDate.toISOString();
            const [staffRes, summaryRes] = await Promise.all([
                staffApi.list(dateIso),
                attendanceApi.today(dateIso),
            ]);
            setAttendanceData(staffRes || []);
            if (summaryRes) setSummary(summaryRes);
        } catch (e) {
            console.error("Failed to load attendance", e);
        }
    };

    const handleMarkAttendance = async () => {
        if (!markData.staffId || !markData.status) return;
        try {
            let timeIso = undefined;
            if (markData.status === 'Present' && markData.time) {
                const [hh, mm] = markData.time.split(':');
                const dateBase = new Date(selectedDate);
                const at = new Date(dateBase.getFullYear(), dateBase.getMonth(), dateBase.getDate(), Number(hh), Number(mm), 0, 0);
                timeIso = at.toISOString();
            }

            await attendanceApi.setStatus({
                staffId: markData.staffId,
                status: markData.status,
                time: timeIso,
                date: selectedDate.toISOString()
            });

            await loadAttendance();
            setMarkData({ staffId: '', status: 'Present', shift: '', time: '' });
            setIsMarkDialogOpen(false);
        } catch (e) {
            console.error("Failed to mark attendance", e);
        }
    };

    const handleEdit = (record) => {
        let timeStr = '';
        if (record.clockIn) {
            const d = new Date(record.clockIn);
            const hh = d.getHours().toString().padStart(2, '0');
            const mm = d.getMinutes().toString().padStart(2, '0');
            timeStr = `${hh}:${mm}`;
        }

        setMarkData({
            staffId: record._id || record.id,
            status: record.status || 'Present',
            shift: record.shift || '',
            time: timeStr
        });
        setIsMarkDialogOpen(true);
    };

    const handleDeleteRecord = async (record) => {
        if (!confirm("Are you sure you want to delete this attendance record?")) return;
        try {
            if (record.attendanceId) {
                await attendanceApi.remove(record.attendanceId);
                await loadAttendance();
            } else {
                alert("Cannot delete: Attendance ID not found.");
            }
        } catch (e) {
            console.error("Failed to delete", e);
        }
    };

    const formatClockTime = (value) => {
        if (!value) return "-";
        try {
            const d = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
            if (isNaN(d.getTime())) return "-";
            return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } catch {
            return "-";
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'Present': return 'default';
            case 'Absent': return 'destructive';
            case 'On Leave': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Staff Attendance</h1>
                    <p className="text-muted-foreground mt-1">
                        Track daily attendance and clock-in times.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !selectedDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => date && setSelectedDate(date)}
                                    disabled={(date) => date > new Date()}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Dialog open={isMarkDialogOpen} onOpenChange={setIsMarkDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="shadow-sm">
                                <CheckCircle className="w-4 h-4 mr-2" /> Mark Attendance
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Mark Attendance for {format(selectedDate, "PPP")}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="staff">Staff Member</Label>
                                    <Select value={markData.staffId} onValueChange={(value) => setMarkData({ ...markData, staffId: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select staff member" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {staffList.map((s) => (
                                                <SelectItem key={s._id || s.id} value={s._id || s.id}>{s.name} ({s.role})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={markData.status} onValueChange={(value) => setMarkData({ ...markData, status: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Present">Present</SelectItem>
                                            <SelectItem value="Absent">Absent</SelectItem>
                                            <SelectItem value="On Leave">On Leave</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {markData.status === 'Present' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="time">Clock-in Time</Label>
                                        <Input
                                            id="time"
                                            type="time"
                                            value={markData.time}
                                            onChange={(e) => setMarkData({ ...markData, time: e.target.value })}
                                        />
                                    </div>
                                )}

                                <div className="flex space-x-2 pt-2">
                                    <Button
                                        className="flex-1"
                                        onClick={handleMarkAttendance}
                                        disabled={!markData.staffId || !markData.status}
                                    >
                                        Save Attendance
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setIsMarkDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Present', value: summary.present || 0, color: 'text-primary' },
                    { label: 'Absent', value: summary.absent || 0, color: 'text-destructive' },
                    { label: 'Total', value: summary.total || 0, color: 'text-foreground' }
                ].map((stat, idx) => (
                    <Card key={idx} className="shadow-sm">
                        <CardContent className="p-4 text-center">
                            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                            <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-6">Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Clock In</TableHead>
                                <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attendanceData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                                            <Users className="w-8 h-8 opacity-50" />
                                            <p>No attendance records for this date</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                attendanceData.map((member) => (
                                    <TableRow key={member._id || member.id}>
                                        <TableCell className="font-medium pl-6">{member.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{member.role}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(member.status || 'Absent')}>
                                                {member.status || 'Absent'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground font-mono text-xs">
                                            {formatClockTime(member.clockIn)}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(member)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                {member.attendanceId && (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteRecord(member)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
