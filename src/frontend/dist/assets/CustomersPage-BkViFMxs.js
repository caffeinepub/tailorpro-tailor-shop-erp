import { r as reactExports, b as backend, i as idbGet, a as idbSet, j as jsxRuntimeExports, B as Button, I as Input } from "./index-TdD9R_9D.js";
import { C as Card, a as CardContent } from "./card-CiNzoqcO.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-Dx8gBYWO.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DagaGlZ2.js";
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
function photosKey(customerId) {
  return `garment_photos_${customerId}`;
}
function compressImage(file, maxWidth = 800, quality = 0.65) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      var _a;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round(height * maxWidth / width);
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
      img.src = (_a = e.target) == null ? void 0 : _a.result;
    };
    reader.onerror = () => reject(new Error("file_read_error"));
    reader.readAsDataURL(file);
  });
}
function photoKey(src) {
  return src.slice(0, 40);
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
  const [photosCustomer, setPhotosCustomer] = reactExports.useState(null);
  const [photos, setPhotos] = reactExports.useState([]);
  const [photoError, setPhotoError] = reactExports.useState("");
  const [uploading, setUploading] = reactExports.useState(false);
  const [photoCounts, setPhotoCounts] = reactExports.useState({});
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
    () => backend.getCustomers().then(setCustomers),
    []
  );
  reactExports.useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);
  reactExports.useEffect(() => {
    let cancelled = false;
    const loadCounts = async () => {
      const counts = {};
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
                const parsed = JSON.parse(lsRaw);
                counts[id] = parsed.length;
              } catch {
                counts[id] = 0;
              }
            } else {
              counts[id] = 0;
            }
          }
        })
      );
      if (!cancelled) setPhotoCounts(counts);
    };
    loadCounts();
    return () => {
      cancelled = true;
    };
  }, [customers]);
  const openPhotos = reactExports.useCallback(async (c) => {
    const id = String(c.id);
    setPhotosCustomer(c);
    setPhotoError("");
    const stored = await idbGet("photos", photosKey(id));
    if (Array.isArray(stored) && stored.length > 0) {
      setPhotos(stored);
      return;
    }
    const lsRaw = localStorage.getItem(photosKey(id));
    if (lsRaw) {
      try {
        const parsed = JSON.parse(lsRaw);
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
  const closePhotos = reactExports.useCallback(() => {
    setPhotosCustomer(null);
    setPhotos([]);
    setPhotoError("");
    setCustomers((prev) => [...prev]);
  }, []);
  const deletePhoto = reactExports.useCallback(
    async (idx) => {
      if (!photosCustomer) return;
      const id = String(photosCustomer.id);
      const updated = photos.filter((_, i) => i !== idx);
      await idbSet("photos", photosKey(id), updated);
      setPhotos(updated);
      setPhotoCounts((prev) => ({ ...prev, [id]: updated.length }));
      setPhotoError("");
    },
    [photos, photosCustomer]
  );
  const processFiles = reactExports.useCallback(
    async (files) => {
      if (!photosCustomer || files.length === 0) return;
      const id = String(photosCustomer.id);
      setUploading(true);
      setPhotoError("");
      try {
        const compressed = await Promise.all(
          files.map((f) => compressImage(f))
        );
        const existing = await idbGet("photos", photosKey(id));
        const existingArr = Array.isArray(existing) ? existing : [];
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
    [photosCustomer]
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setShowAdd(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
            onClick: saveCustomer,
            "data-ocid": "customers.save.submit_button",
            children: "Save"
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
      photoError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2", children: [
        "⚠️ ",
        photoError
      ] }),
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
        photos.map((src, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative group rounded-lg overflow-hidden border border-gray-200",
            "data-ocid": `customers.photos.item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src,
                  alt: `Garment ${idx + 1}`,
                  className: "w-full h-28 object-cover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => deletePhoto(idx),
                  className: "absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                  title: "Delete photo",
                  "data-ocid": `customers.photos.delete_button.${idx + 1}`,
                  children: "×"
                }
              )
            ]
          },
          photoKey(src)
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
              "Uploading..."
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
