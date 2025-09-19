"use client";
import { User } from "lucide-react";

export function DocumentSkeleton() {
  return (
    <div className="relative w-full h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden hover:border-gray-400 transition-all duration-200 hover:shadow-sm group">
      <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity">
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full gap-px">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="bg-gray-300 rounded-sm" />
          ))}
        </div>
      </div>

      <div className="relative p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
            <div className="space-y-1">
              <div className="w-24 h-2 bg-gray-300 rounded animate-pulse" />
              <div className="w-16 h-1.5 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-12 h-8 bg-gray-300 rounded animate-pulse" />
        </div>
        
        <div className="absolute top-4 right-4 w-16 h-20 bg-gray-200 rounded border border-gray-400 animate-pulse flex items-center justify-center">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        
        <div className="space-y-2 mt-4 pr-20">
          <div className="space-y-1">
            <div className="w-20 h-1.5 bg-gray-200 rounded animate-pulse" />
            <div className="w-32 h-2 bg-gray-300 rounded animate-pulse" />
          </div>
          
          <div className="space-y-1">
            <div className="w-16 h-1.5 bg-gray-200 rounded animate-pulse" />
            <div className="w-28 h-2 bg-gray-300 rounded animate-pulse" />
          </div>
          
          <div className="space-y-1">
            <div className="w-24 h-1.5 bg-gray-200 rounded animate-pulse" />
            <div className="w-36 h-2 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
        
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 group-hover:bg-opacity-80 transition-all duration-200">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
            Subir documento
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PNG, JPG, PDF hasta 10MB
          </p>
        </div>
      </div>
    </div>
  );
}