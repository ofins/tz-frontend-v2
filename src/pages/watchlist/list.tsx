import ImageWrapper from '@/components/image-wrapper'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useIsMobile } from '@/hooks/use-mobile'
import { useGetMultiTokenList } from '@/services/watchlist'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'

interface GeckoTokenListProps {
  attributes: {
    name: string
    symbol: string
    price_usd: number
    market_cap_usd: number
    total_supply: number
    image_url: string
    volume_usd: {
      h24: number
    }
  }
}

export const getWatchlistAddresses = () => {
  const addresses = localStorage.getItem('watchlist')
  return addresses ? JSON.parse(addresses) : []
}

const columnHelper = createColumnHelper<GeckoTokenListProps>()
const excludeColumnsInMobile = ['total_supply', 'volume_usd', 'name']

const WatchList = () => {
  const isMobile = useIsMobile()
  const [data, setData] = useState<GeckoTokenListProps[]>([])

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.attributes.symbol, {
        id: 'symbol',
        header: 'Ticker',
        cell: ({ getValue, row }) => {
          return (
            <div className="flex items-center gap-2">
              <ImageWrapper
                url={row.original.attributes.image_url}
                className="h-5"
              />
              <span>{getValue()}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor((row) => row.attributes.name, {
        id: 'name',
        header: 'Name',
      }),
      columnHelper.accessor((row) => row.attributes.price_usd, {
        id: 'price_usd',
        header: 'Price (USD)',
        cell: ({ getValue }) => <span className="min-w-[100x w-fit">{Number(getValue()).toFixed(10)}</span>,
      }),
      columnHelper.accessor((row) => row.attributes.market_cap_usd, {
        id: 'market_cap_usd',
        header: 'Market Cap (USD)',
        cell: ({ getValue, row }) => {
          const value = Number(getValue())
          return value.toLocaleString()
            ? `$${(Math.min(1000000000, row.original.attributes.total_supply) * row.original.attributes.price_usd).toLocaleString()}`
            : value.toLocaleString()
        },
      }),
      columnHelper.accessor((row) => row.attributes.total_supply, {
        id: 'total_supply',
        header: 'Total Supply',
        cell: ({ getValue }) => Math.min(getValue(), 1000000000).toLocaleString(),
      }),
      columnHelper.accessor((row) => row.attributes.volume_usd?.h24, {
        id: 'volume_usd',
        header: 'Volume (USD)',
        cell: ({ getValue }) => `$${Number(getValue()).toLocaleString()}`,
      }),
    ],
    [data]
  )

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  })

  const { data: tokenData, isLoading } = useGetMultiTokenList({ addresses: getWatchlistAddresses().join(','), network: 'ronin' })

  useEffect(() => {
    if (tokenData) {
      setData(
        tokenData.data.data.map((item: GeckoTokenListProps) => ({
          attributes: {
            name: item.attributes.name,
            symbol: item.attributes.symbol,
            price_usd: item.attributes.price_usd,
            market_cap_usd: item.attributes.market_cap_usd,
            total_supply: item.attributes.total_supply,
            image_url: item.attributes.image_url,
            volume_usd: {
              h24: item.attributes.volume_usd.h24,
            },
          },
        }))
      )
    }
  }, [tokenData])

  if (!getWatchlistAddresses().length) return <div>Your watchlist is empty. Add tokens first.</div>

  return (
    <div className="mx-auto w-[99%] space-y-4">
      {!isLoading ? (
        <Table className="w-full table-fixed border-collapse border text-xs">
          <TableCaption>
            Watch all your favorite tokens. <span className="text-[#A78BFA]">Powered by Gecko Terminal.</span>
          </TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (isMobile && excludeColumnsInMobile.includes(header.id)) return
                  return <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
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
                  colSpan={table.getHeaderGroups()[0]?.headers.length || 1}
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
              Currently do not make enough profit to host on paid-service. Spin-up can take as long as 30 seconds. Please be patient ❤️
            </p>
          </Skeleton>
        </div>
      )}
    </div>
  )
}

export default WatchList
