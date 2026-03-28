import { useCallback, useEffect, useMemo, useState } from "react";
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
import type { Customer, Measurements } from "../tailor-types";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [viewMeasure, setViewMeasure] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    chest: "",
    waist: "",
    hip: "",
    shoulder: "",
    sleeveLength: "",
    shirtLength: "",
    trouserLength: "",
    neck: "",
  });

  const load = useCallback(() => backend.getCustomers().then(setCustomers), []);
  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditCustomer(null);
    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      chest: "",
      waist: "",
      hip: "",
      shoulder: "",
      sleeveLength: "",
      shirtLength: "",
      trouserLength: "",
      neck: "",
    });
    setShowAdd(true);
  };

  const openEdit = (c: Customer) => {
    setEditCustomer(c);
    const m = c.measurements[0];
    setForm({
      name: c.name,
      phone: c.phone,
      email: c.email,
      address: c.address,
      chest: m ? String(m.chest) : "",
      waist: m ? String(m.waist) : "",
      hip: m ? String(m.hip) : "",
      shoulder: m ? String(m.shoulder) : "",
      sleeveLength: m ? String(m.sleeveLength) : "",
      shirtLength: m ? String(m.shirtLength) : "",
      trouserLength: m ? String(m.trouserLength) : "",
      neck: m ? String(m.neck) : "",
    });
    setShowAdd(true);
  };

  const buildMeasurements = (): [] | [Measurements] => {
    if (!form.chest && !form.waist && !form.hip) return [];
    return [
      {
        chest: Number.parseFloat(form.chest) || 0,
        waist: Number.parseFloat(form.waist) || 0,
        hip: Number.parseFloat(form.hip) || 0,
        shoulder: Number.parseFloat(form.shoulder) || 0,
        sleeveLength: Number.parseFloat(form.sleeveLength) || 0,
        shirtLength: Number.parseFloat(form.shirtLength) || 0,
        trouserLength: Number.parseFloat(form.trouserLength) || 0,
        neck: Number.parseFloat(form.neck) || 0,
      },
    ];
  };

  const save = async () => {
    const m = buildMeasurements();
    if (editCustomer) {
      await backend.updateCustomer(
        editCustomer.id,
        form.name,
        form.phone,
        form.email,
        form.address,
        m,
      );
    } else {
      await backend.addCustomer(
        form.name,
        form.phone,
        form.email,
        form.address,
        m,
      );
    }
    setShowAdd(false);
    load();
  };

  const del = async (id: bigint) => {
    if (confirm("Delete this customer?")) {
      await backend.deleteCustomer(id);
      load();
    }
  };

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search),
      ),
    [customers, search],
  );

  const mFields: { key: keyof Measurements; label: string }[] = [
    { key: "chest", label: "Chest" },
    { key: "waist", label: "Waist" },
    { key: "hip", label: "Hip" },
    { key: "shoulder", label: "Shoulder" },
    { key: "sleeveLength", label: "Sleeve" },
    { key: "shirtLength", label: "Shirt Length" },
    { key: "trouserLength", label: "Trouser Length" },
    { key: "neck", label: "Neck" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Customers</h1>
        <Button
          onClick={openAdd}
          className="bg-[#1F7E78] hover:bg-[#166661] text-white"
        >
          + Add Customer
        </Button>
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs mb-4"
          />
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Phone</TableHead>
                <TableHead className="text-xs">Email</TableHead>
                <TableHead className="text-xs">Address</TableHead>
                <TableHead className="text-xs">Measurements</TableHead>
                <TableHead className="text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-gray-400 py-8"
                  >
                    No customers found
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((c) => (
                <TableRow key={String(c.id)}>
                  <TableCell className="font-medium text-sm">
                    {c.name}
                  </TableCell>
                  <TableCell className="text-sm">{c.phone}</TableCell>
                  <TableCell className="text-sm">{c.email}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {c.address}
                  </TableCell>
                  <TableCell>
                    {c.measurements[0] ? (
                      <button
                        type="button"
                        onClick={() => setViewMeasure(c)}
                        className="text-xs text-[#1F7E78] underline"
                      >
                        View
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Not recorded
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(c)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => del(c.id)}
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
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editCustomer ? "Edit Customer" : "Add New Customer"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {(["name", "phone", "email", "address"] as const).map((key) => (
                <div key={key}>
                  <p className="text-xs font-semibold text-gray-600 mb-0.5 capitalize">
                    {key}
                    {key === "name" ? " *" : ""}
                  </p>
                  <Input
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-2">
              Body Measurements (cm)
            </p>
            <div className="grid grid-cols-4 gap-2">
              {mFields.map((f) => (
                <div key={f.key}>
                  <p className="text-[10px] text-gray-500">{f.label}</p>
                  <Input
                    type="number"
                    className="h-8 text-sm"
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
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

      <Dialog open={!!viewMeasure} onOpenChange={() => setViewMeasure(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Measurements — {viewMeasure?.name}</DialogTitle>
          </DialogHeader>
          {viewMeasure?.measurements[0] && (
            <div className="grid grid-cols-2 gap-3">
              {mFields.map((f) => (
                <div key={f.key} className="bg-gray-50 rounded p-2">
                  <p className="text-[10px] text-gray-500">{f.label}</p>
                  <p className="text-lg font-bold text-[#111827]">
                    {viewMeasure!.measurements[0]![f.key]}{" "}
                    <span className="text-xs font-normal text-gray-400">
                      cm
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
