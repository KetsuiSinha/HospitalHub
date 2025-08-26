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

  return (
    <ToggleableSidebar 
      currentPage="inventory" 
      onNavigate={onNavigate} 
      onLogout={onLogout}
    >
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-700 hover:bg-blue-800">
                <Plus className="w-4 h-4 mr-2" />
                Add Medicine
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Medicine</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Medicine Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter medicine name"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="Enter stock quantity"
                  />
                </div>
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    value={formData.expiry}
                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    placeholder="MM/YYYY"
                  />
                </div>
                <div>
                  <Label htmlFor="batch">Batch Number</Label>
                  <Input
                    id="batch"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    placeholder="Enter batch number"
                  />
                </div>
                <Button onClick={handleAddMedicine} className="w-full bg-blue-700 hover:bg-blue-800">
                  Add Medicine
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Medicine</th>
                  <th className="text-left py-3 px-4">Stock</th>
                  <th className="text-left py-3 px-4">Expiry</th>
                  <th className="text-left py-3 px-4">Batch</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine) => (
                  <tr key={medicine.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{medicine.name}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        medicine.stock < 50 ? 'bg-red-100 text-red-800' :
                        medicine.stock < 100 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {medicine.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{medicine.expiry}</td>
                    <td className="py-3 px-4 text-gray-700 font-mono text-sm">{medicine.batch}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditMedicine(medicine)}
                          className="hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMedicine(medicine.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No medicines in inventory</p>
              <p className="text-sm">Click "Add Medicine" to get started</p>
            </div>
          )}
        </Card>

        <Dialog open={!!editingMedicine} onOpenChange={(open) => !open && setEditingMedicine(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Medicine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Medicine Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter medicine name"
                />
              </div>
              <div>
                <Label htmlFor="edit-stock">Stock Quantity</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="Enter stock quantity"
                />
              </div>
              <div>
                <Label htmlFor="edit-expiry">Expiry Date</Label>
                <Input
                  id="edit-expiry"
                  value={formData.expiry}
                  onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                  placeholder="MM/YYYY"
                />
              </div>
              <div>
                <Label htmlFor="edit-batch">Batch Number</Label>
                <Input
                  id="edit-batch"
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  placeholder="Enter batch number"
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button className="flex-1 bg-blue-700 hover:bg-blue-800" onClick={handleUpdateMedicine}>
                  Update Medicine
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setEditingMedicine(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ToggleableSidebar>
  );
}
