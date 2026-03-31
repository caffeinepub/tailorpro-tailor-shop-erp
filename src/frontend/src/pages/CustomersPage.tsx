import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "react-use";
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
import { idbGet, idbSet } from "../lib/idb";
import type { Customer, Measurements } from "../tailor-types";

// ── Garment photo key helper ──────────────────────────────────────────────
function photosKey(customerId: string) {
  return `garment_photos_${customerId}`;
}

// Compress image using Canvas to reduce storage size
function compressImage(
  file: File,
  maxWidth = 800,
  quality = 0.65,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("canvas_error"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("image_load_error"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("file_read_error"));
    reader.readAsDataURL(file);
  });
}

function photoKey(src: string) {
  return src.slice(0, 40);
}

type SortOption = "default" | "name_asc" | "name_desc" | "newest" | "oldest";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useDebounce(() => setDebouncedSearch(search), 300, [search]);

  const [sortBy, setSortBy] = useState<SortOption>("default");

  const [showAdd, setShowAdd] = useState(false);
  const [viewMeasure, setViewMeasure] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  // Photo dialog state
  const [photosCustomer, setPhotosCustomer] = useState<Customer | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [photoCounts, setPhotoCounts] = useState<Record<string, number>>({});

  // Two separate hidden inputs: one for gallery, one for camera
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  const loadCustomers = useCallback(
    () => backend.getCustomers().then(setCustomers),
    [],
  );
  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // Recompute photo counts from IDB whenever customers list changes
  useEffect(() => {
    let cancelled = false;
    const loadCounts = async () => {
      const counts: Record<string, number> = {};
      await Promise.all(
        customers.map(async (c) => {
          const id = String(c.id);
          const stored = await idbGet("photos", photosKey(id));
          if (Array.isArray(stored)) {
            counts[id] = stored.length;
          } else {
            const lsRaw = localStorage.getItem(photosKey(id));
            if (lsRaw) {
              try {
                const parsed = JSON.parse(lsRaw) as string[];
                counts[id] = parsed.length;
              } catch {
                counts[id] = 0;
              }
            } else {
              counts[id] = 0;
            }
          }
        }),
      );
      if (!cancelled) setPhotoCounts(counts);
    };
    loadCounts();
    return () => {
      cancelled = true;
    };
  }, [customers]);

  const openPhotos = useCallback(async (c: Customer) => {
    const id = String(c.id);
    setPhotosCustomer(c);
    setPhotoError("");

    const stored = await idbGet("photos", photosKey(id));
    if (Array.isArray(stored) && stored.length > 0) {
      setPhotos(stored as string[]);
      return;
    }

    const lsRaw = localStorage.getItem(photosKey(id));
    if (lsRaw) {
      try {
        const parsed = JSON.parse(lsRaw) as string[];
        await idbSet("photos", photosKey(id), parsed);
        localStorage.removeItem(photosKey(id));
        setPhotos(parsed);
      } catch {
        setPhotos([]);
      }
    } else {
      setPhotos([]);
    }
  }, []);

  const closePhotos = useCallback(() => {
    setPhotosCustomer(null);
    setPhotos([]);
    setPhotoError("");
    setCustomers((prev) => [...prev]);
  }, []);

  const deletePhoto = useCallback(
    async (idx: number) => {
      if (!photosCustomer) return;
      const id = String(photosCustomer.id);
      const updated = photos.filter((_, i) => i !== idx);
      await idbSet("photos", photosKey(id), updated);
      setPhotos(updated);
      setPhotoCounts((prev) => ({ ...prev, [id]: updated.length }));
      setPhotoError("");
    },
    [photos, photosCustomer],
  );

  const processFiles = useCallback(
    async (files: File[]) => {
      if (!photosCustomer || files.length === 0) return;
      const id = String(photosCustomer.id);
      setUploading(true);
      setPhotoError("");
      try {
        const compressed = await Promise.all(
          files.map((f) => compressImage(f)),
        );
        const existing = await idbGet("photos", photosKey(id));
        const existingArr = Array.isArray(existing)
          ? (existing as string[])
          : [];
        const updated = [...existingArr, ...compressed];
        await idbSet("photos", photosKey(id), updated);
        setPhotos(updated);
        setPhotoCounts((prev) => ({ ...prev, [id]: updated.length }));
      } catch {
        setPhotoError("Could not upload photo. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [photosCustomer],
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const files = Array.from(e.target.files);
      await processFiles(files);
      e.target.value = "";
    },
    [processFiles],
  );

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

  const saveCustomer = async () => {
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
    loadCustomers();
  };

  const del = async (id: bigint) => {
    if (confirm("Delete this customer?")) {
      await backend.deleteCustomer(id);
      loadCustomers();
    }
  };

  const filtered = useMemo(() => {
    const result = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        c.phone.includes(debouncedSearch),
    );

    if (sortBy === "name_asc") {
      return [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === "name_desc") {
      return [...result].sort((a, b) => b.name.localeCompare(a.name));
    }
    if (sortBy === "newest") {
      return [...result].sort((a, b) =>
        a.id < b.id ? 1 : a.id > b.id ? -1 : 0,
      );
    }
    if (sortBy === "oldest") {
      return [...result].sort((a, b) =>
        a.id > b.id ? 1 : a.id < b.id ? -1 : 0,
      );
    }
    return result;
  }, [customers, debouncedSearch, sortBy]);

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
          data-ocid="customers.add.primary_button"
        >
          + Add Customer
        </Button>
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          {/* Search + Sort row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Input
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
              data-ocid="customers.search_input"
            />
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1F7E78] focus:border-transparent cursor-pointer"
                data-ocid="customers.sort.select"
              >
                <option value="default">Default</option>
                <option value="name_asc">Name A→Z</option>
                <option value="name_desc">Name Z→A</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          <div style={{ maxHeight: "480px", overflowY: "auto" }}>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs w-12 text-center">
                    S.No.
                  </TableHead>
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Phone</TableHead>
                  <TableHead className="text-xs">Email</TableHead>
                  <TableHead className="text-xs">Address</TableHead>
                  <TableHead className="text-xs">Measurements</TableHead>
                  <TableHead className="text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-sm text-gray-400 py-8"
                      data-ocid="customers.list.empty_state"
                    >
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((c, idx) => {
                    const cid = String(c.id);
                    const count = photoCounts[cid] ?? 0;
                    return (
                      <TableRow
                        key={cid}
                        data-ocid={`customers.item.${idx + 1}`}
                      >
                        <TableCell className="text-xs font-semibold text-gray-400 w-12 text-center">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {c.name}
                        </TableCell>
                        <TableCell className="text-sm">{c.phone}</TableCell>
                        <TableCell className="text-sm">{c.email}</TableCell>
                        <TableCell className="text-sm text-gray-500 max-w-[150px] truncate">
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
                          <div className="flex flex-wrap gap-2 items-center">
                            <button
                              type="button"
                              onClick={() => openEdit(c)}
                              className="text-xs text-blue-600 hover:underline"
                              data-ocid={`customers.edit_button.${idx + 1}`}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => del(c.id)}
                              className="text-xs text-red-500 hover:underline"
                              data-ocid={`customers.delete_button.${idx + 1}`}
                            >
                              Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => openPhotos(c)}
                              className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-[#1F7E78] text-[#1F7E78] hover:bg-[#1F7E78] hover:text-white transition-colors"
                              data-ocid={`customers.photos_button.${idx + 1}`}
                            >
                              📷
                              {count > 0 && (
                                <span className="bg-[#1F7E78] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold leading-none">
                                  {count}
                                </span>
                              )}
                              <span>Photos</span>
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Customer Dialog */}
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
              onClick={saveCustomer}
              data-ocid="customers.save.submit_button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Measurements Dialog */}
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

      {/* Garment Photos Dialog */}
      <Dialog open={!!photosCustomer} onOpenChange={closePhotos}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              📷 Garment Photos — {photosCustomer?.name}
            </DialogTitle>
          </DialogHeader>

          {/* Error message */}
          {photoError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">
              ⚠️ {photoError}
            </div>
          )}

          {/* Photo grid */}
          {photos.length === 0 && !uploading ? (
            <div
              className="flex flex-col items-center justify-center py-10 text-gray-400"
              data-ocid="customers.photos.empty_state"
            >
              <span className="text-5xl mb-3">📷</span>
              <p className="text-sm">No photos yet.</p>
              <p className="text-xs mt-1">
                Use the buttons below to add garment photos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {photos.map((src, idx) => (
                <div
                  key={photoKey(src)}
                  className="relative group rounded-lg overflow-hidden border border-gray-200"
                  data-ocid={`customers.photos.item.${idx + 1}`}
                >
                  <img
                    src={src}
                    alt={`Garment ${idx + 1}`}
                    className="w-full h-28 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => deletePhoto(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete photo"
                    data-ocid={`customers.photos.delete_button.${idx + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
              {uploading && (
                <div className="rounded-lg border border-dashed border-gray-300 h-28 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1F7E78]" />
                </div>
              )}
            </div>
          )}

          {/* Upload buttons */}
          <div className="pt-3 grid grid-cols-2 gap-3">
            {/* Hidden input: gallery (multiple files) */}
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            {/* Hidden input: camera (single photo) */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            <Button
              onClick={() => galleryInputRef.current?.click()}
              variant="outline"
              className="w-full border-[#1F7E78] text-[#1F7E78] hover:bg-[#1F7E78] hover:text-white"
              disabled={uploading}
              data-ocid="customers.photos.gallery_button"
            >
              🖼️ Gallery
            </Button>

            <Button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full bg-[#1F7E78] hover:bg-[#166661] text-white"
              disabled={uploading}
              data-ocid="customers.photos.camera_button"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Uploading...
                </span>
              ) : (
                "📷 Camera"
              )}
            </Button>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closePhotos}
              data-ocid="customers.photos.close_button"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
