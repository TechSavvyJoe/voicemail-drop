'use client'

import { useState, useMemo } from 'react'
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter,
  ArrowUpDown
} from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import { Badge } from './badge'
import { Card, CardContent } from './card'

interface Column<T> {
  key: keyof T
  header: string
  sortable?: boolean
  render?: (value: unknown, item: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  filterable?: boolean
  selectable?: boolean
  onSelectionChange?: (selected: T[]) => void
  onRowClick?: (item: T) => void
  loading?: boolean
  emptyMessage?: string
  bulkActions?: Array<{
    label: string
    icon?: React.ComponentType<{ className?: string }>
    action: (selected: T[]) => void
    variant?: 'default' | 'destructive'
  }>
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchable = true,
  filterable = false,
  selectable = false,
  onSelectionChange,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  bulkActions = []
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())
  const [filterOpen, setFilterOpen] = useState(false)

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = data

    // Apply search filter
    if (searchTerm && searchable) {
      filtered = filtered.filter(item =>
        columns.some(column => {
          const value = item[column.key]
          return String(value).toLowerCase().includes(searchTerm.toLowerCase())
        })
      )
    }

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn]
        const bValue = b[sortColumn]
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [data, searchTerm, sortColumn, sortDirection, columns, searchable])

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = () => {
    if (selectedRows.size === processedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(processedData.map(item => item.id)))
    }
  }

  const handleSelectRow = (id: string | number) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  // Notify parent of selection changes
  useMemo(() => {
    if (onSelectionChange) {
      const selectedItems = processedData.filter(item => selectedRows.has(item.id))
      onSelectionChange(selectedItems)
    }
  }, [selectedRows, processedData, onSelectionChange])

  const selectedItems = processedData.filter(item => selectedRows.has(item.id))

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        {/* Table Header with Search and Actions */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {searchable && (
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              )}
              
              {filterable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              )}
            </div>

            {/* Bulk Actions */}
            {selectable && selectedRows.size > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="mr-2">
                  {selectedRows.size} selected
                </Badge>
                {bulkActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'outline'}
                    size="sm"
                    onClick={() => action.action(selectedItems)}
                  >
                    {action.icon && <action.icon className="h-4 w-4 mr-1" />}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                {selectable && (
                  <th className="w-12 p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === processedData.length && processedData.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                      aria-label="Select all rows"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`text-left p-4 font-semibold text-slate-700 ${
                      column.sortable ? 'cursor-pointer hover:bg-slate-100' : ''
                    } ${column.width ? `w-[${column.width}]` : ''}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable && (
                        <div className="flex flex-col">
                          {sortColumn === column.key ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )
                          ) : (
                            <ArrowUpDown className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="text-center p-8 text-slate-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                processedData.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${selectedRows.has(item.id) ? 'bg-blue-50' : ''}`}
                    onClick={() => onRowClick?.(item)}
                  >
                    {selectable && (
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(item.id)}
                          onChange={(e) => {
                            e.stopPropagation()
                            handleSelectRow(item.id)
                          }}
                          className="rounded"
                          aria-label={`Select row ${item.id}`}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={String(column.key)} className="p-4">
                        {column.render
                          ? column.render(item[column.key], item)
                          : String(item[column.key] || '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination Info */}
        {processedData.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div>
                Showing {processedData.length} of {data.length} items
                {searchTerm && ` (filtered)`}
              </div>
              {selectable && selectedRows.size > 0 && (
                <div>
                  {selectedRows.size} item{selectedRows.size !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
