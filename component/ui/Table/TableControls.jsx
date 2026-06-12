import React from 'react';
import { Search, X, Download, Plus, ChevronDown, Layout, Grid } from 'lucide-react';
import { Input, Select, Button } from '../CustomUI';

const TableControls = ({
  searchTerm,
  setSearchTerm,
  searchPlaceholder = 'Search...',
  filters = [],
  activeFilters = {},
  onFilterChange,
  onResetFilters,
  onExport,
  onAdd,
  addLabel = 'Add record',
  showSearch = true,
  showFilters = true,
  showExport = true,
  showAdd = true,
  viewMode,
  setViewMode,
  customActions = null
}) => {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
      <div className="flex flex-wrap items-center gap-3">
        {showSearch && (
          <div className="relative w-full md:w-72 group">
            <Input 
              icon={Search}
              placeholder={searchPlaceholder} 
              className="bg-white dark:bg-slate-900 border-slate-200 focus:ring-primary/10 focus:border-primary/30 transition-all w-full rounded-sm h-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {showFilters && filters.map(filter => (
          <div key={filter.key} className="relative flex-1 min-w-[140px] md:flex-none">
            <Select 
              value={activeFilters[filter.key] || 'all'}
              onChange={(val) => onFilterChange(filter.key, val)}
              placeholder={`All ${filter.name}`}
              options={filter.options}
              className="w-full md:w-auto md:min-w-[150px] rounded-sm h-10"
            />
          </div>
        ))}

        {(searchTerm || Object.keys(activeFilters).some(k => activeFilters[k] && activeFilters[k] !== 'all')) && (
          <Button 
            variant="ghost"
            onClick={onResetFilters}
            className="text-[10px] font-bold text-slate-500 hover:text-red-500 transition-all px-4 h-10 rounded-sm flex items-center gap-2"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto">
        {showExport && (
          <Button 
            variant="secondary" 
            onClick={onExport} 
            className="flex-1 sm:flex-none h-10 whitespace-nowrap rounded-sm"
          >
            <Download className="h-3 w-3 mr-2 text-primary" />
            Export
          </Button>
        )}

        {setViewMode && (
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-sm border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-sm transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-850'}`}
              title="Table view"
            >
              <Layout size={16} />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-sm transition-all ${viewMode === 'card' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-850'}`}
              title="Card view"
            >
              <Grid size={16} />
            </button>
          </div>
        )}

        {showAdd && (
          <Button 
            onClick={onAdd} 
            className="flex-1 sm:flex-none h-10 rounded-sm"
          >
            <Plus className="h-3 w-3 mr-2" />
            {addLabel}
          </Button>
        )}

        {customActions}
      </div>
    </div>
  );
};

export default TableControls;
