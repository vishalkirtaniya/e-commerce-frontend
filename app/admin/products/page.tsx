"use client";

import { useEffect, useState, useRef } from "react";
import { adminApi } from "@/lib/adminApi";
import type { ProductImage } from "@/lib/adminApi";

// ── Types ─────────────────────────────────────────────────────
interface ProductSize {
  id?: number;
  label: string;
  price: number;
  is_default?: boolean;
}

interface FormErrors {
  name?: string;
  sku?: string;
  slug?: string;
  description?: string;
  category_id?: string;
  price?: string;
  images?: string;
}

interface Product {
  id: number;
  sku: string;
  slug: string;
  name: string;
  description: string;
  material: string;
  price: number;
  original_price: number | null;
  discount: number | null;
  rating: number;
  review_count: number;
  category_id: number;
  is_new_arrival: boolean;
  is_top_selling: boolean;
  is_customizable: boolean;
  is_sold_out: boolean;
  created_at: string;
  categories?: { id: number; name: string; slug: string };
  product_images?: ProductImage[];
  product_sizes?: ProductSize[];
}

type DrawerMode = "add" | "edit" | "images" | null;

const TABS_ADD = ["Info", "Pricing & Sizes", "Flags"];
const TABS_EDIT = ["Info", "Pricing & Sizes", "Flags", "Images"];

const S: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#f5f5f5",
    fontFamily: "Helvetica Neue, Arial, sans-serif",
  },
  topbar: {
    background: "#fff",
    borderBottom: "1px solid #e8e8e8",
    padding: "0 1.5rem",
    height: 52,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
  },
  topLeft: { display: "flex", alignItems: "center", gap: 12 },
  title: {
    fontSize: 14,
    fontWeight: 700,
    color: "#000",
    letterSpacing: -0.3,
    textTransform: "uppercase" as const,
  },
  search: {
    fontSize: 12,
    padding: "6px 12px",
    border: "1px solid #e8e8e8",
    background: "#f5f5f5",
    color: "#000",
    outline: "none",
    width: 200,
  },
  select: {
    fontSize: 12,
    padding: "6px 10px",
    border: "1px solid #e8e8e8",
    background: "#f5f5f5",
    color: "#000",
    outline: "none",
    cursor: "pointer",
  },
  btn: {
    fontSize: 12,
    padding: "7px 16px",
    border: "1px solid #000",
    background: "#000",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    letterSpacing: 0.3,
    textTransform: "uppercase" as const,
  },
  btnGhost: {
    fontSize: 12,
    padding: "7px 16px",
    border: "1px solid #000",
    background: "#fff",
    color: "#000",
    cursor: "pointer",
    fontWeight: 600,
    letterSpacing: 0.3,
    textTransform: "uppercase" as const,
  },
  btnDanger: {
    fontSize: 12,
    padding: "5px 10px",
    border: "1px solid #c0392b",
    background: "#fff",
    color: "#c0392b",
    cursor: "pointer",
    fontWeight: 500,
  },
  btnAct: {
    fontSize: 11,
    padding: "4px 10px",
    border: "1px solid #e8e8e8",
    background: "#fff",
    color: "#000",
    cursor: "pointer",
    fontWeight: 500,
  },
  btnSold: {
    fontSize: 11,
    padding: "4px 10px",
    border: "1px solid #e8e8e8",
    background: "#fff",
    color: "#888",
    cursor: "pointer",
    fontWeight: 500,
  },
  content: { flex: 1, overflow: "auto", padding: "1.25rem 1.5rem" },
  tableWrap: { background: "#fff", border: "1px solid #e8e8e8" },
  th: {
    textAlign: "left" as const,
    padding: "10px 14px",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
    color: "#888",
    background: "#fafafa",
    borderBottom: "1px solid #e8e8e8",
  },
  td: {
    padding: "12px 14px",
    borderBottom: "1px solid #f0f0f0",
    color: "#000",
    verticalAlign: "middle" as const,
  },
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 10,
  },
  drawer: {
    position: "fixed" as const,
    right: 0,
    top: 0,
    bottom: 0,
    width: 520,
    background: "#fff",
    borderLeft: "1px solid #e8e8e8",
    zIndex: 11,
    display: "flex",
    flexDirection: "column",
  },
  drawerHead: {
    padding: "1rem 1.25rem",
    borderBottom: "1px solid #e8e8e8",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
  },
  drawerTitle: {
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    color: "#000",
  },
  drawerBody: { flex: 1, overflowY: "auto" as const, padding: "1.25rem" },
  drawerFoot: {
    padding: "1rem 1.25rem",
    borderTop: "1px solid #e8e8e8",
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
    flexShrink: 0,
  },
  tabs: { display: "flex", borderBottom: "1px solid #e8e8e8", flexShrink: 0 },
  field: { marginBottom: 14 },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
    color: "#888",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    fontSize: 13,
    padding: "9px 11px",
    border: "1px solid #e8e8e8",
    background: "#fff",
    color: "#000",
    outline: "none",
    fontFamily: "inherit",
  },
  textarea: {
    width: "100%",
    fontSize: 13,
    padding: "9px 11px",
    border: "1px solid #e8e8e8",
    background: "#fff",
    color: "#000",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical" as const,
    minHeight: 80,
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
  sectionHead: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
    color: "#000",
    margin: "16px 0 10px",
    paddingBottom: 6,
    borderBottom: "1px solid #e8e8e8",
  },
};

const Flag = ({
  label,
  color,
  bg,
}: {
  label: string;
  color: string;
  bg: string;
}) => (
  <span
    style={{
      display: "inline-block",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.5,
      padding: "2px 7px",
      textTransform: "uppercase",
      background: bg,
      color,
      marginRight: 4,
    }}
  >
    {label}
  </span>
);

