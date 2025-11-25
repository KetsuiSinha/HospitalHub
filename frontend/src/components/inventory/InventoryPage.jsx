import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Edit, Trash2, Plus, Package, Building2, Search } from "lucide-react"
import { medicinesApi, getAuthUser } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

export function InventoryPage() {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userHospital, setUserHospital] = useState("")
  const [userCity, setUserCity] = useState("")

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

  useEffect(() => {
    const user = getAuthUser();
    if (user && user.hospital) {
      setUserHospital(user.hospital);
      setUserCity(user.city || "");
    }
  }, []);

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

  const getStockBadgeVariant = (stock) => {
    if (stock < 20) return "destructive"
    if (stock < 50) return "secondary" // Using secondary as warning equivalent
    return "outline"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventory Management</h1>
          {(userHospital || userCity) && (
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <Building2 className="w-4 h-4 mr-2" />
              {[userHospital, userCity].filter(Boolean).join(" • ")}
            </div>
          )}
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="w-4 h-4 mr-2" /> Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Medicine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medicine Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter medicine name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="Enter manufacturer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dosageForm">Form</Label>
                  <Select
                    value={formData.dosageForm}
                    onValueChange={(value) => setFormData({ ...formData, dosageForm: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select form" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tablet">Tablet</SelectItem>
                      <SelectItem value="Capsule">Capsule</SelectItem>
                      <SelectItem value="Liquid">Liquid</SelectItem>
                      <SelectItem value="Injection">Injection</SelectItem>
                      <SelectItem value="Cream">Cream</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="strength">Strength</Label>
                  <Input
                    id="strength"
                    value={formData.strength}
                    onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                    placeholder="e.g., 500mg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
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
                <Label htmlFor="critical">Mark as critical medicine</Label>
              </div>
              <Button onClick={handleAddMedicine} className="w-full">
                Add Medicine
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 text-destructive">
          <span className="h-2 w-2 rounded-full bg-destructive" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <Card className="shadow-sm">
        <div className="p-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Form</TableHead>
                <TableHead>Strength</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading inventory...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : medicines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                      <Package className="w-8 h-8 opacity-50" />
                      <p>No medicines found in inventory</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                medicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell className="font-medium">
                      {medicine.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStockBadgeVariant(medicine.stock)} className="font-mono">
                        {medicine.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {medicine.expiry}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {medicine.manufacturer}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {medicine.dosageForm}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {medicine.strength}
                    </TableCell>
                    <TableCell>
                      {medicine.critical && (
                        <Badge variant="destructive" className="text-[10px] uppercase">
                          Critical
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditMedicine(medicine)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMedicine(medicine.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Medicine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Medicine Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter medicine name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-manufacturer">Manufacturer</Label>
                <Input
                  id="edit-manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="Enter manufacturer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-dosageForm">Form</Label>
                  <Select
                    value={formData.dosageForm}
                    onValueChange={(value) => setFormData({ ...formData, dosageForm: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select form" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tablet">Tablet</SelectItem>
                      <SelectItem value="Capsule">Capsule</SelectItem>
                      <SelectItem value="Liquid">Liquid</SelectItem>
                      <SelectItem value="Injection">Injection</SelectItem>
                      <SelectItem value="Cream">Cream</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-strength">Strength</Label>
                  <Input
                    id="edit-strength"
                    value={formData.strength}
                    onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                    placeholder="e.g., 500mg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Stock Quantity</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-expiryDate">Expiry Date</Label>
                  <Input
                    id="edit-expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
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
                <Label htmlFor="edit-critical">Mark as critical medicine</Label>
              </div>
              <div className="flex space-x-2 pt-2">
                <Button className="flex-1" onClick={handleUpdateMedicine}>
                  Update Medicine
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
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
  )
}