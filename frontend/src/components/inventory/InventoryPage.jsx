import React, { useEffect, useState } from 'react';
import { ToggleableSidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, Package } from 'lucide-react';
import { medicinesApi } from '@/lib/api';

export function InventoryPage({ onNavigate, onLogout }) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    dosageForm: 'Tablet',
    strength: '',
    expiryDate: '',
    stock: '',
    critical: false,
  });

  const fetchMedicines = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await medicinesApi.list();
      // Map backend fields to UI shape
      const mapped = data.map(m => ({
        id: m._id,
        name: m.name,
        stock: m.stock,
        expiry: m.expiryDate ? new Date(m.expiryDate).toLocaleDateString() : '-',
        expiryDate: m.expiryDate ? new Date(m.expiryDate).toISOString().slice(0, 10) : '',
        manufacturer: m.manufacturer || '-',
        dosageForm: m.dosageForm || 'Tablet',
        strength: m.strength || '',
        critical: !!m.critical,
      }));
      setMedicines(mapped);
    } catch (err) {
      setError(err.message || 'Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleAddMedicine = async () => {
    try {
      const payload = {
        name: formData.name,
        manufacturer: formData.manufacturer || undefined,
        dosageForm: formData.dosageForm,
        strength: formData.strength || undefined,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
        stock: parseInt(formData.stock || '0'),
        critical: !!formData.critical,
      };
      const created = await medicinesApi.create(payload);
      setMedicines(prev => ([
        ...prev,
        {
          id: created._id,
          name: created.name,
          stock: created.stock,
          expiry: created.expiryDate ? new Date(created.expiryDate).toLocaleDateString() : '-',
          expiryDate: created.expiryDate ? new Date(created.expiryDate).toISOString().slice(0, 10) : '',
          manufacturer: created.manufacturer || '-',
          dosageForm: created.dosageForm || 'Tablet',
          strength: created.strength || '',
          critical: !!created.critical,
        },
      ]));
      setFormData({ name: '', manufacturer: '', dosageForm: 'Tablet', strength: '', expiryDate: '', stock: '', critical: false });
      setIsAddDialogOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to add medicine');
    }
  };

  const handleEditMedicine = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name || '',
      manufacturer: medicine.manufacturer && medicine.manufacturer !== '-' ? medicine.manufacturer : '',
      dosageForm: medicine.dosageForm || 'Tablet',
      strength: medicine.strength || '',
      expiryDate: medicine.expiryDate || '',
      stock: medicine.stock != null ? String(medicine.stock) : '',
      critical: !!medicine.critical,
    });
  };

  const handleUpdateMedicine = async () => {
    if (!editingMedicine) return;
    try {
      const payload = {
        name: formData.name,
        manufacturer: formData.manufacturer || undefined,
        dosageForm: formData.dosageForm,
        strength: formData.strength || undefined,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
        stock: parseInt(formData.stock || '0'),
        critical: !!formData.critical,
      };
      await medicinesApi.update(editingMedicine.id, payload);
      setMedicines(medicines.map(med =>
        med.id === editingMedicine.id
          ? {
              ...med,
              name: formData.name,
              stock: parseInt(formData.stock),
              expiry: formData.expiryDate ? new Date(formData.expiryDate).toLocaleDateString() : '-',
              expiryDate: formData.expiryDate || '',
              manufacturer: formData.manufacturer || '-',
              dosageForm: formData.dosageForm,
              strength: formData.strength || '',
              critical: !!formData.critical,
            }
          : med
      ));
      setEditingMedicine(null);
      setFormData({ name: '', manufacturer: '', dosageForm: 'Tablet', strength: '', expiryDate: '', stock: '', critical: false });
    } catch (err) {
      setError(err.message || 'Failed to update medicine');
    }
  };

  const handleDeleteMedicine = async (id) => {
    try {
      await medicinesApi.remove(id);
      setMedicines(medicines.filter(med => med.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete medicine');
    }
  };

  const getStockColor = (stock) => {
    if (stock < 50) return { backgroundColor: 'var(--destructive)', color: 'var(--destructive-foreground)' };
    if (stock < 100) return { backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' };
    return { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' };
  };

  return (
    <ToggleableSidebar currentPage="inventory" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6 space-y-6" style={{ color: 'var(--foreground)' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Inventory</h1>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                <Plus className="w-4 h-4 mr-2" /> Add Medicine
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
              <DialogHeader>
                <DialogTitle>Add New Medicine</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" style={{ color: 'var(--foreground)' }}>Medicine Name</Label>
                  <Input id="name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter name" style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }} />
                </div>
                <div>
                  <Label htmlFor="manufacturer" style={{ color: 'var(--foreground)' }}>Manufacturer</Label>
                  <Input id="manufacturer" type="text" value={formData.manufacturer} onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })} placeholder="Enter manufacturer" style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }} />
                </div>
                <div>
                  <Label htmlFor="dosageForm" style={{ color: 'var(--foreground)' }}>Dosage Form</Label>
                  <select id="dosageForm" value={formData.dosageForm} onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })} className="mt-1 w-full p-2 rounded-md border" style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                    {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Other'].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="strength" style={{ color: 'var(--foreground)' }}>Strength</Label>
                  <Input id="strength" type="text" value={formData.strength} onChange={(e) => setFormData({ ...formData, strength: e.target.value })} placeholder="e.g., 500mg" style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }} />
                </div>
                <div>
                  <Label htmlFor="expiryDate" style={{ color: 'var(--foreground)' }}>Expiry Date</Label>
                  <Input id="expiryDate" type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }} />
                </div>
                <div>
                  <Label htmlFor="stock" style={{ color: 'var(--foreground)' }}>Stock Quantity</Label>
                  <Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="Enter stock" style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }} />
                </div>
                <div className="flex items-center space-x-2">
                  <input id="critical" type="checkbox" checked={formData.critical} onChange={(e) => setFormData({ ...formData, critical: e.target.checked })} />
                  <Label htmlFor="critical" style={{ color: 'var(--foreground)' }}>Critical</Label>
                </div>
                <Button onClick={handleAddMedicine} style={{ width: '100%', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                  Add Medicine
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {error && (
          <div className="text-sm" style={{ color: 'var(--destructive)' }}>{error}</div>
        )}
        <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', boxShadow: 'var(--shadow-md)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left py-3 px-4">Medicine</th>
                  <th className="text-left py-3 px-4">Stock</th>
                  <th className="text-left py-3 px-4">Expiry</th>
                  <th className="text-left py-3 px-4">Manufacturer</th>
                  <th className="text-left py-3 px-4">Form</th>
                  <th className="text-left py-3 px-4">Strength</th>
                  <th className="text-left py-3 px-4">Critical</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="py-6 px-4 text-center" colSpan={8} style={{ color: 'var(--muted-foreground)' }}>Loading...</td>
                  </tr>
                ) : medicines.map((medicine) => (
                  <tr key={medicine.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3 px-4" style={{ color: 'var(--foreground)', fontWeight: 500 }}>{medicine.name}</td>
                    <td className="py-3 px-4">
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        ...getStockColor(medicine.stock)
                      }}>
                        {medicine.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4" style={{ color: 'var(--muted-foreground)' }}>{medicine.expiry}</td>
                    <td className="py-3 px-4" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>{medicine.manufacturer || '-'}</td>
                    <td className="py-3 px-4" style={{ color: 'var(--muted-foreground)' }}>{medicine.dosageForm || '-'}</td>
                    <td className="py-3 px-4" style={{ color: 'var(--muted-foreground)' }}>{medicine.strength || '-'}</td>
                    <td className="py-3 px-4" style={{ color: medicine.critical ? 'var(--destructive)' : 'var(--muted-foreground)' }}>{medicine.critical ? 'Yes' : 'No'}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditMedicine(medicine)}
                          style={{ borderColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMedicine(medicine.id)}
                          style={{ borderColor: 'var(--destructive)', color: 'var(--destructive-foreground)' }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {medicines.length === 0 && (
            <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
              <Package className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--muted)' }} />
              <p>No medicines in inventory</p>
              <p className="text-sm">Click "Add Medicine" to get started</p>
            </div>
          )}
        </Card>

        {editingMedicine && (
          <Dialog open={!!editingMedicine} onOpenChange={(open) => !open && setEditingMedicine(null)}>
            <DialogContent className="sm:max-w-md" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
              <DialogHeader>
                <DialogTitle>Edit Medicine</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name" style={{ color: 'var(--foreground)' }}>Medicine Name</Label>
                  <Input id="edit-name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }} />
                </div>
                <div>
                  <Label htmlFor="edit-manufacturer" style={{ color: 'var(--foreground)' }}>Manufacturer</Label>
                  <Input id="edit-manufacturer" type="text" value={formData.manufacturer} onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }} />
                </div>
                <div>
                  <Label htmlFor="edit-dosageForm" style={{ color: 'var(--foreground)' }}>Dosage Form</Label>
                  <select id="edit-dosageForm" value={formData.dosageForm} onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                    className="mt-1 w-full p-2 rounded-md border" style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                    {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Other'].map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit-strength" style={{ color: 'var(--foreground)' }}>Strength</Label>
                  <Input id="edit-strength" type="text" value={formData.strength} onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                    placeholder="e.g., 500mg" style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }} />
                </div>
                <div>
                  <Label htmlFor="edit-expiryDate" style={{ color: 'var(--foreground)' }}>Expiry Date</Label>
                  <Input id="edit-expiryDate" type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }} />
                </div>
                <div>
                  <Label htmlFor="edit-stock" style={{ color: 'var(--foreground)' }}>Stock Quantity</Label>
                  <Input id="edit-stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }} />
                </div>
                <div className="flex items-center space-x-2">
                  <input id="edit-critical" type="checkbox" checked={formData.critical} onChange={(e) => setFormData({ ...formData, critical: e.target.checked })} />
                  <Label htmlFor="edit-critical" style={{ color: 'var(--foreground)' }}>Critical</Label>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button style={{ flex: 1, backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }} onClick={handleUpdateMedicine}>
                    Update Medicine
                  </Button>
                  <Button variant="outline" style={{ flex: 1, borderColor: 'var(--border)', color: 'var(--foreground)' }} onClick={() => setEditingMedicine(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </ToggleableSidebar>
  );
}