// ── Toggle ────────────────────────────────────────────────────
function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 36,
        height: 20,
        borderRadius: 100,
        background: value ? "#000" : "#e8e8e8",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.15s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          top: 3,
          left: value ? 19 : 3,
          transition: "left 0.15s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
}

function ToggleRow({
  label,
  sub,
  value,
  onChange,
}: {
  label: string;
  sub: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid #f5f5f5",
      }}
    >
      <div>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#000" }}>
          {label}
        </div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{sub}</div>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

// ── Image Manager ─────────────────────────────────────────────
function ImageManager({
  productId,
  onClose,
}: {
  productId: number;
  onClose: () => void;
}) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    adminApi
      .getProductImages(String(productId))
      .then(setImages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      try {
        const img = await adminApi.uploadProductImage(String(productId), file);
        setImages((prev) => [...prev, img]);
      } catch (err) {
        alert(`Failed to upload ${file.name}`);
      }
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const handleDelete = async (imageId: number) => {
    if (!confirm("Delete this image?")) return;
    try {
      await adminApi.deleteProductImage(String(productId), imageId);
      setImages((prev) => prev.filter((i) => i.id !== imageId));
    } catch {
      alert("Failed to delete image");
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    try {
      await adminApi.setPrimaryImage(String(productId), imageId);
      setImages((prev) =>
        prev.map((i) => ({ ...i, is_primary: i.id === imageId })),
      );
    } catch {
      alert("Failed to set primary");
    }
  };

  return (
    <div style={S.drawerBody}>
      <div style={S.sectionHead}>Product Images</div>

      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        style={{
          border: "2px dashed #e8e8e8",
          padding: "2rem",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 8 }}>⬆</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#000" }}>
          {uploading ? "Uploading..." : "Click or drag to upload images"}
        </div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
          JPEG, PNG, WEBP · Max 10MB · Auto-compressed to WebP
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          style={{ display: "none" }}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* Image grid */}
      {loading ? (
        <div
          style={{
            padding: "1rem",
            textAlign: "center",
            fontSize: 12,
            color: "#888",
          }}
        >
          Loading...
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 8,
            marginTop: 14,
          }}
        >
          {images
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((img) => (
              <div
                key={img.id}
                style={{
                  position: "relative",
                  aspectRatio: "1",
                  background: "#f5f5f5",
                  border: "1px solid #e8e8e8",
                  overflow: "hidden",
                }}
              >
                <img
                  src={img.url}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {/* Delete */}
                <div
                  onClick={() => handleDelete(img.id)}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    background: "#000",
                    color: "#fff",
                    fontSize: 11,
                    width: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  ×
                </div>
                {/* Primary badge / button */}
                {img.is_primary ? (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 4,
                      left: 4,
                      right: 4,
                      background: "#000",
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      padding: "3px 4px",
                      textAlign: "center",
                    }}
                  >
                    Primary
                  </div>
                ) : (
                  <div
                    onClick={() => handleSetPrimary(img.id)}
                    style={{
                      position: "absolute",
                      bottom: 4,
                      left: 4,
                      right: 4,
                      background: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      padding: "3px 4px",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    Set Primary
                  </div>
                )}
              </div>
            ))}
          {/* Add more */}
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: "2px dashed #e8e8e8",
              aspectRatio: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              color: "#ccc",
              cursor: "pointer",
            }}
          >
            +
          </div>
        </div>
      )}

      <p style={{ fontSize: 11, color: "#888", marginTop: 10 }}>
        First image is shown on the storefront. Click Set Primary to change.
      </p>
    </div>
  );
}

// ── Product Form ──────────────────────────────────────────────
interface FormState {
  name: string;
  sku: string;
  slug: string;
  description: string;
  material: string;
  price: string;
  original_price: string;
  discount: string;
  category_id: string;
  is_new_arrival: boolean;
  is_top_selling: boolean;
  is_customizable: boolean;
  is_sold_out: boolean;
  sizes: { label: string; price: string }[];
}

function emptyForm(): FormState {
  return {
    name: "",
    sku: "",
    slug: "",
    description: "",
    material: "",
    price: "",
    original_price: "",
    discount: "",
    category_id: "1",
    is_new_arrival: false,
    is_top_selling: false,
    is_customizable: true,
    is_sold_out: false,
    sizes: [
      { label: "S", price: "" },
      { label: "M", price: "" },
      { label: "L", price: "" },
    ],
  };
}

function productToForm(p: Product): FormState {
  return {
    name: p.name,
    sku: p.sku,
    slug: p.slug,
    description: p.description ?? "",
    material: p.material,
    price: String(p.price),
    original_price: String(p.original_price ?? ""),
    discount: String(p.discount ?? ""),
    category_id: String(p.category_id),
    is_new_arrival: p.is_new_arrival,
    is_top_selling: p.is_top_selling,
    is_customizable: p.is_customizable,
    is_sold_out: p.is_sold_out,
    sizes:
      p.product_sizes?.map((s) => ({
        label: s.label,
        price: String(s.price),
      })) ?? [],
  };
}

