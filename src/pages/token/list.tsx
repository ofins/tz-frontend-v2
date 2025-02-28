import ImageWrapper from '@/components/image-wrapper'
import LinkWrapper from '@/components/link-wrapper'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { RoutesEnum } from '@/enums/routes.enum'
import { useIsMobile } from '@/hooks/use-mobile'
import { MC_CONSTANT } from '@/utils/common'
import { useNavigation } from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { type ColumnDef, flexRender } from '@tanstack/react-table'
import clsx from 'clsx'
import { ArrowBigUp, ExternalLinkIcon, Flame, Moon, Rocket, Star } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import rugger from '../../data/rugger.json'
import { getWatchlistAddresses } from '../watchlist/list'
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
const excludeColumnsInMobile = ['description', 'name', 'address', 'user', 'createdAt']

const TokenList = () => {
  const isMobile = useIsMobile()
  const { show } = useNavigation()
  const [searchTerm, setSearchTerm] = useState('')
  const starredAddresses = getWatchlistAddresses()
  const [watchlist, setWatchlist] = useState<string[]>(starredAddresses)

  const handleWatchlist = (address: string) => {
    setWatchlist((prev) => (prev.includes(address) ? prev.filter((o) => o !== address) : [...prev, address]))
  }

  const columns = useMemo<ColumnDef<TokenListProps>[]>(() => {
    return [
      {
        id: 'ticker',
        header: 'Ticker',
        accessorKey: 'ticker',
        cell: ({ getValue, row }) => {
          const value = getValue() as string
          const isStar = watchlist.includes(row.original.address)
          return (
            <div className="flex h-full cursor-pointer items-center justify-start gap-3">
              <AlertDialog>
                <AlertDialogTrigger>
                  <div className="h-full w-fit">
                    <Star className={twMerge(clsx('h-4 hover:scale-110', { 'opacity-10 hover:opacity-100': !isStar }))} />
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {isStar ? `Remove ${row.original.ticker} from your watchlist?` : `Add ${row.original.ticker} to your watchlist?`}
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        handleWatchlist(row.original.address)
                      }}
                    >
                      Yes
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <ImageWrapper
                url={`https://black-changing-salmon-202.mypinata.cloud/ipfs/${row.original.imageUrl}`}
                className="h-5 min-w-5 max-w-5"
              />
              <HoverCard>
                <HoverCardTrigger className="flex items-center">
                  <p
                    className="relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
                    onClick={() => show('tokens', row.original.address)}
                  >
                    {value}
                  </p>
                  {row.original.lastMcap * MC_CONSTANT > 7000 && Date.now() - Number(row.original.createdAt) < 600000 && (
                    <ArrowBigUp className="h-5 text-destructive" />
                  )}
                </HoverCardTrigger>
                <HoverCardContent>what would you like to see here?</HoverCardContent>
              </HoverCard>

              <LinkWrapper
                link={`https://tama.meme/token/${row.original.address}`}
                className="ml-auto"
              >
                <Tooltip>
                  <TooltipTrigger>
                    <ExternalLinkIcon className="h-4 hover:text-primary" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Tama.meme</p>
                  </TooltipContent>
                </Tooltip>
              </LinkWrapper>
            </div>
          )
        },
      },
      {
        id: 'address',
        header: 'Address',
        accessorKey: 'address',
        cell: ({ getValue }) => {
          const value = getValue() as string
          return (
            <code
              className="cursor-pointer truncate"
              onClick={() => show('tokens', value)}
            >
              {value}
            </code>
          )
        },
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
                <p className="w-[200px] cursor-auto truncate">{value}</p>
              </TooltipTrigger>
              <TooltipContent className="w-fit max-w-[200px]">
                <p className="text-xs">{value}</p>
              </TooltipContent>
            </Tooltip>
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
                <span className="pb-1 text-lg">{rugger.includes(row.original.User.address || '') ? '⚠️' : ''}</span>
              </HoverCardTrigger>
              <HoverCardContent className="w-fit">
                <CreatorInfo address={row.original.User.address} />
              </HoverCardContent>
            </HoverCard>
          )
        },
      },
    ]
  }, [isMobile, watchlist])

  const {
    getHeaderGroups,
    getRowModel,
    getState,
    nextPage,
    previousPage,
    setPageSize,
    refineCore: {
      tableQueryResult: { refetch, isLoading },
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
    }, 60000)

    return () => clearInterval(interval)
  })

  useEffect(() => {
    setPageSize(isMobile ? 15 : 15)
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
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
  }, [isMobile, watchlist])

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
        <span className="text-xs">Updates automatically every minute. Never miss a pump. 🚀</span>
        <span className="text-sm text-muted-foreground">{`last updated: ${new Date().toLocaleString('en-US')}`}</span>
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
        {!isLoading ? (
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
        )}
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
