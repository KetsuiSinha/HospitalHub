import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserPlus, Building2, Pencil, Trash2 } from 'lucide-react';
import { getAuthUser, staffApi } from '@/lib/api';

export function StaffManagementPage() {
    const [staff, setStaff] = useState([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', role: '', shift: '', department: '' });
    const [userHospital, setUserHospital] = useState("");
    const [userCity, setUserCity] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const user = getAuthUser();
        if (user) {
            setUserHospital(user.hospital);
            setUserCity(user.city || "");
        }
        loadStaff();
    }, []);

    const loadStaff = async () => {
        try {
            const staffRes = await staffApi.list();
            setStaff(staffRes || []);
        } catch (e) {
            console.error("Failed to load staff", e);
        }
    };

    const handleAddStaff = async () => {
        if (!formData.name || !formData.role || !formData.shift || !formData.department) return;
        try {
            if (editingId) {
                await staffApi.update(editingId, {
                    name: formData.name,
                    role: formData.role,
                    department: formData.department,
                    shift: formData.shift,
                });
            } else {
                await staffApi.create({
                    name: formData.name,
                    email: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}@placeholder.local`,
                    role: formData.role,
                    department: formData.department,
                    shift: formData.shift,
                });
            }
            await loadStaff();
            setFormData({ name: '', role: '', shift: '', department: '' });
            setEditingId(null);
            setIsAddDialogOpen(false);
        } catch (e) {
            setError(e.message || 'Failed to save staff');
        }
    };

    const handleEdit = (member) => {
        setFormData({
            name: member.name,
            role: member.role,
            department: member.department,
            shift: member.shift,
        });
        setEditingId(member._id || member.id);
        setIsAddDialogOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this staff member?")) return;
        try {
            await staffApi.remove(id);
            await loadStaff();
        } catch (e) {
            console.error("Failed to delete staff", e);
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Staff Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage hospital staff members and their roles.
                    </p>
                    {(userHospital || userCity) && (
                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                            <Building2 className="w-4 h-4 mr-2" />
                            {[userHospital, userCity].filter(Boolean).join(" • ")}
                        </div>
                    )}
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                    setIsAddDialogOpen(open);
                    if (!open) {
                        setEditingId(null);
                        setFormData({ name: '', role: '', shift: '', department: '' });
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button className="shadow-sm">
                            <UserPlus className="w-4 h-4 mr-2" /> Add Staff Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
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

                            {error && <p className="text-sm text-destructive">{error}</p>}

                            <div className="flex space-x-2 pt-2">
                                <Button
                                    className="flex-1"
                                    onClick={handleAddStaff}
                                    disabled={!formData.name || !formData.role || !formData.shift || !formData.department}
                                >
                                    {editingId ? 'Update Staff Member' : 'Add Staff Member'}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setIsAddDialogOpen(false);
                                        setEditingId(null);
                                        setFormData({ name: '', role: '', shift: '', department: '' });
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-6">Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Shift</TableHead>
                                <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staff.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                                            <Users className="w-8 h-8 opacity-50" />
                                            <p>No staff members found</p>
                                            <p className="text-xs">Click "Add Staff Member" to get started</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                staff.map((member) => (
                                    <TableRow key={member._id || member.id}>
                                        <TableCell className="font-medium pl-6">{member.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={getRoleBadgeVariant(member.role)} className="font-normal">
                                                {member.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{member.department}</TableCell>
                                        <TableCell className="text-muted-foreground">{member.shift}</TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(member)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(member._id || member.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
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
