import React, { useState, useEffect } from 'react';
import { ToggleableSidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Clock, Stethoscope, Heart, Building2 } from 'lucide-react';
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

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

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
        const dateIso = new Date(selectedDate).toISOString();
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
        await attendanceApi.setStatus({ staffId: created._id, status: formData.attendanceStatus, time: timeIso, date: new Date(selectedDate).toISOString() });
        const [summaryRes, staffRes] = await Promise.all([
          attendanceApi.today(new Date(selectedDate).toISOString()),
          staffApi.list(new Date(selectedDate).toISOString()),
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

  // Invite Staff removed per requirements

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Present': return { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' };
      case 'Absent': return { backgroundColor: 'var(--destructive)', color: 'var(--destructive-foreground)', borderColor: 'var(--destructive)' };
      case 'On Leave': return { backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)', borderColor: 'var(--accent)' };
      default: return { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' };
    }
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case 'Doctor': return { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' };
      case 'Nurse': return { backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)', borderColor: 'var(--accent)' };
      case 'Technician': return { backgroundColor: 'var(--destructive)', color: 'var(--destructive-foreground)', borderColor: 'var(--destructive)' };
      case 'Administrator': return { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' };
      default: return { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' };
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
      <div className="p-6 space-y-6" style={{ color: 'var(--foreground)' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Staff Management</h1>
            <p style={{ color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: '500' }}>{presentCount}</span> of {totalCount} staff members present today
            </p>
            {(userHospital || userCity) && (
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Building2 className="w-4 h-4 mr-2" />
                {[userHospital, userCity].filter(Boolean).join(" • ")}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {/* Date selector for attendance logging */}
            <div className="flex items-center gap-2">
              <Label htmlFor="attendance-date" style={{ color: 'var(--foreground)' }}>Date</Label>
              <Input id="attendance-date" type="date" value={selectedDate} max={new Date().toISOString().slice(0,10)} min={new Date().toISOString().slice(0,10)} onChange={(e) => setSelectedDate(e.target.value)} style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }} />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                  <UserPlus className="w-4 h-4 mr-2" /> Add Staff Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {['name', 'department'].map((field) => (
                    <div key={field}>
                      <Label htmlFor={field} style={{ color: 'var(--foreground)' }}>
                        {field === 'name' ? 'Full Name' : 'Department'}
                      </Label>
                      <Input
                        id={field}
                        value={formData[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        placeholder={`Enter ${field}`}
                        style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                      />
                    </div>
                  ))}

                  <div>
                    <Label htmlFor="role" style={{ color: 'var(--foreground)' }}>Role</Label>
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

                  <div>
                    <Label htmlFor="shift" style={{ color: 'var(--foreground)' }}>Shift</Label>
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

                  <div>
                    <Label htmlFor="attendance" style={{ color: 'var(--foreground)' }}>Attendance</Label>
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
                    <div>
                      <Label htmlFor="attendanceTime" style={{ color: 'var(--foreground)' }}>Clock-in Time</Label>
                      <Input
                        id="attendanceTime"
                        type="time"
                        value={formData.attendanceTime}
                        onChange={(e) => setFormData({ ...formData, attendanceTime: e.target.value })}
                        style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                      />
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleAddStaff} style={{ flex: 1, backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }} disabled={!formData.name || !formData.role || !formData.shift || !formData.department || !formData.attendanceStatus}>
                      Add Staff Member
                    </Button>
                    <Button variant="outline" style={{ flex: 1, borderColor: 'var(--border)', color: 'var(--foreground)' }} onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Invite Staff removed */}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Total Staff', value: totalCount, bg: 'var(--primary)', fg: 'var(--primary-foreground)' },
            { icon: Clock, label: 'Present Today', value: presentCount, bg: 'var(--primary)', fg: 'var(--primary-foreground)' },
            { icon: Stethoscope, label: 'Doctors', value: doctorsPresent, bg: 'var(--primary)', fg: 'var(--primary-foreground)' },
            { icon: Heart, label: 'Nurses', value: nursesPresent, bg: 'var(--accent)', fg: 'var(--accent-foreground)' }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <Card key={idx} className="p-4" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
                <div className="flex items-center">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: card.bg }}>
                    <Icon className="w-6 h-6" style={{ color: card.fg }} />
                  </div>
                  <div className="ml-3">
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{card.label}</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--foreground)' }}>{card.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[{ label: 'Present', value: presentCount, color: 'var(--primary)' }, { label: 'Absent', value: absentCount, color: 'var(--destructive)' }, { label: 'On Leave', value: onLeaveCount, color: 'var(--accent)' }].map((stat, idx) => (
            <Card key={idx} className="p-4 text-center" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Staff Table */}
        <Card className="p-6" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Name', 'Role', 'Department', 'Shift', 'Status', 'Clock In'].map((th) => (
                    <th key={th} className="text-left py-3 px-4" style={{ color: 'var(--foreground)', fontWeight: '500' }}>{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member._id || member.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3 px-4" style={{ color: 'var(--foreground)', fontWeight: 500 }}>{member.name}</td>
                    <td className="py-3 px-4">
                      <Badge style={getRoleStyle(member.role)}>{member.role}</Badge>
                    </td>
                    <td className="py-3 px-4" style={{ color: 'var(--muted-foreground)' }}>{member.department}</td>
                    <td className="py-3 px-4" style={{ color: 'var(--muted-foreground)' }}>{member.shift}</td>
                    <td className="py-3 px-4">
                      <Badge style={getStatusStyle(member.status || 'Absent')}>{member.status || 'Absent'}</Badge>
                    </td>
                    <td className="py-3 px-4" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>{formatClockTime(member.clockIn)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {staff.length === 0 && (
            <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
              <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--muted)' }} />
              <p>No staff members found</p>
              <p style={{ fontSize: '0.875rem' }}>Click "Add Staff Member" to get started</p>
            </div>
          )}
        </Card>
      </div>
    </ToggleableSidebar>
  );
}
