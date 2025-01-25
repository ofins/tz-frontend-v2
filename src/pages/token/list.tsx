import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { RoutesEnum } from '@/enums/routes.enum'
import { useIsMobile } from '@/hooks/use-mobile'
import { MC_CONSTANT } from '@/utils/common'
import { useNavigation } from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { type ColumnDef, flexRender } from '@tanstack/react-table'
import clsx from 'clsx'
import { ArrowBigUp, ExternalLinkIcon, Flame, Moon, Rocket } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import CreatorInfo from './creator-info'

interface TokenListProps {
  ticker: string
  address: string
  name: string
  description: string
  imageUrl: string
  lastMcap: number
  createdAt: string
  launchTime: number
  User: { name: string; address: string }
}
const excludeColumnsInMobile = ['description', 'name', 'address', 'user']

const TokenList = () => {
  const isMobile = useIsMobile()
  const { show } = useNavigation()
  const [searchTerm, setSearchTerm] = useState('')

  const columns = useMemo<ColumnDef<TokenListProps>[]>(
    () => [
      {
        id: 'ticker',
        header: 'Ticker',
        accessorKey: 'ticker',
        cell: ({ getValue, row }) => {
          const value = getValue() as string
          return (
            <div className="flex justify-between">
              <HoverCard>
                <HoverCardTrigger className="flex items-center">
                  <code
                    onClick={() => show('tokens', row.original.address)}
                    className="relative cursor-pointer rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
                  >
                    {value}
                  </code>
                  {row.original.lastMcap * MC_CONSTANT > 7000 && Date.now() - Number(row.original.createdAt) < 600000 && (
                    <ArrowBigUp className="h-5 text-destructive" />
                  )}
                </HoverCardTrigger>
                <HoverCardContent>what would you like to see here?</HoverCardContent>
              </HoverCard>
              <a
                href={`https://tama.meme/token/${row.original.address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Tooltip>
                  <TooltipTrigger>
                    <ExternalLinkIcon className="h-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Tama.meme</p>
                  </TooltipContent>
                </Tooltip>
              </a>
            </div>
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
        cell: ({ getValue }) => {
          const value = getValue() as string
          return (
            <Tooltip>
              <TooltipTrigger>
                <p className="w-[200px] truncate">{value}</p>
              </TooltipTrigger>
              <TooltipContent className="w-fit max-w-[200px]">
                <p className="text-xs">{value}</p>
              </TooltipContent>
            </Tooltip>
          )
        },
      },
      {
        id: 'imageUrl',
        header: 'Avatar',
        accessorKey: 'imageUrl',
        cell: ({ getValue }) => {
          const value = getValue()
          return value ? (
            <img
              src={`https://black-changing-salmon-202.mypinata.cloud/ipfs/${value}`}
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
              ${value}
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
          const date = new Date(getValue() as string)
          return <span>{isMobile ? date.toLocaleDateString() : date.toLocaleString()}</span>
        },
      },
      {
        id: 'user',
        header: 'User',
        accessorKey: 'User.name',
        cell: ({ getValue, row }) => {
          const value = getValue() as string
          return (
            <HoverCard>
              <HoverCardTrigger>
                <span>{value}</span>
              </HoverCardTrigger>
              <HoverCardContent className="w-fit">
                <CreatorInfo address={row.original.User.address} />
              </HoverCardContent>
            </HoverCard>
          )
        },
      },
    ],
    [isMobile]
  )

  const {
    getHeaderGroups,
    getRowModel,
    getState,
    nextPage,
    previousPage,
    setPageSize,
    refineCore: {
      tableQueryResult: { refetch, isLoading, data },
      setFilters,
      filters,
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

      // data?.data.map((token: TokenListProps) => {
      //   console.log(token.ticker, Date.now() - Number(token.createdAt))
      //   if (Date.now() - Number(token.createdAt) < 600000 && token.lastMcap * MC_CONSTANT > 7000) {
      //     toast(`🚀 Is ${token.ticker} the next CAG?!`)
      //   }
      // })
    }, 60000)

    return () => clearInterval(interval)
  })

  useEffect(() => {
    setPageSize(isMobile ? 15 : 20)
    setFilters([
      {
        field: 'sortBy',
        operator: 'eq',
        value: 'lastMcap',
      },
      {
        field: 'sortDirection',
        operator: 'eq',
        value: 'desc',
      },
    ])
  }, [isMobile])

  const handleSearch = () => {
    setFilters([
      {
        field: 'searchTerm',
        operator: 'eq',
        value: searchTerm,
      },
    ])
  }

  return (
    <div className="max-w-screen w-full overflow-x-auto">
      <div className="mx-auto w-[99%] space-y-4">
        {isLoading && (
          <p className="text-md font-semibold">
            Just a broke dev using free hosting service. Spin-up can take as long as 30 seconds. Please be patient ❤️
          </p>
        )}
        <small className="text-sm font-medium leading-none">Navigate Ronin meme coins easily.</small>
        <p className="text-xs">Updates automatically every minute. Never miss a pump. 🚀</p>
        <p className="text-sm text-muted-foreground">{`last updated: ${new Date().toLocaleString('en-US')}`}</p>
        <div className="flex space-x-2">
          <Select
            value={filters?.find((f) => (f as any).field === 'sortBy')?.value}
            onValueChange={(value) => {
              setFilters((prev) => {
                const updatedFilters = prev.filter((filter) => (filter as any).field !== 'sortBy')
                updatedFilters.push({ field: 'sortBy', operator: 'eq', value })
                return updatedFilters
              })
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastFeatured">Featured</SelectItem>
              <SelectItem value="lastMcap">Market cap</SelectItem>
              <SelectItem value="createdAt">Recently launched</SelectItem>
              <SelectItem value="lastBuy">Last bumped</SelectItem>
              <SelectItem value="lastComment">Last replied</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="string"
            placeholder="search by ticker"
            className="w-[180px]"
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            value={searchTerm}
          />
          <Button onClick={() => handleSearch()}>Search</Button>
        </div>
        <Table className="w-full table-fixed border-collapse border text-xs">
          <TableCaption>Most recent launched tokens</TableCaption>
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
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => previousPage()}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">{getState().pagination.pageIndex + 1}</PaginationLink>
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
