import { useIsMobile } from '@/hooks/use-mobile'
import { flexRender } from '@tanstack/react-table'
import clsx from 'clsx'
import React from 'react'
import { Skeleton } from './ui/skeleton'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

interface Props {
  // children: React.ReactNode
  isLoading: boolean
  excludeColumnsInMobile: string[]
  getHeaderGroups: () => Array<{
    id: string
    headers: Array<{ id: string; column: { columnDef: { header: React.ReactNode } }; getContext: () => any }>
  }>
  getRowModel: () => {
    rows: Array<{
      id: string
      getVisibleCells: () => Array<{ id: string; column: { id: string; columnDef: { cell: React.ReactNode } }; getContext: () => any }>
    }>
  }
}

const ReactTableWrapper = ({ isLoading, getHeaderGroups, getRowModel, excludeColumnsInMobile }: Props) => {
  const isMobile = useIsMobile()
  return isLoading ? (
    <Table className="w-full table-fixed border-collapse border text-xs">
      <TableCaption>
        The best platform to browse <span className="text-sm font-medium leading-none text-primary">Ronin Network</span> meme coins.
      </TableCaption>
      <TableHeader>
        {getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              if (isMobile && excludeColumnsInMobile.includes(header.id)) return
              return <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {getRowModel().rows.length > 0 ? (
          getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => {
                if (isMobile && excludeColumnsInMobile.includes(cell.column.id)) {
                  return
                }
                return (
                  <TableCell
                    key={cell.id}
                    className={clsx('overflow-hidden truncate whitespace-nowrap')}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )
              })}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={getHeaderGroups()[0]?.headers.length || 1}
              className="text-center"
            >
              No data available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  ) : (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[728px] w-full rounded-xl">
        <p className="flex h-full items-center justify-center text-lg font-semibold">
          Spin-up can take as long as 30 seconds. Please be patient ❤️
        </p>
      </Skeleton>
    </div>
  )
}

export default ReactTableWrapper
