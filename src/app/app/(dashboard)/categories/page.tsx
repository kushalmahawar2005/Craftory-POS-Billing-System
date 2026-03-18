'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronDown, Plus, MoreVertical, 
  Search, RefreshCw, FolderPlus, Grid3X3, List,
  Smartphone, Laptop, Shirt, Gem, Home, Wrench, 
  Zap, PenTool, BookOpen, Dumbbell, Car, Sprout, 
  PawPrint, Utensils, Box, Truck, ShoppingCart, 
  Coffee, Cookie, Milk, Apple, User, Sparkles, 
  Baby, Activity, Trash2, Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

// Icon Map for Category Icons
const IconMap: Record<string, any> = {
  ShoppingCart, Coffee, Cookie, Milk, Apple, User, 
  Sparkles, Baby, Activity, Smartphone, Laptop, 
  Shirt, Gem, Home, Wrench, Zap, PenTool, BookOpen, 
  Dumbbell, Car, Sprout, PawPrint, Utensils, Box, 
  Truck, FolderPlus, Grid3X3, List
};

const CategoryNode = ({ 
  category, 
  level = 0, 
  expanded, 
  onToggle, 
  onAddSub 
}: { 
  category: any; 
  level?: number; 
  expanded: Record<string, boolean>; 
  onToggle: (id: string) => void; 
  onAddSub: (id: string) => void;
}) => {
  const isExpanded = expanded[category.id];
  const hasChildren = category.children && category.children.length > 0;
  
  return (
    <div className={`rounded-xl overflow-hidden transition-all ${level === 0 ? 'bg-white border border-gray-200 shadow-sm mb-4' : 'ml-6 mt-2'}`}>
      <div 
        className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 group ${level > 0 ? 'border-l-2 border-blue-200 bg-white/50' : ''}`}
        onClick={() => hasChildren && onToggle(category.id)}
      >
        <div className="flex items-center gap-3">
          {level === 0 && (
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}15`, color: category.color || '#3b82f6' }}>
              {IconMap[category.icon || 'Grid3X3'] ? React.createElement(IconMap[category.icon || 'Grid3X3'], { className: 'w-5 h-5' }) : <Grid3X3 className="w-5 h-5" />}
            </div>
          )}
          {level > 0 && (
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
          )}
          <div>
            <h3 className={`font-bold ${level === 0 ? 'text-gray-900' : 'text-sm text-gray-700'}`}>{category.name}</h3>
            {level === 0 && (
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {category.children?.length || 0} SECTIONS • {category._count?.products || 0} PRODUCTS
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
             <button 
               onClick={(e) => { e.stopPropagation(); onAddSub(category.id); }}
               className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
             >
               <Plus className="w-4 h-4" />
             </button>
             <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
               <Edit2 className="w-4 h-4" />
             </button>
             <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
               <Trash2 className="w-4 h-4" />
             </button>
          </div>
          {hasChildren ? (
            <div className="ml-2">
              {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
            </div>
          ) : <div className="w-6" />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pb-2 pr-2"
          >
            {category.children.map((child: any) => (
              <CategoryNode 
                key={child.id} 
                category={child} 
                level={level + 1} 
                expanded={expanded} 
                onToggle={onToggle}
                onAddSub={onAddSub}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [seeding, setSeeding] = useState(false);

  const fetchCategories = async (seed = false) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/categories${seed ? '?seed=true' : ''}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error('API returned non-array data:', data);
        setCategories([]);
        if (data.error) {
          alert('Error loading categories: ' + data.error);
        }
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSeed = async () => {
    setSeeding(true);
    await fetchCategories(true);
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all categories? This will re-seed industry-standard categories including deep hierarchies.')) {
      setLoading(true);
      try {
        const res = await fetch('/api/categories', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          await fetchCategories();
        } else {
          alert('Reset failed: ' + data.error);
        }
      } catch (err) {
        alert('Error resetting system');
      } finally {
        setLoading(false);
      }
    }
  };

  const recursiveSearch = (cats: any[]): any[] => {
    return cats.filter(cat => {
      const matchSelf = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchChildren = cat.children && recursiveSearch(cat.children).length > 0;
      return matchSelf || matchChildren;
    });
  };

  const filteredCategories = searchQuery ? recursiveSearch(categories) : categories;

  return (
    <div className="flex flex-col h-full bg-[#fbfbfb]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#111]">Product Categories</h1>
          <p className="text-xs text-gray-500 font-medium">Manage your multi-level product hierarchy</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-semibold hover:bg-red-100 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Reset System
          </button>
          <button 
            onClick={handleSeed}
            disabled={seeding || categories.length > 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
              categories.length > 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-50'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
            {seeding ? 'Seeding...' : 'Seed Industry Categories'}
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            <Plus className="w-4 h-4" />
            New Category
          </button>
        </div>
      </div>

      <div className="p-6 overflow-y-auto">
        {/* Search */}
        <div className="mb-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search categories (e.g. 'Gold', 'Rings')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-sm text-gray-500 font-medium">Crunching your categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Grid3X3 className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Categories Found</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm text-center">
              You haven't added any categories yet. Click the button below to seed industry categories.
            </p>
            <button 
              onClick={handleSeed}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Seed Industry Categories
            </button>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {filteredCategories.map((category) => (
              <CategoryNode 
                key={category.id} 
                category={category} 
                expanded={expanded} 
                onToggle={toggleExpand}
                onAddSub={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
