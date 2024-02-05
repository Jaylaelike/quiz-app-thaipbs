'use client';
import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

function BackButton() {
  const router = useRouter();
  return <button className="btn" onClick={() => router.back()}>
   <ChevronLeft /> Back
  </button>;
}

export default BackButton;