// ── Main Page ─────────────────────────────────────────────────
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [saveStatus, setSaveStatus] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [materials, setMaterials] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    adminApi
      .getProducts()
      .then((data) => setProducts(data as Product[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    adminApi.getCategories().then(setCategories).catch(console.error);
    adminApi.getMaterials().then(setMaterials).catch(console.error); // ← add this
  }, []);

  function validateForm(): FormErrors {
    const errs: FormErrors = {};

    if (!form.name.trim()) errs.name = "Product name is required";

    if (!form.sku.trim()) errs.sku = "SKU is required";

    if (!form.slug.trim())
      errs.slug = "Slug is required — use lowercase with dashes";
    else if (!/^[a-z0-9-]+$/.test(form.slug))
      errs.slug = "Slug can only contain lowercase letters, numbers and dashes";

    if (!form.description.trim() || form.description.trim().length < 20)
      errs.description = "Description is required (min 20 characters)";

    if (!form.category_id || form.category_id === "0")
      errs.category_id = "Please select a category";

    if (!form.price || Number(form.price) <= 0)
      errs.price = "Price must be greater than ₹0";

    if (drawerMode === "add" && pendingImages.length === 0)
      errs.images = "At least one product image is required";

    return errs;
  }

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "sold_out"
          ? p.is_sold_out
          : filterStatus === "in_stock"
            ? !p.is_sold_out
            : filterStatus === "new"
              ? p.is_new_arrival
              : filterStatus === "top"
                ? p.is_top_selling
                : true;
    return matchSearch && matchStatus;
  });

  function openAdd() {
    setForm(emptyForm());
    setEditProduct(null);
    setError("");
    setFormErrors({});
    setPendingImages([]);
    setSaveStatus("");
    setDrawerMode("add");
  }

  function openEdit(p: Product) {
    setForm(productToForm(p));
    setEditProduct(p);
    setError("");
    setFormErrors({});
    setDrawerMode("edit");
  }

  function openImages(p: Product) {
    setEditProduct(p);
    setDrawerMode("images");
  }

  function closeDrawer() {
    setDrawerMode(null);
    setEditProduct(null);
  }

  function setField(key: keyof FormState, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addSize() {
    setForm((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { label: "", price: "" }],
    }));
  }

  function updateSize(i: number, key: "label" | "price", val: string) {
    setForm((prev) => {
      const sizes = [...prev.sizes];
      sizes[i] = { ...sizes[i], [key]: val };
      return { ...prev, sizes };
    });
  }

  function removeSize(i: number) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, idx) => idx !== i),
    }));
  }

  async function handleSave() {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      // Scroll drawer body to top to show summary
      document
        .getElementById("drawer-body")
        ?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setFormErrors({});
    setError("");
    setSaving(true);

    try {
      const body = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        material: form.material,
        price: Number(form.price),
        original_price: form.original_price
          ? Number(form.original_price)
          : null,
        discount: form.discount ? Number(form.discount) : null,
        category_id: Number(form.category_id),
        is_new_arrival: form.is_new_arrival,
        is_top_selling: form.is_top_selling,
        is_customizable: form.is_customizable,
        is_sold_out: form.is_sold_out,
        sizes: form.sizes
          .filter((s) => s.label.trim() && s.price)
          .map((s) => ({ label: s.label.trim(), price: Number(s.price) })),
      };

      if (drawerMode === "add") {
        const created = (await adminApi.createProduct(body)) as Product;

        if (pendingImages.length > 0) {
          setSaveStatus("Uploading images...");
          for (const file of pendingImages) {
            try {
              await adminApi.uploadProductImage(String(created.id), file);
            } catch {
              console.error(`Failed to upload ${file.name}`);
            }
          }
          setPendingImages([]);
        }

        const full = (await adminApi.getProduct(String(created.id))) as Product;
        setProducts((prev) => [full, ...prev]);
      } else if (drawerMode === "edit" && editProduct) {
        const updated = (await adminApi.updateProduct(
          String(editProduct.id),
          body,
        )) as Product;
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)),
        );
      }

      closeDrawer();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
      setSaveStatus("");
    }
  }

  const SingleForm = (
    <div
      id="drawer-body"
      style={{ flex: 1, overflowY: "auto" as const, padding: "1.5rem" }}
    >
      {/* Validation summary */}
      {Object.keys(formErrors).length > 0 && (
        <div
          style={{
            background: "#fdecea",
            border: "1px solid #f5c6c2",
            padding: "12px 14px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#c0392b",
              textTransform: "uppercase" as const,
              letterSpacing: 0.5,
              marginBottom: 8,
            }}
          >
            ⚠ Please fix the following before saving
          </div>
          {Object.values(formErrors).map((e, i) => (
            <div
              key={i}
              style={{ fontSize: 12, color: "#c0392b", padding: "2px 0" }}
            >
              → {e}
            </div>
          ))}
        </div>
      )}

      {/* ── Section 1: Basic Info ── */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: "uppercase" as const,
            color: "#000",
            paddingBottom: 8,
            borderBottom: "2px solid #000",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              background: "#000",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            1
          </div>
          Basic Information
        </div>

        <div style={S.field}>
          <label style={S.label}>
            Product Name <span style={{ color: "#c0392b" }}>*</span>
          </label>
          <input
            style={{
              ...S.input,
              borderColor: formErrors.name ? "#c0392b" : "#e8e8e8",
              background: formErrors.name ? "#fff9f9" : "#fff",
            }}
            value={form.name}
            onChange={(e) => {
              setField("name", e.target.value);
              setFormErrors((p) => ({ ...p, name: undefined }));
            }}
            placeholder="e.g. Acrylic Name Board"
          />
          {formErrors.name && (
            <div style={{ fontSize: 11, color: "#c0392b", marginTop: 4 }}>
              ⚠ {formErrors.name}
            </div>
          )}
        </div>

        <div style={{ ...S.grid2, marginBottom: 12 }}>
          <div style={S.field}>
            <label style={S.label}>
              SKU <span style={{ color: "#c0392b" }}>*</span>
            </label>
            <input
              style={{
                ...S.input,
                borderColor: formErrors.sku ? "#c0392b" : "#e8e8e8",
                background: formErrors.sku ? "#fff9f9" : "#fff",
              }}
              value={form.sku}
              onChange={(e) => {
                setField("sku", e.target.value);
                setFormErrors((p) => ({ ...p, sku: undefined }));
              }}
              placeholder="ACR-001"
            />
            {formErrors.sku && (
              <div style={{ fontSize: 11, color: "#c0392b", marginTop: 4 }}>
                ⚠ {formErrors.sku}
              </div>
            )}
          </div>
          <div style={S.field}>
            <label style={S.label}>
              Slug <span style={{ color: "#c0392b" }}>*</span>
            </label>
            <input
              style={{
                ...S.input,
                borderColor: formErrors.slug ? "#c0392b" : "#e8e8e8",
                background: formErrors.slug ? "#fff9f9" : "#fff",
              }}
              value={form.slug}
              onChange={(e) => {
                setField("slug", e.target.value);
                setFormErrors((p) => ({ ...p, slug: undefined }));
              }}
              placeholder="acrylic-name-board"
            />
            {formErrors.slug && (
              <div style={{ fontSize: 11, color: "#c0392b", marginTop: 4 }}>
                ⚠ {formErrors.slug}
              </div>
            )}
          </div>
        </div>

        <div style={S.field}>
          <label style={S.label}>
            Description <span style={{ color: "#c0392b" }}>*</span>{" "}
            <span
              style={{
                color: "#aaa",
                textTransform: "none" as const,
                letterSpacing: 0,
                fontWeight: 400,
              }}
            >
              {form.description.length} chars
            </span>
          </label>
          <textarea
            style={{
              ...S.textarea,
              borderColor: formErrors.description ? "#c0392b" : "#e8e8e8",
              background: formErrors.description ? "#fff9f9" : "#fff",
            }}
            value={form.description}
            onChange={(e) => {
              setField("description", e.target.value);
              setFormErrors((p) => ({ ...p, description: undefined }));
            }}
            placeholder="Describe the product — material, use case, dimensions..."
          />
          {formErrors.description && (
            <div style={{ fontSize: 11, color: "#c0392b", marginTop: 4 }}>
              ⚠ {formErrors.description}
            </div>
          )}
        </div>

        <div style={S.grid2}>
          <div style={S.field}>
            <label style={S.label}>
              Category <span style={{ color: "#c0392b" }}>*</span>
            </label>
            <select
              style={{
                ...S.input,
                borderColor: formErrors.category_id ? "#c0392b" : "#e8e8e8",
              }}
              value={form.category_id}
              onChange={(e) => {
                setField("category_id", e.target.value);
                setFormErrors((p) => ({ ...p, category_id: undefined }));
              }}
            >
              <option value="0">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {formErrors.category_id && (
              <div style={{ fontSize: 11, color: "#c0392b", marginTop: 4 }}>
                ⚠ {formErrors.category_id}
              </div>
            )}
          </div>
          <div style={S.field}>
            <label style={S.label}>
              Material <span style={{ color: "#c0392b" }}>*</span>
            </label>
            <select
              style={{ ...S.input }}
              value={form.material}
              onChange={(e) => setField("material", e.target.value)}
            >
              {materials.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Section 2: Pricing ── */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: "uppercase" as const,
            color: "#000",
            paddingBottom: 8,
            borderBottom: "2px solid #000",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              background: "#000",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            2
          </div>
          Pricing
        </div>

        <div style={S.grid3}>
          <div style={S.field}>
            <label style={S.label}>
              Price (₹) <span style={{ color: "#c0392b" }}>*</span>
            </label>
            <input
              style={{
                ...S.input,
                borderColor: formErrors.price ? "#c0392b" : "#e8e8e8",
                background: formErrors.price ? "#fff9f9" : "#fff",
              }}
              type="number"
              min="1"
              value={form.price}
              onChange={(e) => {
                setField("price", e.target.value);
                setFormErrors((p) => ({ ...p, price: undefined }));
              }}
              placeholder="799"
            />
            {formErrors.price && (
              <div style={{ fontSize: 11, color: "#c0392b", marginTop: 4 }}>
                ⚠ {formErrors.price}
              </div>
            )}
          </div>
          <div style={S.field}>
            <label style={S.label}>Original Price (₹)</label>
            <input
              style={S.input}
              type="number"
              min="0"
              value={form.original_price}
              onChange={(e) => setField("original_price", e.target.value)}
              placeholder="999"
            />
          </div>
          <div style={S.field}>
            <label style={S.label}>Discount (%)</label>
            <input
              style={S.input}
              type="number"
              min="0"
              max="100"
              value={form.discount}
              onChange={(e) => setField("discount", e.target.value)}
              placeholder="20"
            />
          </div>
        </div>
      </div>

      {/* ── Section 3: Variants ── */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: "uppercase" as const,
            color: "#000",
            paddingBottom: 8,
            borderBottom: "2px solid #000",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              background: "#000",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            3
          </div>
          Variants / Dimensions
          <span
            style={{
              fontSize: 10,
              color: "#888",
              fontWeight: 400,
              letterSpacing: 0,
              textTransform: "none" as const,
            }}
          >
            — optional
          </span>
        </div>

        {form.sizes.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <input
              style={{ ...S.input, flex: 2 }}
              value={s.label}
              onChange={(e) => updateSize(i, "label", e.target.value)}
              placeholder='Label e.g. "Small", "30x20cm"'
            />
            <input
              style={{ ...S.input, flex: 1 }}
              type="number"
              value={s.price}
              onChange={(e) => updateSize(i, "price", e.target.value)}
              placeholder="₹ Price"
            />
            <button
              onClick={() => removeSize(i)}
              style={{
                background: "none",
                border: "1px solid #e8e8e8",
                color: "#c0392b",
                fontSize: 14,
                cursor: "pointer",
                padding: "0 10px",
                height: 38,
              }}
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={addSize}
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase" as const,
            letterSpacing: 0.5,
            color: "#000",
            background: "#fff",
            border: "1px dashed #000",
            padding: "7px 14px",
            cursor: "pointer",
            width: "100%",
            marginTop: 4,
          }}
        >
          + Add Variant
        </button>
        <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>
          Add size or dimension variants with individual pricing
        </div>
      </div>

      {/* ── Section 4: Flags ── */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: "uppercase" as const,
            color: "#000",
            paddingBottom: 8,
            borderBottom: "2px solid #000",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              background: "#000",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            4
          </div>
          Product Flags
        </div>

        {[
          {
            key: "is_new_arrival",
            label: "New Arrival",
            sub: "Shows in the New Arrivals section on the storefront",
          },
          {
            key: "is_top_selling",
            label: "Top Selling",
            sub: "Shows in the Top Selling section on the storefront",
          },
          {
            key: "is_customizable",
            label: "Customizable",
            sub: "Customers can add custom text, name, or notes",
          },
          {
            key: "is_sold_out",
            label: "Sold Out",
            sub: "Product shows as unavailable — cannot be added to cart",
            warn: true,
          },
        ].map(({ key, label, sub, warn }) => (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              border: `1px solid ${warn ? "#fdecea" : "#e8e8e8"}`,
              marginBottom: 6,
              background: warn ? "#fffafa" : "#fafafa",
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#000" }}>
                {label}
              </div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                {sub}
              </div>
            </div>
            <div
              onClick={() =>
                setField(key as keyof FormState, !form[key as keyof FormState])
              }
              style={{
                width: 36,
                height: 20,
                borderRadius: 100,
                background: form[key as keyof FormState] ? "#000" : "#e8e8e8",
                position: "relative",
                cursor: "pointer",
                transition: "background 0.15s",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: 3,
                  left: form[key as keyof FormState] ? 19 : 3,
                  transition: "left 0.15s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 5: Images ── */}
      {/* <div style={{ marginBottom: 8 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: "uppercase" as const,
            color: "#000",
            paddingBottom: 8,
            borderBottom: "2px solid #000",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              background: "#000",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            5
          </div>
          Product Images
          {drawerMode === "add" && (
            <span
              style={{
                fontSize: 10,
                color: "#c0392b",
                fontWeight: 400,
                letterSpacing: 0,
                textTransform: "none" as const,
              }}
            >
              — at least 1 required
            </span>
          )}
        </div>

        <div
          onDrop={(e) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files).filter((f) =>
              ["image/jpeg", "image/png", "image/webp"].includes(f.type),
            );
            setPendingImages((prev) => [...prev, ...files]);
            setFormErrors((p) => ({ ...p, images: undefined }));
          }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById("img-file-input")?.click()}
          style={{
            border: `2px dashed ${formErrors.images ? "#c0392b" : "#e8e8e8"}`,
            padding: "1.5rem",
            textAlign: "center",
            cursor: "pointer",
            background: formErrors.images ? "#fff9f9" : "#fafafa",
          }}
        >
          <div style={{ fontSize: 24, marginBottom: 6 }}>⬆</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#000" }}>
            {pendingImages.length > 0
              ? `${pendingImages.length} image${pendingImages.length > 1 ? "s" : ""} selected — click to add more`
              : "Click or drag to upload images"}
          </div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 3 }}>
            JPEG, PNG, WEBP · Max 10MB · Auto-compressed to WebP
          </div>
          <input
            id="img-file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files) {
                setPendingImages((prev) => [
                  ...prev,
                  ...Array.from(e.target.files!),
                ]);
                setFormErrors((p) => ({ ...p, images: undefined }));
                e.target.value = "";
              }
            }}
          />
        </div>
        {formErrors.images && (
          <div style={{ fontSize: 11, color: "#c0392b", marginTop: 4 }}>
            ⚠ {formErrors.images}
          </div>
        )}

        {pendingImages.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: 6,
              marginTop: 12,
            }}
          >
            {pendingImages.map((file, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  aspectRatio: "1",
                  background: "#f5f5f5",
                  border: "1px solid #e8e8e8",
                  overflow: "hidden",
                }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {i === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "#000",
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 700,
                      textTransform: "uppercase" as const,
                      letterSpacing: 0.5,
                      padding: "2px 4px",
                      textAlign: "center",
                    }}
                  >
                    Primary
                  </div>
                )}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingImages((prev) =>
                      prev.filter((_, idx) => idx !== i),
                    );
                  }}
                  style={{
                    position: "absolute",
                    top: 3,
                    right: 3,
                    background: "#000",
                    color: "#fff",
                    fontSize: 10,
                    width: 16,
                    height: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  ×
                </div>
              </div>
            ))}
          </div>
        )}
      </div> */}
      {drawerMode === "add" && (
        <>
          <div style={S.sectionHead}>Product Images</div>
          <div
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files).filter((f) =>
                ["image/jpeg", "image/png", "image/webp"].includes(f.type),
              );
              setPendingImages((prev) => [...prev, ...files]);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("add-image-input")?.click()}
            style={{
              border: "2px dashed #e8e8e8",
              padding: "1.5rem",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 6 }}>⬆</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#000" }}>
              Click or drag to add images
            </div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
              JPEG, PNG, WEBP · Auto-compressed to WebP on upload
            </div>
            <input
              id="add-image-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                if (!e.target.files) return;
                const files = Array.from(e.target.files);
                setPendingImages((prev) => [...prev, ...files]);
                e.target.value = "";
              }}
            />
          </div>

          {/* Preview pending images */}
          {pendingImages.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>
                {pendingImages.length} image
                {pendingImages.length > 1 ? "s" : ""} ready to upload
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5,1fr)",
                  gap: 6,
                }}
              >
                {pendingImages.map((file, i) => (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      aspectRatio: "1",
                      background: "#f5f5f5",
                      border: "1px solid #e8e8e8",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {i === 0 && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: "#000",
                          color: "#fff",
                          fontSize: 9,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          padding: "2px 4px",
                          textAlign: "center",
                        }}
                      >
                        Primary
                      </div>
                    )}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingImages((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        );
                      }}
                      style={{
                        position: "absolute",
                        top: 3,
                        right: 3,
                        background: "#000",
                        color: "#fff",
                        fontSize: 10,
                        width: 16,
                        height: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>
                First image will be set as primary. Images are uploaded after
                product is created.
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  async function handleDelete(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      console.log("handledelete");
      await adminApi.deleteProduct(String(p.id));
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
    } catch {
      alert("Failed to delete product");
    }
  }

  async function handleToggleSoldOut(p: Product) {
    try {
      const updated = (await adminApi.toggleSoldOut(
        String(p.id),
        !p.is_sold_out,
      )) as Product;
      setProducts((prev) =>
        prev.map((x) =>
          x.id === p.id ? { ...x, is_sold_out: updated.is_sold_out } : x,
        ),
      );
    } catch {
      alert("Failed to update stock status");
    }
  }

  const tabs = drawerMode === "edit" ? TABS_EDIT : TABS_ADD;

  // ── Info Tab ─────────────────────────────────────────────────
  // const InfoTab = (
  //   <div>
  //     <div style={S.sectionHead}>Basic Info</div>
  //     <div style={S.field}>
  //       <label style={S.label}>Product Name</label>
  //       <input
  //         style={S.input}
  //         value={form.name}
  //         onChange={(e) => setField("name", e.target.value)}
  //         placeholder="e.g. Classic Fit T-Shirt"
  //       />
  //     </div>
  //     <div style={{ ...S.grid2, marginBottom: 14 }}>
  //       <div style={S.field}>
  //         <label style={S.label}>SKU</label>
  //         <input
  //           style={S.input}
  //           value={form.sku}
  //           onChange={(e) => setField("sku", e.target.value)}
  //           placeholder="TSH-001"
  //         />
  //       </div>
  //       <div style={S.field}>
  //         <label style={S.label}>Slug</label>
  //         <input
  //           style={S.input}
  //           value={form.slug}
  //           onChange={(e) => setField("slug", e.target.value)}
  //           placeholder="classic-fit-t-shirt"
  //         />
  //       </div>
  //     </div>
  //     <div style={S.field}>
  //       <label style={S.label}>Description</label>
  //       <textarea
  //         style={S.textarea}
  //         value={form.description}
  //         onChange={(e) => setField("description", e.target.value)}
  //         placeholder="Product description..."
  //       />
  //     </div>
  //     <div style={S.grid2}>
  //       <div style={S.field}>
  //         <label style={S.label}>Category</label>
  //         <select
  //           style={{ ...S.input }}
  //           value={form.category_id}
  //           onChange={(e) => setField("category_id", e.target.value)}
  //         >
  //           {categories.map((c) => (
  //             <option key={c.id} value={c.id}>
  //               {c.name}
  //             </option>
  //           ))}
  //         </select>
  //       </div>
  //       <div style={S.field}>
  //         <label style={S.label}>Material</label>
  //         <select
  //           style={{ ...S.input }}
  //           value={form.material}
  //           onChange={(e) => setField("material", e.target.value)}
  //         >
  //           {materials.map((m) => (
  //             <option key={m} value={m}>
  //               {m}
  //             </option>
  //           ))}
  //         </select>
  //       </div>
  //     </div>

  //     {/* ── Image upload — add mode only ── */}
  // {drawerMode === "add" && (
  //   <>
  //     <div style={S.sectionHead}>Product Images</div>
  //     <div
  //       onDrop={(e) => {
  //         e.preventDefault();
  //         const files = Array.from(e.dataTransfer.files).filter((f) =>
  //           ["image/jpeg", "image/png", "image/webp"].includes(f.type),
  //         );
  //         setPendingImages((prev) => [...prev, ...files]);
  //       }}
  //       onDragOver={(e) => e.preventDefault()}
  //       onClick={() => document.getElementById("add-image-input")?.click()}
  //       style={{
  //         border: "2px dashed #e8e8e8",
  //         padding: "1.5rem",
  //         textAlign: "center",
  //         cursor: "pointer",
  //       }}
  //     >
  //       <div style={{ fontSize: 24, marginBottom: 6 }}>⬆</div>
  //       <div style={{ fontSize: 13, fontWeight: 600, color: "#000" }}>
  //         Click or drag to add images
  //       </div>
  //       <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
  //         JPEG, PNG, WEBP · Auto-compressed to WebP on upload
  //       </div>
  //       <input
  //         id="add-image-input"
  //         type="file"
  //         accept="image/jpeg,image/png,image/webp"
  //         multiple
  //         style={{ display: "none" }}
  //         onChange={(e) => {
  //           if (!e.target.files) return;
  //           const files = Array.from(e.target.files);
  //           setPendingImages((prev) => [...prev, ...files]);
  //           e.target.value = "";
  //         }}
  //       />
  //     </div>

  //     {/* Preview pending images */}
  //     {pendingImages.length > 0 && (
  //       <div style={{ marginTop: 12 }}>
  //         <div style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>
  //           {pendingImages.length} image
  //           {pendingImages.length > 1 ? "s" : ""} ready to upload
  //         </div>
  //         <div
  //           style={{
  //             display: "grid",
  //             gridTemplateColumns: "repeat(5,1fr)",
  //             gap: 6,
  //           }}
  //         >
  //           {pendingImages.map((file, i) => (
  //             <div
  //               key={i}
  //               style={{
  //                 position: "relative",
  //                 aspectRatio: "1",
  //                 background: "#f5f5f5",
  //                 border: "1px solid #e8e8e8",
  //                 overflow: "hidden",
  //               }}
  //             >
  //               <img
  //                 src={URL.createObjectURL(file)}
  //                 alt={file.name}
  //                 style={{
  //                   width: "100%",
  //                   height: "100%",
  //                   objectFit: "cover",
  //                 }}
  //               />
  //               {i === 0 && (
  //                 <div
  //                   style={{
  //                     position: "absolute",
  //                     bottom: 0,
  //                     left: 0,
  //                     right: 0,
  //                     background: "#000",
  //                     color: "#fff",
  //                     fontSize: 9,
  //                     fontWeight: 700,
  //                     textTransform: "uppercase",
  //                     letterSpacing: 0.5,
  //                     padding: "2px 4px",
  //                     textAlign: "center",
  //                   }}
  //                 >
  //                   Primary
  //                 </div>
  //               )}
  //               <div
  //                 onClick={(e) => {
  //                   e.stopPropagation();
  //                   setPendingImages((prev) =>
  //                     prev.filter((_, idx) => idx !== i),
  //                   );
  //                 }}
  //                 style={{
  //                   position: "absolute",
  //                   top: 3,
  //                   right: 3,
  //                   background: "#000",
  //                   color: "#fff",
  //                   fontSize: 10,
  //                   width: 16,
  //                   height: 16,
  //                   display: "flex",
  //                   alignItems: "center",
  //                   justifyContent: "center",
  //                   cursor: "pointer",
  //                 }}
  //               >
  //                 ×
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //         <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>
  //           First image will be set as primary. Images are uploaded after
  //           product is created.
  //         </div>
  //       </div>
  //     )}
  //   </>
  // )}
  //   </div>
  // );

  // // ── Pricing Tab ───────────────────────────────────────────────
  // const PricingTab = (
  //   <div>
  //     <div style={S.sectionHead}>Pricing</div>
  //     <div style={{ ...S.grid3, marginBottom: 14 }}>
  //       <div style={S.field}>
  //         <label style={S.label}>Price (₹)</label>
  //         <input
  //           style={S.input}
  //           type="number"
  //           value={form.price}
  //           onChange={(e) => setField("price", e.target.value)}
  //           placeholder="799"
  //         />
  //       </div>
  //       <div style={S.field}>
  //         <label style={S.label}>Original (₹)</label>
  //         <input
  //           style={S.input}
  //           type="number"
  //           value={form.original_price}
  //           onChange={(e) => setField("original_price", e.target.value)}
  //           placeholder="999"
  //         />
  //       </div>
  //       <div style={S.field}>
  //         <label style={S.label}>Discount (%)</label>
  //         <input
  //           style={S.input}
  //           type="number"
  //           value={form.discount}
  //           onChange={(e) => setField("discount", e.target.value)}
  //           placeholder="20"
  //         />
  //       </div>
  //     </div>
  //     <div style={S.sectionHead}>Sizes</div>
  //     {form.sizes.map((s, i) => (
  //       <div
  //         key={i}
  //         style={{
  //           display: "flex",
  //           gap: 8,
  //           alignItems: "center",
  //           marginBottom: 8,
  //         }}
  //       >
  //         <input
  //           style={{ ...S.input, flex: 1 }}
  //           value={s.label}
  //           onChange={(e) => updateSize(i, "label", e.target.value)}
  //           placeholder="Label e.g. S"
  //         />
  //         <input
  //           style={{ ...S.input, flex: 1 }}
  //           type="number"
  //           value={s.price}
  //           onChange={(e) => updateSize(i, "price", e.target.value)}
  //           placeholder="Price ₹"
  //         />
  //         <button
  //           onClick={() => removeSize(i)}
  //           style={{
  //             background: "none",
  //             border: "none",
  //             color: "#c0392b",
  //             fontSize: 18,
  //             cursor: "pointer",
  //             padding: "0 4px",
  //             lineHeight: 1,
  //           }}
  //         >
  //           ×
  //         </button>
  //       </div>
  //     ))}
  //     <button
  //       onClick={addSize}
  //       style={{
  //         fontSize: 11,
  //         fontWeight: 600,
  //         textTransform: "uppercase" as const,
  //         letterSpacing: 0.5,
  //         color: "#000",
  //         background: "none",
  //         border: "1px solid #e8e8e8",
  //         padding: "6px 12px",
  //         cursor: "pointer",
  //         marginTop: 4,
  //       }}
  //     >
  //       + Add Size
  //     </button>
  //   </div>
  // );

  // // ── Flags Tab ─────────────────────────────────────────────────
  // const FlagsTab = (
  //   <div>
  //     <div style={S.sectionHead}>Product Flags</div>
  //     <ToggleRow
  //       label="New Arrival"
  //       sub="Show in new arrivals section on storefront"
  //       value={form.is_new_arrival}
  //       onChange={(v) => setField("is_new_arrival", v)}
  //     />
  //     <ToggleRow
  //       label="Top Selling"
  //       sub="Show in top selling section on storefront"
  //       value={form.is_top_selling}
  //       onChange={(v) => setField("is_top_selling", v)}
  //     />
  //     <ToggleRow
  //       label="Customizable"
  //       sub="Allow customers to add custom text or notes"
  //       value={form.is_customizable}
  //       onChange={(v) => setField("is_customizable", v)}
  //     />
  //     <ToggleRow
  //       label="Sold Out"
  //       sub="Mark as unavailable — customers cannot add to cart"
  //       value={form.is_sold_out}
  //       onChange={(v) => setField("is_sold_out", v)}
  //     />
  //   </div>
  // );

  // const TAB_CONTENT = [InfoTab, PricingTab, FlagsTab];

  return (
    <div style={S.page}>
      {/* Topbar */}
      <div style={S.topbar}>
        <div style={S.topLeft}>
          <span style={S.title}>Products</span>
          <input
            style={S.search}
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={S.select}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All status</option>
            <option value="in_stock">In Stock</option>
            <option value="sold_out">Sold Out</option>
            <option value="new">New Arrival</option>
            <option value="top">Top Selling</option>
          </select>
        </div>
        <button style={S.btn} onClick={openAdd}>
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div style={S.content}>
        <div style={S.tableWrap}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
          >
            <thead>
              <tr>
                {[
                  "Product",
                  "Price",
                  "Category",
                  "Rating",
                  "Stock",
                  "Flags",
                  "Actions",
                ].map((h) => (
                  <th key={h} style={S.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      ...S.td,
                      textAlign: "center",
                      color: "#888",
                      padding: "2rem",
                    }}
                  >
                    Loading products...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      ...S.td,
                      textAlign: "center",
                      color: "#888",
                      padding: "2rem",
                    }}
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td style={S.td}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            background: "#f0f0f0",
                            border: "1px solid #e8e8e8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            overflow: "hidden",
                          }}
                        >
                          {p.product_images?.[0] ? (
                            <img
                              src={p.product_images[0].url}
                              alt={p.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: 18 }}>📦</span>
                          )}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#000",
                            }}
                          >
                            {p.name}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#aaa",
                              marginTop: 1,
                              fontFamily: "monospace",
                            }}
                          >
                            {p.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={S.td}>
                      ₹{Number(p.price).toLocaleString("en-IN")}
                    </td>
                    <td style={S.td}>{p.categories?.name ?? "—"}</td>
                    <td style={S.td}>{Number(p.rating).toFixed(1)} ★</td>
                    <td style={S.td}>
                      {p.is_sold_out ? (
                        <Flag label="Sold Out" color="#c0392b" bg="#fdecea" />
                      ) : (
                        <Flag label="In Stock" color="#1a7a3c" bg="#eafaf1" />
                      )}
                    </td>
                    <td style={S.td}>
                      {p.is_new_arrival && (
                        <Flag label="New" color="#1a6fa8" bg="#e8f4fd" />
                      )}
                      {p.is_top_selling && (
                        <Flag label="Top" color="#1a7a3c" bg="#eafaf1" />
                      )}
                      {p.is_customizable && (
                        <Flag label="Custom" color="#b7770d" bg="#fef9e7" />
                      )}
                    </td>
                    <td style={S.td}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={S.btnAct} onClick={() => openEdit(p)}>
                          Edit
                        </button>
                        <button style={S.btnAct} onClick={() => openImages(p)}>
                          Images
                        </button>
                        <button
                          style={S.btnSold}
                          onClick={() => handleToggleSoldOut(p)}
                        >
                          {p.is_sold_out ? "In Stock" : "Sold Out"}
                        </button>
                        <button
                          style={S.btnDanger}
                          onClick={() => handleDelete(p)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer overlay */}
      {drawerMode && <div style={S.overlay} onClick={closeDrawer} />}

      {/* Drawer */}
      {/* Drawer */}
      {drawerMode && drawerMode !== "images" && (
        <div style={S.drawer}>
          <div style={{ ...S.drawerHead, background: "#000" }}>
            <span style={{ ...S.drawerTitle, color: "#fff" }}>
              {drawerMode === "add"
                ? "Add Product"
                : `Edit — ${editProduct?.name}`}
            </span>
            <button
              onClick={closeDrawer}
              style={{
                fontSize: 20,
                cursor: "pointer",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          {SingleForm}

          <div style={S.drawerFoot}>
            {error && (
              <span
                style={{ fontSize: 12, color: "#c0392b", marginRight: "auto" }}
              >
                {error}
              </span>
            )}
            <button style={S.btnGhost} onClick={closeDrawer}>
              Cancel
            </button>
            <button style={S.btn} onClick={handleSave} disabled={saving}>
              {saving
                ? saveStatus || "Saving..."
                : drawerMode === "add"
                  ? "Save Product"
                  : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Images drawer — separate, unchanged */}
      {drawerMode === "images" && editProduct && (
        <div style={S.drawer}>
          <div style={{ ...S.drawerHead, background: "#000" }}>
            <span style={{ ...S.drawerTitle, color: "#fff" }}>
              Images — {editProduct.name}
            </span>
            <button
              onClick={closeDrawer}
              style={{
                fontSize: 20,
                cursor: "pointer",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
          <ImageManager productId={editProduct.id} onClose={closeDrawer} />
        </div>
      )}
    </div>
  );
}
