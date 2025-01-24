import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTable } from '@refinedev/core'

const TokenList = () => {
  // const { tableProps } = useTable<IPost>()

  const { tableQuery, current, setCurrent } = useTable({
    resource: 'v1/services/tokens',
  })

  const { data, isLoading } = tableQuery

  // const total = data?.total || 0
  // const tokens = data?.data || []

  return (
    <div className="space-y-4">
      <Table className="table-auto">
        <TableCaption>List of Tokens</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Market Cap</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>User</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            data?.data.map((token) => (
              <TableRow key={token.id}>
                <TableCell>{token.ticker}</TableCell>
                <TableCell>{token.address}</TableCell>
                <TableCell>{token.name}</TableCell>
                <TableCell>{token.description}</TableCell>
                <TableCell>
                  {token.image && (
                    <img
                      src={token.image}
                      alt={token.name}
                      className="h-10 w-10"
                    />
                  )}
                </TableCell>
                <TableCell>{token.marketCap}</TableCell>
                <TableCell>{new Date(token.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{token.user}</TableCell>
                <TableCell className="text-right">{token.amount}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setCurrent((prev) => Math.max(prev - 1, 1))}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">{current}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => setCurrent((prev) => prev + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default TokenList
