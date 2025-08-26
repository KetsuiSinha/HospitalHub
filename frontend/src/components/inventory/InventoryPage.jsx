import React, { useState } from 'react';
import { ToggleableSidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, Package } from 'lucide-react';

export function InventoryPage({ onNavigate, onLogout }) {
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Paracetamol 500mg', stock: 320, expiry: '12/2025', batch: 'P2024001' },
    { id: 2, name: 'Amoxicillin 250mg', stock: 180, expiry: '10/2025', batch: 'A2024002' },
    { id: 3, name: 'ORS Sachets', stock: 45, expiry: '08/2026', batch: 'O2024003' },
    { id: 4, name: 'Vitamin D3 60k IU', stock: 85, expiry: '06/2025', batch: 'V2024004' },
    { id: 5, name: 'Metformin 500mg', stock: 95, expiry: '03/2026', batch: 'M2024005' },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [formData, setFormData] = useState({ name: '', stock: '', expiry: '', batch: '' });

  const handleAddMedicine = () => {
    const newMedicine = {
      id: Date.now(),
      name: formData.name,
      stock: parseInt(formData.stock),
      expiry: formData.expiry,
      batch: formData.batch
    };
    setMedicines([...medicines, newMedicine]);
    setFormData({ name: '', stock: '', expiry: '', batch: '' });
    setIsAddDialogOpen(false);
  };

  const handleEditMedicine = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      stock: medicine.stock.toString(),
      expiry: medicine.expiry,
      batch: medicine.batch
    });
  };

  const handleUpdateMedicine = () => {
    if (editingMedicine) {
      setMedicines(medicines.map(med =>
        med.id === editingMedicine.id
          ? { ...med, name: formData.name, stock: parseInt(formData.stock), expiry: formData.expiry, batch: formData.batch }
          : med
      ));
      setEditingMedicine(null);
      setFormData({ name: '', stock: '', expiry: '', batch: '' });
    }
  };

  const handleDeleteMedicine = (id) => {
    setMedicines(medicines.filter(med => med.id !== id));
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
                {['name', 'stock', 'expiry', 'batch'].map((field) => (
                  <div key={field}>
                    <Label htmlFor={field} style={{ color: 'var(--foreground)' }}>
                      {field === 'name' ? 'Medicine Name' : field === 'stock' ? 'Stock Quantity' : field === 'expiry' ? 'Expiry Date' : 'Batch Number'}
                    </Label>
                    <Input
                      id={field}
                      type={field === 'stock' ? 'number' : 'text'}
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      placeholder={`Enter ${field}`}
                      style={{
                        backgroundColor: 'var(--input)',
                        color: 'var(--foreground)',
                        borderColor: 'var(--border)',
                      }}
                    />
                  </div>
                ))}
                <Button onClick={handleAddMedicine} style={{ width: '100%', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                  Add Medicine
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', boxShadow: 'var(--shadow-md)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left py-3 px-4">Medicine</th>
                  <th className="text-left py-3 px-4">Stock</th>
                  <th className="text-left py-3 px-4">Expiry</th>
                  <th className="text-left py-3 px-4">Batch</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine) => (
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
                    <td className="py-3 px-4" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>{medicine.batch}</td>
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
                {['name', 'stock', 'expiry', 'batch'].map((field) => (
                  <div key={field}>
                    <Label htmlFor={`edit-${field}`} style={{ color: 'var(--foreground)' }}>
                      {field === 'name' ? 'Medicine Name' : field === 'stock' ? 'Stock Quantity' : field === 'expiry' ? 'Expiry Date' : 'Batch Number'}
                    </Label>
                    <Input
                      id={`edit-${field}`}
                      type={field === 'stock' ? 'number' : 'text'}
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      placeholder={`Enter ${field}`}
                      style={{
                        backgroundColor: 'var(--input)',
                        color: 'var(--foreground)',
                        borderColor: 'var(--border)',
                      }}
                    />
                  </div>
                ))}
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
