'use client';
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  Download, 
  Plus, 
  MoreHorizontal, 
  ChevronUp, 
  Filter, 
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { Badge } from '../Badge/Badge';
import { Table as CustomTable, TableHeader, TableBody, TableRow, TableHead, TableCell } from './BaseTable';
import '../ui.css';

/**
 * Reusable Centralized Table Component - Professional Enterprise Version
 */
const Table = ({ 
  columns = [], 
  data = [], 
  filters = [], 
  onAdd, 
  addLabel = 'Add Student',
  onExport,
  searchPlaceholder = 'Search records...',
  showSearch = true,
  showFilters = true,
  showExport = true,
  showAdd = true,
  actions = null,
  pagination = null,
  onPageChange = () => { }
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter and Search Logic
  const displayData = useMemo(() => {
    if (pagination) return data;

    let result = [...data];

    // Search
    if (searchTerm) {
      result = result.filter(row => 
        Object.values(row).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filters
    Object.keys(activeFilters).forEach(key => {
      if (activeFilters[key] && activeFilters[key] !== 'all') {
        result = result.filter(row => String(row[key]) === String(activeFilters[key]));
      }
    });

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, activeFilters, sortConfig, pagination]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
    setSortConfig({ key: null, direction: 'asc' });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Section with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-md border border-border shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {showSearch && (
            <div className="relative w-full sm:w-64 group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Search size={16} />
              </div>
              <Input 
                placeholder={searchPlaceholder} 
                className="pl-10 h-10 bg-slate-50 border-border/60 hover:border-slate-300 transition-all rounded-md text-sm font-medium" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}

          {showFilters && filters.map(filter => (
            <div key={filter.key} className="w-full sm:w-auto">
              <Select 
                value={activeFilters[filter.key] || 'all'}
                onValueChange={(val) => handleFilterChange(filter.key, val)}
                className="h-10 min-w-[140px] bg-slate-50 border-border/60 rounded-md text-[12px] font-semibold"
              >
                <option value="all">{filter.name}</option>
                {filter.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </div>
          ))}

          {(searchTerm || Object.keys(activeFilters).length > 0) && (
            <button 
              onClick={resetFilters}
              className="text-[11px] font-bold text-slate-500 hover:text-primary transition-all px-3 py-1.5 bg-slate-100 rounded-md flex items-center gap-2"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {showExport && (
            <Button 
              variant="outline" 
              onClick={onExport} 
              className="h-10 border-slate-200 bg-white hover:bg-slate-50 rounded-md px-4 text-[12px] font-semibold transition-all"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          {showAdd && (
            <Button 
              onClick={onAdd} 
              className="h-10 bg-primary text-white hover:bg-primary-dark rounded-md px-6 flex items-center gap-2 font-semibold text-[12px] transition-all shadow-md shadow-primary/10"
            >
              <Plus className="h-4 w-4" />
              {addLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white dark:bg-slate-900 rounded-md border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <CustomTable className="w-full border-separate border-spacing-0">
            <TableHeader>
              <TableRow className="bg-slate-50/50 dark:bg-slate-800/50">
                <TableHead className="w-12 px-5 py-4 border-b border-border">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer" 
                  />
                </TableHead>
                {columns.map((col, idx) => (
                  <TableHead 
                    key={idx} 
                    className={`px-5 py-4 text-[13px] font-semibold text-slate-500 dark:text-slate-400 font-header border-b border-border ${col.sortable ? "cursor-pointer select-none group/head hover:text-primary" : ""} ${col.className || ""}`}
                    onClick={() => col.sortable && handleSort(col.accessor)}
                  >
                    <div className="flex items-center gap-2">
                      {col.header}
                      {col.sortable && (
                        <div className="flex flex-col opacity-30 group-hover/head:opacity-100 transition-opacity">
                          <ChevronUp className={`h-3 w-3 -mb-0.5 ${sortConfig.key === col.accessor && sortConfig.direction === 'asc' ? 'text-primary opacity-100' : ''}`} />
                          <ChevronDown className={`h-3 w-3 ${sortConfig.key === col.accessor && sortConfig.direction === 'desc' ? 'text-primary opacity-100' : ''}`} />
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="px-5 text-right text-[13px] font-semibold text-slate-500 dark:text-slate-400 font-header border-b border-border">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((row, rowIdx) => (
                <TableRow 
                  key={rowIdx} 
                  className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all border-b border-slate-50 last:border-0"
                >
                  <TableCell className="px-5 py-4">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer" 
                    />
                  </TableCell>
                  {columns.map((col, colIdx) => (
                    <TableCell key={colIdx} className={`px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 ${col.className || ""}`}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </TableCell>
                  ))}
                  <TableCell className="px-5 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-all text-slate-400 hover:text-primary">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              
              {displayData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + 2} className="text-center py-24">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="text-slate-200 dark:text-slate-800">
                        <Search size={48} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-700 dark:text-white font-bold text-base">No synchronized records</p>
                        <p className="text-slate-400 text-[13px] font-medium">Try adjusting your search or filtering parameters.</p>
                      </div>
                      <button 
                        onClick={resetFilters}
                        className="mt-4 px-4 py-2 text-primary font-bold text-xs hover:bg-primary/5 rounded-md transition-all"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </CustomTable>
        </div>

        {/* Pagination Footer */}
        {pagination && (
          <div className="px-6 py-4 bg-slate-50/30 dark:bg-slate-900 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[12px] font-semibold text-slate-500">
              Showing <span className="text-slate-900 dark:text-white">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="text-slate-900 dark:text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-slate-900 dark:text-white">{pagination.total}</span> records
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-9 h-9 p-0 rounded-md border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-all"
                disabled={pagination.page <= 1}
                onClick={() => onPageChange(1)}
              >
                <ChevronsLeft size={18} className="text-slate-400 hover:text-primary" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-9 h-9 p-0 rounded-md border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-all"
                disabled={pagination.page <= 1}
                onClick={() => onPageChange(pagination.page - 1)}
              >
                <ChevronLeft size={18} className="text-slate-400 hover:text-primary" />
              </Button>

              <div className="flex items-center px-4 h-9 bg-white dark:bg-slate-800 rounded-md text-[13px] font-bold text-slate-700 border border-slate-200 shadow-sm">
                {pagination.page} / {pagination.totalPages || 1}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-9 h-9 p-0 rounded-md border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-all"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => onPageChange(pagination.page + 1)}
              >
                <ChevronRight size={18} className="text-slate-400 hover:text-primary" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-9 h-9 p-0 rounded-md border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-all"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => onPageChange(pagination.totalPages)}
              >
                <ChevronsRight size={18} className="text-slate-400 hover:text-primary" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
