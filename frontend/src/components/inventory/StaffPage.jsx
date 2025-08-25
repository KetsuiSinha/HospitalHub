import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Clock } from 'lucide-react';

export function StaffPage({ onNavigate, onLogout }) {
  const [staff, setStaff] = useState([
    {
      id: 1,
      name: 'Dr. Sharma',
      role: 'Doctor',
      status: 'Present',
      shift: 'Morning',
      department: 'Cardiology',
      clockIn: '08:00 AM'
    },
    {
      id: 2,
      name: 'Nurse Priya',
      role: 'Nurse',
      status: 'Absent',
      shift: 'Morning',
      department: 'ICU'
    },
    {
      id: 3,
      name: 'Dr. Patel',
      role: 'Doctor',
      status: 'Present',
      shift: 'Evening',
      department: 'Emergency',
      clockIn: '02:00 PM'
    },
    {
      id: 4,
      name: 'Nurse Rajesh',
      role: 'Nurse',
      status: 'Present',
      shift: 'Night',
      department: 'General Ward',
      clockIn: '10:00 PM'
    },
    {
      id: 5,
      name: 'Tech. Amit',
      role: 'Technician',
      status: 'On Leave',
      shift: 'Morning',
      department: 'Laboratory'
    },
    {
      id: 6,
      name: 'Dr. Singh',
      role: 'Doctor',
      status: 'Present',
      shift: 'Morning',
      department: 'Pediatrics',
      clockIn: '07:30 AM'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    shift: '',
    department: ''
  });

  const handleAddStaff = () => {
    const newStaff = {
      id: Date.now(),
      name: formData.name,
      role: formData.role,
      status: 'Present',
      shift: formData.shift,
      department: formData.department
    };
    setStaff([...staff, newStaff]);
    setFormData({ name: '', role: '', shift: '', department: '' });
    setIsAddDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800';
      case 'Absent':
        return 'bg-red-100 text-red-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Doctor':
        return 'bg-blue-100 text-blue-800';
      case 'Nurse':
        return 'bg-purple-100 text-purple-800';
      case 'Technician':
        return 'bg-orange-100 text-orange-800';
      case 'Administrator':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const presentCount = staff.filter(s => s.status === 'Present').length;
  const totalCount = staff.length;
  const doctorsPresent = staff.filter(s => s.role === 'Doctor' && s.status === 'Present').length;
  const nursesPresent = staff.filter(s => s.role === 'Nurse' && s.status === 'Present').length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage="staff" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-gray-600 mt-1">
              {presentCount} of {totalCount} staff members present today
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-700 hover:bg-blue-800">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Staff Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
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
                <div>
                  <Label htmlFor="shift">Shift</Label>
                  <Select value={formData.shift} onValueChange={(value) => setFormData({ ...formData, shift: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Morning</SelectItem>
                      <SelectItem value="Evening">Evening</SelectItem>
                      <SelectItem value="Night">Night</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Enter department"
                  />
                </div>
                <Button onClick={handleAddStaff} className="w-full bg-blue-700 hover:bg-blue-800">
                  Add Staff Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Present Today</p>
                <p className="text-2xl font-bold text-gray-900">{presentCount}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{doctorsPresent}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Nurses</p>
                <p className="text-2xl font-bold text-gray-900">{nursesPresent}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Staff Table */}
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Department</th>
                  <th className="text-left py-3 px-4">Shift</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Clock In</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">{member.name}</td>
                    <td className="py-3 px-4">
                      <Badge className={getRoleColor(member.role)}>
                        {member.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{member.department}</td>
                    <td className="py-3 px-4 text-gray-600">{member.shift}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {member.clockIn || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
