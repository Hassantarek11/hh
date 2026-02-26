import React from 'react';
import { motion } from 'motion/react';
import { categories } from '../data/mock';
import { cn } from '../lib/utils';
import * as Icons from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  onClose: () => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
}

export default function Sidebar({ isOpen, selectedCategory, onSelectCategory, onClose, maxPrice, setMaxPrice }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 right-0 bottom-0 w-64 glass border-l border-white/5 z-40 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 h-full overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            التصنيفات
          </h3>
          <div className="space-y-2">
            {categories.map((category) => {
              // Dynamically get icon
              const Icon = (Icons as any)[category.icon] || Icons.Box;
              
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    onSelectCategory(category.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    selectedCategory === category.id
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className={cn("w-5 h-5", selectedCategory === category.id ? "text-white" : "text-gray-500 group-hover:text-white")} />
                  <span className="font-medium">{category.name}</span>
                  {selectedCategory === category.id && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute right-0 w-1 h-8 bg-white rounded-l-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              الفلاتر
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-2 block flex justify-between">
                  <span>نطاق السعر</span>
                  <span className="text-purple-400 font-bold">${maxPrice}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>$0</span>
                  <span>$5000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
