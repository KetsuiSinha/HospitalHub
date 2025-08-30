import React, { useEffect, useState } from "react"
import { ToggleableSidebar } from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Edit, Trash2, Plus, Package } from "lucide-react"
import { medicinesApi } from "@/lib/api"

export function InventoryPage({ onNavigate, onLogout }) {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    dosageForm: "Tablet",
    strength: "",
    expiryDate: "",
    stock: "",
    critical: false,
  })

  const fetchMedicines = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await medicinesApi.list()
      const mapped = data.map((m) => ({
        id: m._id,
        name: m.name,
        stock: m.stock,
        expiry: m.expiryDate
          ? new Date(m.expiryDate).toLocaleDateString()
          : "-",
        expiryDate: m.expiryDate
          ? new Date(m.expiryDate).toISOString().slice(0, 10)
          : "",
        manufacturer: m.manufacturer || "-",
        dosageForm: m.dosageForm || "Tablet",
        strength: m.strength || "",
        critical: !!m.critical,
      }))
      setMedicines(mapped)
    } catch (err) {
      setError(err.message || "Failed to load medicines")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedicines()
  }, [])

  const handleAddMedicine = async () => {
    try {
      const payload = {
        name: formData.name,
        manufacturer: formData.manufacturer || undefined,
        dosageForm: formData.dosageForm,
        strength: formData.strength || undefined,
        expiryDate: formData.expiryDate
          ? new Date(formData.expiryDate).toISOString()
          : undefined,
        stock: parseInt(formData.stock || "0"),
        critical: !!formData.critical,
      }
      const created = await medicinesApi.create(payload)
      setMedicines((prev) => [
        ...prev,
        {
          id: created._id,
          name: created.name,
          stock: created.stock,
          expiry: created.expiryDate
            ? new Date(created.expiryDate).toLocaleDateString()
            : "-",
          expiryDate: created.expiryDate
            ? new Date(created.expiryDate).toISOString().slice(0, 10)
            : "",
          manufacturer: created.manufacturer || "-",
          dosageForm: created.dosageForm || "Tablet",
          strength: created.strength || "",
          critical: !!created.critical,
        },
      ])
      setFormData({
        name: "",
        manufacturer: "",
        dosageForm: "Tablet",
        strength: "",
        expiryDate: "",
        stock: "",
        critical: false,
      })
      setIsAddDialogOpen(false)
    } catch (err) {
      setError(err.message || "Failed to add medicine")
    }
  }

  const handleEditMedicine = (medicine) => {
    setEditingMedicine(medicine)
    setFormData({
      name: medicine.name || "",
      manufacturer:
        medicine.manufacturer && medicine.manufacturer !== "-"
          ? medicine.manufacturer
          : "",
      dosageForm: medicine.dosageForm || "Tablet",
      strength: medicine.strength || "",
      expiryDate: medicine.expiryDate || "",
      stock: medicine.stock != null ? String(medicine.stock) : "",
      critical: !!medicine.critical,
    })
  }

  const handleUpdateMedicine = async () => {
    if (!editingMedicine) return
    try {
      const payload = {
        name: formData.name,
        manufacturer: formData.manufacturer || undefined,
        dosageForm: formData.dosageForm,
        strength: formData.strength || undefined,
        expiryDate: formData.expiryDate
          ? new Date(formData.expiryDate).toISOString()
          : undefined,
        stock: parseInt(formData.stock || "0"),
        critical: !!formData.critical,
      }
      await medicinesApi.update(editingMedicine.id, payload)
      setMedicines(
        medicines.map((med) =>
          med.id === editingMedicine.id
            ? {
                ...med,
                name: formData.name,
                stock: parseInt(formData.stock),
                expiry: formData.expiryDate
                  ? new Date(formData.expiryDate).toLocaleDateString()
                  : "-",
                expiryDate: formData.expiryDate || "",
                manufacturer: formData.manufacturer || "-",
                dosageForm: formData.dosageForm,
                strength: formData.strength || "",
                critical: !!formData.critical,
              }
            : med
        )
      )
      setEditingMedicine(null)
      setFormData({
        name: "",
        manufacturer: "",
        dosageForm: "Tablet",
        strength: "",
        expiryDate: "",
        stock: "",
        critical: false,
      })
    } catch (err) {
      setError(err.message || "Failed to update medicine")
    }
  }

  const handleDeleteMedicine = async (id) => {
    try {
      await medicinesApi.remove(id)
      setMedicines(medicines.filter((med) => med.id !== id))
    } catch (err) {
      setError(err.message || "Failed to delete medicine")
    }
  }

  const getStockBadgeClass = (stock) => {
    if (stock < 20) return "bg-destructive/10 text-destructive border border-destructive/20"
    if (stock < 50) return "bg-accent/50 text-accent-foreground border border-accent/30"
    return "bg-primary/10 text-primary border border-primary/20"
  }

  return (
    <ToggleableSidebar
      currentPage="inventory"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="min-h-screen bg-background">
        <div className="p-6 space-y-6 text-foreground font-sans">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                  <Plus className="w-4 h-4 mr-2" /> Add Medicine
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-card-foreground">Add New Medicine</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-card-foreground">Medicine Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter medicine name"
                      className="bg-background border-input focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer" className="text-sm font-medium text-card-foreground">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                      placeholder="Enter manufacturer"
                      className="bg-background border-input focus:ring-ring"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dosageForm" className="text-sm font-medium text-card-foreground">Form</Label>
                      <select
                        id="dosageForm"
                        value={formData.dosageForm}
                        onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="Tablet">Tablet</option>
                        <option value="Capsule">Capsule</option>
                        <option value="Liquid">Liquid</option>
                        <option value="Injection">Injection</option>
                        <option value="Cream">Cream</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="strength" className="text-sm font-medium text-card-foreground">Strength</Label>
                      <Input
                        id="strength"
                        value={formData.strength}
                        onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                        placeholder="e.g., 500mg"
                        className="bg-background border-input focus:ring-ring"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-sm font-medium text-card-foreground">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="0"
                        min="0"
                        className="bg-background border-input focus:ring-ring"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate" className="text-sm font-medium text-card-foreground">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="bg-background border-input focus:ring-ring"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="critical"
                      type="checkbox"
                      checked={formData.critical}
                      onChange={(e) => setFormData({ ...formData, critical: e.target.checked })}
                      className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-ring focus:ring-2"
                    />
                    <Label htmlFor="critical" className="text-sm text-card-foreground">Mark as critical medicine</Label>
                  </div>
                  <Button onClick={handleAddMedicine} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Add Medicine
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Card className="overflow-hidden shadow-md bg-card border-border">
            <div className="overflow-x-auto px-4 py-1">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50 border-b border-border">
                    <TableHead className="text-muted-foreground font-medium px-4 py-3">Medicine</TableHead>
                    <TableHead className="text-muted-foreground font-medium px-4 py-3">Stock</TableHead>
                    <TableHead className="text-muted-foreground font-medium px-4 py-3">Expiry</TableHead>
                    <TableHead className="text-muted-foreground font-medium px-4 py-3">Manufacturer</TableHead>
                    <TableHead className="text-muted-foreground font-medium px-4 py-3">Form</TableHead>
                    <TableHead className="text-muted-foreground font-medium px-4 py-3">Strength</TableHead>
                    <TableHead className="text-muted-foreground font-medium px-4 py-3">Critical</TableHead>
                    <TableHead className="text-right text-muted-foreground font-medium px-4 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading medicines...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : medicines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 px-4 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <Package className="w-12 h-12 text-muted-foreground/50" />
                          <div className="space-y-2">
                            <p className="text-muted-foreground font-medium">No medicines in inventory</p>
                            <p className="text-sm text-muted-foreground/70">Click "Add Medicine" to get started</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    medicines.map((medicine, index) => (
                      <TableRow 
                        key={medicine.id} 
                        className={`hover:bg-muted/30 border-b border-border/50 ${
                          index % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                        }`}
                      >
                        <TableCell className="font-medium text-card-foreground px-4 py-3">
                          {medicine.name}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStockBadgeClass(medicine.stock)}`}>
                            {medicine.stock} units
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-sm px-4 py-3">
                          {medicine.expiry}
                        </TableCell>
                        <TableCell className="text-muted-foreground px-4 py-3">
                          {medicine.manufacturer}
                        </TableCell>
                        <TableCell className="text-muted-foreground px-4 py-3">
                          {medicine.dosageForm}
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-sm px-4 py-3">
                          {medicine.strength}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            medicine.critical 
                              ? "bg-destructive/10 text-destructive border border-destructive/20" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {medicine.critical ? "Critical" : "Standard"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right px-4 py-3">
                          <div className="flex justify-end space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditMedicine(medicine)}
                              className="h-8 w-8 p-0 border-border hover:bg-accent hover:text-accent-foreground"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteMedicine(medicine.id)}
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive border-border"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Edit Dialog */}
          {editingMedicine && (
            <Dialog
              open={!!editingMedicine}
              onOpenChange={(open) => !open && setEditingMedicine(null)}
            >
              <DialogContent className="sm:max-w-md bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-card-foreground">Edit Medicine</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-sm font-medium text-card-foreground">Medicine Name</Label>
                    <Input
                      id="edit-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter medicine name"
                      className="bg-background border-input focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-manufacturer" className="text-sm font-medium text-card-foreground">Manufacturer</Label>
                    <Input
                      id="edit-manufacturer"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                      placeholder="Enter manufacturer"
                      className="bg-background border-input focus:ring-ring"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-dosageForm" className="text-sm font-medium text-card-foreground">Form</Label>
                      <select
                        id="edit-dosageForm"
                        value={formData.dosageForm}
                        onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="Tablet">Tablet</option>
                        <option value="Capsule">Capsule</option>
                        <option value="Liquid">Liquid</option>
                        <option value="Injection">Injection</option>
                        <option value="Cream">Cream</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-strength" className="text-sm font-medium text-card-foreground">Strength</Label>
                      <Input
                        id="edit-strength"
                        value={formData.strength}
                        onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                        placeholder="e.g., 500mg"
                        className="bg-background border-input focus:ring-ring"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-stock" className="text-sm font-medium text-card-foreground">Stock Quantity</Label>
                      <Input
                        id="edit-stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="0"
                        min="0"
                        className="bg-background border-input focus:ring-ring"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-expiryDate" className="text-sm font-medium text-card-foreground">Expiry Date</Label>
                      <Input
                        id="edit-expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="bg-background border-input focus:ring-ring"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="edit-critical"
                      type="checkbox"
                      checked={formData.critical}
                      onChange={(e) => setFormData({ ...formData, critical: e.target.checked })}
                      className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-ring focus:ring-2"
                    />
                    <Label htmlFor="edit-critical" className="text-sm text-card-foreground">Mark as critical medicine</Label>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" 
                      onClick={handleUpdateMedicine}
                    >
                      Update Medicine
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-border hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setEditingMedicine(null)}
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
    </ToggleableSidebar>
  )
}