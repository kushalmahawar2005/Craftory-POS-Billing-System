'use client';

import { Store, Grid3X3, List, Settings, Check } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-border overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">All Categories</h1>
          <p className="text-sm text-text-muted mt-0.5">Manage your product categories and hierarchy</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg shadow hover:bg-primary-dark transition-all">
          New Category
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto w-full">
        <div className="flex flex-col items-center py-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Grouping Items by Category</h2>
          <p className="text-sm text-gray-500 mb-6 font-medium">Add Categories to group items in a single variant.</p>
          
          <button className="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow hover:bg-blue-600 transition-colors uppercase tracking-wide mb-12">
            Add New Category
          </button>

          <div className="text-lg text-gray-600 font-medium mb-8">Life cycle of a Categories</div>

          {/* Flowchart Graphic strictly using CSS */}
          <div className="flex flex-col items-center w-[600px] mb-16 relative">
             <div className="px-6 py-2 bg-white border border-blue-200 text-blue-500 rounded text-sm shadow-sm flex items-center gap-2 mb-8 relative z-10 font-medium">
               <Store className="w-4 h-4 bg-blue-50" /> Store
             </div>

             {/* Tree branches */}
             <div className="border-t border-l border-r border-blue-200 w-1/2 h-8 absolute top-[40px] z-0 rounded-t-lg"></div>
             <div className="w-px h-8 bg-blue-200 absolute top-[40px] z-0"></div>

             <div className="flex justify-between w-3/4 mb-10 relative z-10">
               <div className="px-6 py-2 bg-white border border-blue-200 text-green-600 rounded text-sm shadow-sm flex items-center gap-2 font-medium">
                 <Grid3X3 className="w-4 h-4 bg-green-50" /> Main Category 1
               </div>
               
               {/* Connecting Line down for left node */}
               <div className="w-px h-16 bg-blue-200 absolute top-full left-[20%] -ml-4 z-0"></div>
               
               <div className="px-6 py-2 bg-white border border-blue-200 text-green-600 rounded text-sm shadow-sm flex items-center gap-2 font-medium">
                 <Grid3X3 className="w-4 h-4 bg-green-50" /> Main Category 2
               </div>
             </div>

             {/* Tertiary nodes row */}
             <div className="flex justify-between w-[95%] relative z-10">
               <div className="flex flex-col gap-4">
                 <div className="px-5 py-2 bg-white border border-blue-200 text-blue-500 rounded text-sm shadow-sm flex items-center gap-2 font-medium">
                    <List className="w-4 h-4" /> Sub-Category 1
                 </div>
                 {/* Tiny tree extending from sub category 1 */}
                 <div className="flex flex-col pl-6 border-l border-blue-200 ml-4 gap-4 mt-2 text-left">
                    <div className="relative text-xs text-green-600 font-medium flex items-center justify-start gap-2">
                      <div className="w-4 h-px bg-blue-200 absolute -left-[25px] top-1/2"></div>
                      By Brand
                    </div>
                    <div className="relative text-xs text-blue-500 font-medium flex items-center justify-start gap-2">
                      <div className="w-4 h-px bg-blue-200 absolute -left-[25px] top-1/2"></div>
                      By Model
                    </div>
                 </div>
               </div>
               
               <div className="px-4 py-2 bg-white border border-blue-200 text-blue-500 rounded text-sm shadow-sm flex items-center gap-2 h-max font-medium">
                 <List className="w-4 h-4" /> Sub-Category 2
                 <br/><div className="text-xs text-green-500 mt-2 flex items-center gap-1"><Grid3X3 className="w-3 h-3"/> By Type</div>
               </div>
               
               <div className="px-4 py-2 bg-white border border-blue-200 text-blue-500 rounded text-sm shadow-sm flex items-center gap-2 h-max font-medium">
                 <List className="w-4 h-4" /> Sub-Category 3
                 <br/><div className="text-xs text-green-500 mt-2 flex items-center gap-1"><Settings className="w-3 h-3"/> By Function</div>
               </div>
             </div>
          </div>

          <div className="w-full max-w-3xl text-left bg-transparent">
            <h4 className="font-bold text-gray-900 mb-4">Key Points:</h4>
            <ul className="space-y-4 text-sm text-gray-700">
              <li className="flex gap-3">
                 <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                 <p>Organising items into categories and subcategories makes it easier for customers to find what they're looking for, which can improve the customer experience and lead to more sales.</p>
              </li>
              <li className="flex gap-3">
                 <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                 <p>It can help you improve your inventory management, reduce costs, and increase customer satisfaction.</p>
              </li>
              <li className="flex gap-3">
                 <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                 <p>By grouping items together, you can create targeted marketing campaigns that reach the right customers. This can help to increase brand awareness and drive sales.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
