import React, { useState } from 'react';
import { ToggleableSidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Clock, Stethoscope, Heart } from 'lucide-react';

export function StaffPage({ onNavigate, onLogout }) {
  const [staff, setStaff] = useState([
    { id: 1, name: 'Dr. Sharma', role: 'Doctor', status: 'Present', shift: 'Morning', department: 'Cardiology', clockIn: '08:00 AM' },
    { id: 2, name: 'Nurse Priya', role: 'Nurse', status: 'Absent', shift: 'Morning', department: 'ICU' },
    { id: 3, name: 'Dr. Patel', role: 'Doctor', status: 'Present', shift: 'Evening', department: 'Emergency', clockIn: '02:00 PM' },
    { id: 4, name: 'Nurse Rajesh', role: 'Nurse', status: 'Present', shift: 'Night', department: 'General Ward', clockIn: '10:00 PM' },
    { id: 5, name: 'Tech. Amit', role: 'Technician', status: 'On Leave', shift: 'Morning', department: 'Laboratory' },
    { id: 6, name: 'Dr. Singh', role: 'Doctor', status: 'Present', shift: 'Morning', department: 'Pediatrics', clockIn: '07:30 AM' }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', shift: '', department: '' });

  const handleAddStaff = () => {
    if (!formData.name || !formData.role || !formData.shift || !formData.department) return;

    const newStaff = {
      id: Date.now(),
      name: formData.name,
      role: formData.role,
      status: 'Present',
      shift: formData.shift,
      department: formData.department,
      clockIn: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
    setStaff([...staff, newStaff]);
    setFormData({ name: '', role: '', shift: '', department: '' });
    setIsAddDialogOpen(false);
  };

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

  const presentCount = staff.filter(s => s.status === 'Present').length;
  const totalCount = staff.length;
  const doctorsPresent = staff.filter(s => s.role === 'Doctor' && s.status === 'Present').length;
  const nursesPresent = staff.filter(s => s.role === 'Nurse' && s.status === 'Present').length;
  const absentCount = staff.filter(s => s.status === 'Absent').length;
  const onLeaveCount = staff.filter(s => s.status === 'On Leave').length;

  return (
    <ToggleableSidebar currentPage="staff" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6 space-y-6" style={{ color: 'var(--foreground)' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Staff Management</h1>
            <p style={{ color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: '500' }}>{presentCount}</span> of {totalCount} staff members present today
            </p>
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

                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleAddStaff} style={{ flex: 1, backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }} disabled={!formData.name || !formData.role || !formData.shift || !formData.department}>
                    Add Staff Member
                  </Button>
                  <Button variant="outline" style={{ flex: 1, borderColor: 'var(--border)', color: 'var(--foreground)' }} onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                  {['Name','Role','Department','Shift','Status','Clock In'].map((th) => (
                    <th key={th} className="text-left py-3 px-4" style={{ color: 'var(--foreground)', fontWeight: '500' }}>{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3 px-4" style={{ color: 'var(--foreground)', fontWeight: 500 }}>{member.name}</td>
                    <td className="py-3 px-4">
                      <Badge style={getRoleStyle(member.role)}>{member.role}</Badge>
                    </td>
                    <td className="py-3 px-4" style={{ color: 'var(--muted-foreground)' }}>{member.department}</td>
                    <td className="py-3 px-4" style={{ color: 'var(--muted-foreground)' }}>{member.shift}</td>
                    <td className="py-3 px-4">
                      <Badge style={getStatusStyle(member.status)}>{member.status}</Badge>
                    </td>
                    <td className="py-3 px-4" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>{member.clockIn || '-'}</td>
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
