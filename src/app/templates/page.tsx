"use client";

import { Suspense } from "react";
import TemplateList from "@/components/TemplateList";
import LoadingQR from "@/components/LoadingQR";

export default function TemplatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <LoadingQR size="lg" />
          </div>
        }
      >
        <TemplateList />
      </Suspense>
    </div>
  );
}
