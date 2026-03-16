'use client';

export default function AdjustmentsPage() {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-border overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Inventory Adjustments</h1>
          <p className="text-sm text-text-muted mt-0.5">Track and manage manual stock adjustments</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg shadow hover:bg-primary-dark transition-all">
          New Adjustment
        </button>
      </div>
      
      <div className="flex-1 p-6 flex items-center justify-center text-text-muted">
        Select 'New Adjustment' to record stock variations (damage, loss, extra).
      </div>
    </div>
  );
}
