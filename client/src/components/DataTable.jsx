'use client'

import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

/**
 * Client-side search over stringified row fields; renders children as table body or uses column renderers.
 */
export function DataTable({
  rows: rowsProp,
  columns,
  searchPlaceholder = 'Search…',
  searchKeys,
  emptyMessage = 'Nothing here yet.',
  noSearchResultsMessage = 'No matches for your search.',
  className = '',
}) {
  const [q, setQ] = useState('')
  const rows = Array.isArray(rowsProp) ? rowsProp : []

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return rows
    return rows.filter((row) => {
      const haystack = searchKeys
        .map((k) => String(row[k] ?? ''))
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [q, rows, searchKeys])

  const hasRows = rows.length > 0
  const hasQuery = q.trim().length > 0
  const emptyBecauseSearch = hasRows && filtered.length === 0 && hasQuery

  return (
    <div className={cn('space-y-3', className)}>
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={searchPlaceholder}
        className="max-w-sm"
      />
      <div className="rounded-xl border border-gray-200 dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-10 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {emptyBecauseSearch ? noSearchResultsMessage : emptyMessage}
                  </p>
                  {emptyBecauseSearch ? (
                    <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setQ('')}>
                      Clear search
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row, idx) => (
                <TableRow key={row.id ?? idx}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>{col.cell ? col.cell(row) : String(row[col.key] ?? '')}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
