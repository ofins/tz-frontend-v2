import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTable } from '@refinedev/react-table'
import { ColumnDef, flexRender } from '@tanstack/react-table'
import clsx from 'clsx'
import { useMemo, useState } from 'react'

interface GeckoTokenListProps {
  attributes: {
    name: string
    symbol: string
    price_usd: number
    market_cap_usd: number
    total_supply: number
  }
}

export const getWatchlistAddresses = () => {
  const addresses = localStorage.getItem('watchlist')
  return addresses ? JSON.parse(addresses) : []
}

const WatchList = () => {
  const [data, setData] = useState<GeckoTokenListProps[]>([])

  const columns = useMemo<ColumnDef<GeckoTokenListProps>[]>(
    () => [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'attributes.name',
      },
      {
        id: 'symbol',
        header: 'Symbol',
        accessorKey: 'attributes.symbol',
      },
      {
        id: 'price_usd',
        header: 'Price (USD)',
        accessorKey: 'attributes.price_usd',
        cell: ({ getValue }) => `$${Number(getValue()).toFixed(10)}`,
      },
      {
        id: 'market_cap_usd',
        header: 'Market Cap (USD)',
        accessorKey: 'attributes.market_cap_usd',
        cell: ({ getValue }) => `$${Number(getValue()).toLocaleString()}`,
      },
      {
        id: 'total_supply',
        header: 'Total Supply',
        accessorKey: 'attributes.total_supply',
        cell: ({ getValue }) => Number(getValue()).toLocaleString(),
      },
    ],
    []
  )

  const table = useTable({
    columns,
    data,
    refineCoreProps: {},
  })

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await $axios.post('http://localhost:3000/v1/services/gecko/tokens', {
  //         addresses: getWatchlistAddresses().join(','), // Example addresses: '0x1234111,0x5678111'
  //         network: 'ronin',
  //       })
  //       setData(response.data.data)
  //     } catch (error) {
  //       console.error('Failed to fetch data', error)
  //     }
  //   }

  //   fetchData()
  // }, [])

  return <div>coming soon</div>

  return (
    <div className="flex h-full w-full items-center justify-center space-x-3">
      <Table>
        <TableCaption>Watchlist</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={clsx('overflow-hidden truncate whitespace-nowrap')}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getHeaderGroups()[0]?.headers.length || 1}
                className="text-center"
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default WatchList
