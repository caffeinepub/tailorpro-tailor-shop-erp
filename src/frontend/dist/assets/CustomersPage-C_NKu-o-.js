import { r as reactExports, l as loadConfig, H as HttpAgent, S as StorageClient, b as backend, j as jsxRuntimeExports, B as Button, I as Input } from "./index-ob4l79ux.js";
import { C as Card, a as CardContent } from "./card-C4G9ZZVK.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-BFXbdcG8.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DnShncmh.js";
import "./createLucideIcon-CDc7506A.js";
function useTimeoutFn(fn, ms) {
  var ready = reactExports.useRef(false);
  var timeout = reactExports.useRef();
  var callback = reactExports.useRef(fn);
  var isReady = reactExports.useCallback(function() {
    return ready.current;
  }, []);
  var set = reactExports.useCallback(function() {
    ready.current = false;
    timeout.current && clearTimeout(timeout.current);
    timeout.current = setTimeout(function() {
      ready.current = true;
      callback.current();
    }, ms);
  }, [ms]);
  var clear = reactExports.useCallback(function() {
    ready.current = null;
    timeout.current && clearTimeout(timeout.current);
  }, []);
  reactExports.useEffect(function() {
    callback.current = fn;
  }, [fn]);
  reactExports.useEffect(function() {
    set();
    return clear;
  }, [ms]);
  return [isReady, clear, set];
}
function useDebounce(fn, ms, deps) {
  if (deps === void 0) {
    deps = [];
  }
  var _a = useTimeoutFn(fn, ms), isReady = _a[0], cancel = _a[1], reset = _a[2];
  reactExports.useEffect(reset, deps);
  return [isReady, cancel];
}
let cachedStorageClient = null;
function useStorageClient() {
  const [storageClient, setStorageClient] = reactExports.useState(
    cachedStorageClient
  );
  reactExports.useEffect(() => {
    if (cachedStorageClient) {
      setStorageClient(cachedStorageClient);
      return;
    }
    let cancelled = false;
    loadConfig().then((config) => {
      var _a;
      if (cancelled) return;
      const agent = new HttpAgent({ host: config.backend_host });
      if ((_a = config.backend_host) == null ? void 0 : _a.includes("localhost")) {
        agent.fetchRootKey().catch(() => {
        });
      }
      const client = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent
      );
      cachedStorageClient = client;
      setStorageClient(client);
    }).catch(() => {
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return storageClient;
}
async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const MAX = 1600;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width >= height) {
          height = Math.round(height / width * MAX);
          width = MAX;
        } else {
          width = Math.round(width / height * MAX);
          height = MAX;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas toBlob returned null"));
            return;
          }
          blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf))).catch(reject);
        },
        "image/jpeg",
        0.82
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image load failed"));
    };
    img.src = objectUrl;
  });
}
function CustomersPage() {
  const [customers, setCustomers] = reactExports.useState([]);
  const [search, setSearch] = reactExports.useState("");
  const [debouncedSearch, setDebouncedSearch] = reactExports.useState("");
  useDebounce(() => setDebouncedSearch(search), 300, [search]);
  const [sortBy, setSortBy] = reactExports.useState("default");
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [viewMeasure, setViewMeasure] = reactExports.useState(null);
  const [editCustomer, setEditCustomer] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [saveError, setSaveError] = reactExports.useState("");
  const [photosCustomer, setPhotosCustomer] = reactExports.useState(null);
  const [photos, setPhotos] = reactExports.useState([]);
  const [photoError, setPhotoError] = reactExports.useState("");
  const [uploading, setUploading] = reactExports.useState(false);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [photoCounts, setPhotoCounts] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(true);
  const storageClient = useStorageClient();
  const galleryInputRef = reactExports.useRef(null);
  const cameraInputRef = reactExports.useRef(null);
  const [form, setForm] = reactExports.useState({
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
    neck: ""
  });
  const loadCustomers = reactExports.useCallback(
    () => backend.getCustomers().then((list) => {
      setCustomers(list);
      setLoading(false);
    }),
    []
  );
  reactExports.useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);
  const openPhotos = reactExports.useCallback(async (c) => {
    setPhotosCustomer(c);
    setPhotoError("");
    setPhotos([]);
    try {
      const urls = await backend.getCustomerPhotos(c.id);
      setPhotos(urls);
      setPhotoCounts((prev) => ({ ...prev, [String(c.id)]: urls.length }));
    } catch {
      setPhotoError("Could not load photos. Please try again.");
    }
  }, []);
  const closePhotos = reactExports.useCallback(() => {
    setPhotosCustomer(null);
    setPhotos([]);
    setPhotoError("");
    setUploadProgress(0);
  }, []);
  const deletePhoto = reactExports.useCallback(
    async (url) => {
      if (!photosCustomer) return;
      try {
        await backend.deleteCustomerPhoto(photosCustomer.id, url);
        const updated = photos.filter((p) => p !== url);
        setPhotos(updated);
        setPhotoCounts((prev) => ({
          ...prev,
          [String(photosCustomer.id)]: updated.length
        }));
      } catch {
        setPhotoError("Could not delete photo. Please try again.");
      }
    },
    [photos, photosCustomer]
  );
  const processFiles = reactExports.useCallback(
    async (files) => {
      if (!photosCustomer || files.length === 0) return;
      if (!storageClient) {
        setPhotoError("Storage not ready. Please try again in a moment.");
        return;
      }
      setUploading(true);
      setPhotoError("");
      setUploadProgress(0);
      try {
        const newUrls = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const bytes = await compressImage(file);
          const { hash } = await storageClient.putFile(
            bytes,
            (pct) => setUploadProgress(
              Math.round((i + pct / 100) / files.length * 100)
            )
          );
          const url = await storageClient.getDirectURL(hash);
          await backend.addCustomerPhoto(photosCustomer.id, url);
          newUrls.push(url);
        }
        const updated = [...photos, ...newUrls];
        setPhotos(updated);
        setPhotoCounts((prev) => ({
          ...prev,
          [String(photosCustomer.id)]: updated.length
        }));
      } catch (err) {
        console.error("Photo upload failed:", err);
        setPhotoError("Could not upload photo. Please try again.");
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [photosCustomer, storageClient, photos]
  );
  const handleFileChange = reactExports.useCallback(
    async (e) => {
      if (!e.target.files) return;
      const files = Array.from(e.target.files);
      await processFiles(files);
      e.target.value = "";
    },
    [processFiles]
  );
  const openAdd = () => {
    setEditCustomer(null);
    setSaveError("");
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
      neck: ""
    });
    setShowAdd(true);
  };
  const openEdit = (c) => {
    setEditCustomer(c);
    setSaveError("");
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
      neck: m ? String(m.neck) : ""
    });
    setShowAdd(true);
  };
  const buildMeasurements = () => {
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
        neck: Number.parseFloat(form.neck) || 0
      }
    ];
  };
  const saveCustomer = async () => {
    if (!form.name.trim()) {
      setSaveError("Customer name is required.");
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      const m = buildMeasurements();
      if (editCustomer) {
        await backend.updateCustomer(
          editCustomer.id,
          form.name,
          form.phone,
          form.email,
          form.address,
          m
        );
      } else {
        await backend.addCustomer(
          form.name,
          form.phone,
          form.email,
          form.address,
          m
        );
      }
      setShowAdd(false);
      loadCustomers();
    } catch (err) {
      console.error("Save customer failed:", err);
      setSaveError("Save failed. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };
  const del = async (id) => {
    if (confirm("Delete this customer?")) {
      await backend.deleteCustomer(id);
      loadCustomers();
    }
  };
  const filtered = reactExports.useMemo(() => {
    const result = customers.filter(
      (c) => c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || c.phone.includes(debouncedSearch)
    );
    if (sortBy === "name_asc") {
      return [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === "name_desc") {
      return [...result].sort((a, b) => b.name.localeCompare(a.name));
    }
    if (sortBy === "newest") {
      return [...result].sort(
        (a, b) => a.id < b.id ? 1 : a.id > b.id ? -1 : 0
      );
    }
    if (sortBy === "oldest") {
      return [...result].sort(
        (a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0
      );
    }
    return result;
  }, [customers, debouncedSearch, sortBy]);
  const mFields = [
    { key: "chest", label: "Chest" },
    { key: "waist", label: "Waist" },
    { key: "hip", label: "Hip" },
    { key: "shoulder", label: "Shoulder" },
    { key: "sleeveLength", label: "Sleeve" },
    { key: "shirtLength", label: "Shirt Length" },
    { key: "trouserLength", label: "Trouser Length" },
    { key: "neck", label: "Neck" }
  ];
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F7E78]" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-[#111827]", children: "Customers" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: openAdd,
          className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
          "data-ocid": "customers.add.primary_button",
          children: "+ Add Customer"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search by name or phone...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "max-w-xs",
            "data-ocid": "customers.search_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-gray-500 whitespace-nowrap", children: "Sort:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: sortBy,
              onChange: (e) => setSortBy(e.target.value),
              className: "text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1F7E78] focus:border-transparent cursor-pointer",
              "data-ocid": "customers.sort.select",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "default", children: "Default" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "name_asc", children: "Name A→Z" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "name_desc", children: "Name Z→A" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "newest", children: "Newest First" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "oldest", children: "Oldest First" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxHeight: "480px", overflowY: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-gray-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs w-12 text-center", children: "S.No." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Measurements" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TableCell,
          {
            colSpan: 7,
            className: "text-center text-sm text-gray-400 py-8",
            "data-ocid": "customers.list.empty_state",
            children: "No customers found"
          }
        ) }) : filtered.map((c, idx) => {
          const cid = String(c.id);
          const count = photoCounts[cid] ?? 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableRow,
            {
              "data-ocid": `customers.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs font-semibold text-gray-400 w-12 text-center", children: idx + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-sm", children: c.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: c.phone }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: c.email }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-gray-500 max-w-[150px] truncate", children: c.address }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: c.measurements[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setViewMeasure(c),
                    className: "text-xs text-[#1F7E78] underline",
                    children: "View"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: "Not recorded" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => openEdit(c),
                      className: "text-xs text-blue-600 hover:underline",
                      "data-ocid": `customers.edit_button.${idx + 1}`,
                      children: "Edit"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => del(c.id),
                      className: "text-xs text-red-500 hover:underline",
                      "data-ocid": `customers.delete_button.${idx + 1}`,
                      children: "Delete"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => openPhotos(c),
                      className: "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-[#1F7E78] text-[#1F7E78] hover:bg-[#1F7E78] hover:text-white transition-colors",
                      "data-ocid": `customers.photos_button.${idx + 1}`,
                      children: [
                        "📷",
                        count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-[#1F7E78] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold leading-none", children: count }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Photos" })
                      ]
                    }
                  )
                ] }) })
              ]
            },
            cid
          );
        }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAdd, onOpenChange: setShowAdd, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg max-h-[80vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editCustomer ? "Edit Customer" : "Add New Customer" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: ["name", "phone", "email", "address"].map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-gray-600 mb-0.5 capitalize", children: [
            key,
            key === "name" ? " *" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form[key],
              onChange: (e) => setForm({ ...form, [key]: e.target.value })
            }
          )
        ] }, key)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wide pt-2", children: "Body Measurements (cm)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2", children: mFields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500", children: f.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              className: "h-8 text-sm",
              value: form[f.key],
              onChange: (e) => setForm({ ...form, [f.key]: e.target.value })
            }
          )
        ] }, f.key)) })
      ] }),
      saveError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2",
          "data-ocid": "customers.save.error_state",
          children: [
            "⚠️ ",
            saveError
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setShowAdd(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
            onClick: saveCustomer,
            disabled: saving,
            "data-ocid": "customers.save.submit_button",
            children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" }),
              "Saving..."
            ] }) : "Save"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!viewMeasure, onOpenChange: () => setViewMeasure(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "Measurements — ",
        viewMeasure == null ? void 0 : viewMeasure.name
      ] }) }),
      (viewMeasure == null ? void 0 : viewMeasure.measurements[0]) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: mFields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500", children: f.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-bold text-[#111827]", children: [
          viewMeasure.measurements[0][f.key],
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-gray-400", children: "cm" })
        ] })
      ] }, f.key)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!photosCustomer, onOpenChange: closePhotos, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg max-h-[85vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "📷 Garment Photos — ",
        photosCustomer == null ? void 0 : photosCustomer.name
      ] }) }),
      photoError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2",
          "data-ocid": "customers.photos.error_state",
          children: [
            "⚠️ ",
            photoError
          ]
        }
      ),
      uploading && uploadProgress > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-gray-100 rounded-full h-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "bg-[#1F7E78] h-2 rounded-full transition-all",
          style: { width: `${uploadProgress}%` }
        }
      ) }),
      photos.length === 0 && !uploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-10 text-gray-400",
          "data-ocid": "customers.photos.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl mb-3", children: "📷" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No photos yet." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "Use the buttons below to add garment photos." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        photos.map((url, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative group rounded-lg overflow-hidden border border-gray-200",
            "data-ocid": `customers.photos.item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: url,
                  alt: `Garment ${idx + 1}`,
                  className: "w-full h-28 object-cover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => deletePhoto(url),
                  className: "absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                  title: "Delete photo",
                  "data-ocid": `customers.photos.delete_button.${idx + 1}`,
                  children: "×"
                }
              )
            ]
          },
          url
        )),
        uploading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-dashed border-gray-300 h-28 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-[#1F7E78]" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: galleryInputRef,
            type: "file",
            accept: "image/*",
            multiple: true,
            className: "hidden",
            onChange: handleFileChange
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: cameraInputRef,
            type: "file",
            accept: "image/*",
            capture: "environment",
            className: "hidden",
            onChange: handleFileChange
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => {
              var _a;
              return (_a = galleryInputRef.current) == null ? void 0 : _a.click();
            },
            variant: "outline",
            className: "w-full border-[#1F7E78] text-[#1F7E78] hover:bg-[#1F7E78] hover:text-white",
            disabled: uploading,
            "data-ocid": "customers.photos.gallery_button",
            children: "🖼️ Gallery"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => {
              var _a;
              return (_a = cameraInputRef.current) == null ? void 0 : _a.click();
            },
            className: "w-full bg-[#1F7E78] hover:bg-[#166661] text-white",
            disabled: uploading,
            "data-ocid": "customers.photos.camera_button",
            children: uploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" }),
              uploadProgress > 0 ? `${uploadProgress}%` : "Uploading..."
            ] }) : "📷 Camera"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: closePhotos,
          "data-ocid": "customers.photos.close_button",
          children: "Close"
        }
      ) })
    ] }) })
  ] });
}
export {
  CustomersPage as default
};
