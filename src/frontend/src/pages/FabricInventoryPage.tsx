import { useCallback, useEffect, useState } from "react";
import { backend } from "../actor";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { fmt } from "../lib/helpers";
import type { FabricInventory } from "../tailor-types";

export default function FabricInventoryPage() {
  const [items, setItems] = useState<FabricInventory[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<FabricInventory | null>(null);
  const [form, setForm] = useState({
    fabricName: "",
    color: "",
    quantityMeters: "",
    pricePerMeter: "",
    supplier: "",
    reorderLevel: "",
  });

  const load = useCallback(() => backend.getInventory().then(setItems), []);
  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditItem(null);
    setForm({
      fabricName: "",
      color: "",
      quantityMeters: "",
      pricePerMeter: "",
      supplier: "",
      reorderLevel: "",
    });
    setShowAdd(true);
  };

  const openEdit = (item: FabricInventory) => {
    setEditItem(item);
    setForm({
      fabricName: item.fabricName,
      color: item.color,
      quantityMeters: String(item.quantityMeters),
      pricePerMeter: String(item.pricePerMeter),
      supplier: item.supplier,
      reorderLevel: String(item.reorderLevel),
    });
    setShowAdd(true);
  };

  const save = async () => {
    const f = Number.parseFloat;
    const s = form;
    if (editItem) {
      await backend.updateInventoryItem(
        editItem.id,
        s.fabricName,
        s.color,
        f(s.quantityMeters) || 0,
        f(s.pricePerMeter) || 0,
        s.supplier,
        f(s.reorderLevel) || 0,
      );
    } else {
      await backend.addInventoryItem(
        s.fabricName,
        s.color,
        f(s.quantityMeters) || 0,
        f(s.pricePerMeter) || 0,
        s.supplier,
        f(s.reorderLevel) || 0,
      );
    }
    setShowAdd(false);
    load();
  };

  const del = async (id: bigint) => {
    if (confirm("Delete fabric?")) {
      await backend.deleteInventoryItem(id);
      load();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Fabric Inventory</h1>
        <Button
          onClick={openAdd}
          className="bg-[#1F7E78] hover:bg-[#166661] text-white"
        >
          + Add Fabric
        </Button>
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-xs">Fabric</TableHead>
                <TableHead className="text-xs">Color</TableHead>
                <TableHead className="text-xs">Qty (m)</TableHead>
                <TableHead className="text-xs">Price/m</TableHead>
                <TableHead className="text-xs">Supplier</TableHead>
                <TableHead className="text-xs">Stock Status</TableHead>
                <TableHead className="text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-sm text-gray-400 py-8"
                  >
                    No fabrics in inventory
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={String(item.id)}>
                  <TableCell className="text-sm font-medium">
                    {item.fabricName}
                  </TableCell>
                  <TableCell className="text-sm">{item.color}</TableCell>
                  <TableCell className="text-sm">
                    {item.quantityMeters}m
                  </TableCell>
                  <TableCell className="text-sm">
                    {fmt(item.pricePerMeter)}/m
                  </TableCell>
                  <TableCell className="text-sm">{item.supplier}</TableCell>
                  <TableCell>
                    {item.quantityMeters <= item.reorderLevel ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        In Stock
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => del(item.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Fabric" : "Add Fabric"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { key: "fabricName", label: "Fabric Name", type: "text" },
                { key: "color", label: "Color", type: "text" },
                {
                  key: "quantityMeters",
                  label: "Quantity (m)",
                  type: "number",
                },
                { key: "pricePerMeter", label: "Price/m ₹", type: "number" },
                { key: "supplier", label: "Supplier", type: "text" },
                {
                  key: "reorderLevel",
                  label: "Reorder Level (m)",
                  type: "number",
                },
              ] as const
            ).map(({ key, label, type }) => (
              <div key={key}>
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  {label}
                </p>
                <Input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#1F7E78] hover:bg-[#166661] text-white"
              onClick={save}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
