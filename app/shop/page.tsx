// pages/CategoryPage.jsx or app/category/page.jsx
import FiltersSidebar from "@/components/FiltersSidebar";
import ProductGrid from "@/components/ProductGrid";
import BreadCrumb from "@/components/ui/BreadCrumb";

export default function ShopPage() {
    const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", },
  ];
  return (
    <main className="max-w-[1200px] mx-auto px-4 pb-6">
      {/* Breadcrumb */}
      <div className="py-[20px]"><BreadCrumb items={breadcrumbItems} /></div>

      {/* Page title + sort */}

      {/* Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Filters */}
        <aside className="col-span-12 md:col-span-3">
          <FiltersSidebar />
        </aside>

        {/* Products */}
        <section className="col-span-12 md:col-span-9">
          <ProductGrid />
        </section>
      </div>
    </main>
  );
}
