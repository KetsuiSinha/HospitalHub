import React, { useState, useEffect } from 'react';
import { ToggleableSidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Users, UserPlus, Clock, Stethoscope, Heart, Building2, Search, CalendarIcon } from 'lucide-react';
import { getAuthUser, staffApi, attendanceApi } from '@/lib/api';

export function StaffPage({ onNavigate, onLogout }) {
  const [staff, setStaff] = useState([]);
  const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0, onLeave: 0, doctorsPresent: 0, nursesPresent: 0 });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', shift: '', department: '', attendanceStatus: '', attendanceTime: '' });
  const [userHospital, setUserHospital] = useState("");
  const [userCity, setUserCity] = useState("");
  const [userRole, setUserRole] = useState("");
  const [error, setError] = useState("");

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

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      setUserHospital(user.hospital);
      setUserRole(user.role);
      setUserCity(user.city || "");
    }
    // Load staff and attendance
    const load = async () => {
      try {
        const dateIso = selectedDate.toISOString();
        const [staffRes, summaryRes] = await Promise.all([
          staffApi.list(dateIso),
          attendanceApi.today(dateIso),
        ]);
        setStaff(staffRes || []);
        if (summaryRes) setSummary(summaryRes);
      } catch (e) {
        // silently ignore for now; UI shows zeros
      }
    };
    load();
  }, [selectedDate]);

  const handleAddStaff = async () => {
    if (!formData.name || !formData.role || !formData.shift || !formData.department) return;
    try {
      const created = await staffApi.create({
        name: formData.name,
        email: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}@placeholder.local`,
        role: formData.role,
        department: formData.department,
        shift: formData.shift,
      });
      setStaff([created, ...staff]);

      // Set today's attendance status based on selection
      try {
        let timeIso = undefined;
        if (formData.attendanceStatus === 'Present' && formData.attendanceTime) {
          const now = new Date();
          const [hh, mm] = formData.attendanceTime.split(':');
          const at = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(hh), Number(mm), 0, 0);
          timeIso = at.toISOString();
        }
        await attendanceApi.setStatus({ staffId: created._id, status: formData.attendanceStatus, time: timeIso, date: selectedDate.toISOString() });
        const [summaryRes, staffRes] = await Promise.all([
          attendanceApi.today(selectedDate.toISOString()),
          staffApi.list(selectedDate.toISOString()),
        ]);
        if (staffRes) setStaff(staffRes);
        if (summaryRes) setSummary(summaryRes);
      } catch (e) {
        // ignore secondary failure
      }
      setFormData({ name: '', role: '', shift: '', department: '', attendanceStatus: '', attendanceTime: '' });
      setIsAddDialogOpen(false);
    } catch (e) {
      setError(e.message || 'Failed to add staff');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Present': return 'default'; // Primary color
      case 'Absent': return 'destructive';
      case 'On Leave': return 'secondary'; // Or a custom 'warning' variant if available
      default: return 'outline';
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'Doctor': return 'default';
      case 'Nurse': return 'secondary';
      case 'Technician': return 'outline';
      case 'Administrator': return 'outline';
      default: return 'outline';
    }
  };

  const totalCount = summary.total || staff.length;
  const presentCount = summary.present;
  const doctorsPresent = summary.doctorsPresent;
  const nursesPresent = summary.nursesPresent;
  const absentCount = summary.absent;
  const onLeaveCount = summary.onLeave;

  return (
    <ToggleableSidebar currentPage="staff" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Staff Management</h1>
            <p className="text-muted-foreground mt-1">
              <span className="text-primary font-medium">{presentCount}</span> of {totalCount} staff members present today
            </p>
            {(userHospital || userCity) && (
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Building2 className="w-4 h-4 mr-2" />
                {[userHospital, userCity].filter(Boolean).join(" • ")}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Date selector for attendance logging */}
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

            {isToday && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="shadow-sm">
                    <UserPlus className="w-4 h-4 mr-2" /> Add Staff Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="Enter department"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Doctor">Doctor</SelectItem>
                            <SelectItem value="Nurse">Nurse</SelectItem>
                            <SelectItem value="Technician">Technician</SelectItem>
                            <SelectItem value="Administrator">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shift">Shift</Label>
                        <Select value={formData.shift} onValueChange={(value) => setFormData({ ...formData, shift: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select shift" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Morning">Morning (7AM - 3PM)</SelectItem>
                            <SelectItem value="Evening">Evening (3PM - 11PM)</SelectItem>
                            <SelectItem value="Night">Night (11PM - 7AM)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="attendance">Attendance Status</Label>
                      <Select value={formData.attendanceStatus} onValueChange={(value) => setFormData({ ...formData, attendanceStatus: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Present or Absent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Present">Present</SelectItem>
                          <SelectItem value="Absent">Absent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.attendanceStatus === 'Present' && (
                      <div className="space-y-2">
                        <Label htmlFor="attendanceTime">Clock-in Time</Label>
                        <Input
                          id="attendanceTime"
                          type="time"
                          value={formData.attendanceTime}
                          onChange={(e) => setFormData({ ...formData, attendanceTime: e.target.value })}
                        />
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <Button
                        className="flex-1"
                        onClick={handleAddStaff}
                        disabled={!formData.name || !formData.role || !formData.shift || !formData.department || !formData.attendanceStatus}
                      >
                        Add Staff Member
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setIsAddDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Total Staff', value: totalCount, variant: 'default' },
            { icon: Clock, label: 'Present Today', value: presentCount, variant: 'default' },
            { icon: Stethoscope, label: 'Doctors', value: doctorsPresent, variant: 'secondary' },
            { icon: Heart, label: 'Nurses', value: nursesPresent, variant: 'secondary' }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <Card key={idx} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center">
                  <div className={`p-3 rounded-xl mr-4 ${card.variant === 'default' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'
                    }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                    <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Present', value: presentCount, color: 'text-primary' },
            { label: 'Absent', value: absentCount, color: 'text-destructive' },
            { label: 'On Leave', value: onLeaveCount, color: 'text-orange-500' }
          ].map((stat, idx) => (
            <Card key={idx} className="shadow-sm">
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Staff Table */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6">Clock In</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                        <Users className="w-8 h-8 opacity-50" />
                        <p>No staff members found</p>
                        {isToday && <p className="text-xs">Click "Add Staff Member" to get started</p>}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  staff
                    .map((member) => (
                      <TableRow key={member._id || member.id}>
                        <TableCell className="font-medium pl-6">{member.name}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(member.role)} className="font-normal">
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{member.department}</TableCell>
                        <TableCell className="text-muted-foreground">{member.shift}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(member.status || 'Absent')}>
                            {member.status || 'Absent'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-xs pr-6">
                          {formatClockTime(member.clockIn)}
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ToggleableSidebar>
  );
}
