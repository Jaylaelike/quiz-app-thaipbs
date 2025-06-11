"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSkeletonProps {
  type?: "questions" | "dashboard" | "general";
}

export default function LoadingSkeleton({ type = "general" }: LoadingSkeletonProps) {
  if (type === "questions") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card bg-white shadow-sm animate-pulse">
                <div className="card-body">
                  <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Questions List Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card bg-white shadow-sm animate-pulse">
                <div className="card-body">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
          <div className="container mx-auto px-6 py-8">
            <div className="h-10 bg-blue-400 rounded w-80 mb-2"></div>
            <div className="h-4 bg-blue-300 rounded w-96"></div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Stats Grid Skeleton */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card bg-white shadow-sm animate-pulse">
                <div className="card-body">
                  <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-12 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card bg-white shadow-sm animate-pulse">
              <div className="card-body">
                <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-white shadow-sm animate-pulse">
              <div className="card-body">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded w-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // General loading
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
        <div className="space-y-2">
          <p className="text-lg text-gray-600">กำลังโหลดข้อมูล...</p>
          <div className="w-32 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
