import { Suspense } from "react";
import CheckoutSuccessContent from "@/components/CheckSuccesscontent";

export const dynamic = "force-dynamic";

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-secondary-background flex items-center justify-center">
          <p className="font-satoshi text-text-muted">Loading...</p>
        </main>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
