import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RoutesEnum } from '@/enums/routes.enum'
import { MC_CONSTANT } from '@/utils/common'
import { useTable } from '@refinedev/react-table'
import { type ColumnDef, flexRender } from '@tanstack/react-table'
import { Flame, Moon, Rocket } from 'lucide-react'
import { useEffect, useMemo } from 'react'

interface TokenListProps {
  ticker: string
  address: string
  name: string
  description: string
  imageUrl: string
  lastMcap: number
  createdAt: string
  User: { name: string }
}

const TokenList = () => {
  const columns = useMemo<ColumnDef<TokenListProps>[]>(
    () => [
      {
        id: 'ticker',
        header: 'Ticker',
        accessorKey: 'ticker',
        cell: ({ getValue }) => {
          const value = getValue()
          return (
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">{value as string}</code>
          )
        },
      },
      {
        id: 'address',
        header: 'Address',
        accessorKey: 'address',
      },
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
      },
      {
        id: 'description',
        header: 'Description',
        accessorKey: 'description',
      },
      {
        id: 'imageUrl',
        header: 'Image',
        accessorKey: 'imageUrl',
        cell: ({ getValue }) => {
          const value = getValue()
          return value ? (
            <img
              src={`https://gateway.pinata.cloud/ipfs/${value}`}
              alt={`Token Image: ${value}`}
              className="h-5"
              onError={(e) => {
                e.currentTarget.src = ''
                e.currentTarget.alt = 'No Image'
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            'No Image'
          )
        },
      },
      {
        id: 'lastMcap',
        header: 'Market Cap',
        accessorKey: 'lastMcap',
        cell: ({ getValue }) => {
          const value = Number(((getValue() as number) * MC_CONSTANT).toFixed())
          return (
            <div className="flex items-center justify-start overflow-hidden truncate whitespace-nowrap">
              {value}
              {value > 10000 && <Flame className="h-4" />}
              {value > 30000 && <Rocket className="h-4" />}
              {value > 50000 && <Moon className="h-4" />}
            </div>
          )
        },
      },
      {
        id: 'createdAt',
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: ({ getValue }) => {
          const date = getValue() as string
          return <span>{new Date(date).toLocaleString('en-US')}</span>
        },
      },
      {
        id: 'user',
        header: 'User',
        accessorKey: 'User.name',
      },
    ],
    []
  )

  const {
    getHeaderGroups,
    getRowModel,
    getState,
    nextPage,
    previousPage,
    setPageSize,
    refineCore: {
      tableQueryResult: { refetch, isLoading },
    },
  } = useTable({
    columns,
    refineCoreProps: {
      resource: RoutesEnum.TOKENS,
    },
  })

  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
      console.log('refetch', new Date().getTime())
    }, 60000)

    return () => clearInterval(interval)
  })

  useEffect(() => {
    setPageSize(20)
  }, [])

  return (
    <div className="max-w-screen w-full overflow-x-auto">
      <div className="mx-auto w-[99%] space-y-4">
        <p className="text-sm text-muted-foreground">{`last updated: ${new Date().toLocaleString('en-US')}`}</p>
        {isLoading && (
          <p className="text-md font-semibold">
            Just a broke dev using free hosting service. Spin-up can take as long as 30 seconds. Please be patient ❤️
          </p>
        )}
        <Table className="w-full table-fixed border-collapse border text-xs">
          <TableCaption>Most recent launched tokens</TableCaption>
          <TableHeader>
            {getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {getRowModel().rows.length > 0 ? (
              getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="overflow-hidden truncate whitespace-nowrap"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
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
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => previousPage()}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">{getState().pagination.pageIndex}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => nextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default TokenList
