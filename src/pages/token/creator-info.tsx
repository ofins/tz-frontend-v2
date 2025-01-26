import ImageWrapper from '@/components/image-wrapper'
import { Avatar } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RoutesEnum } from '@/enums/routes.enum'
import { RON_CONSTANT } from '@/utils/common'
import { useList } from '@refinedev/core'

const CreatorInfo = ({ address }: { address?: string }) => {
  const { data, isLoading } = useList({
    resource: RoutesEnum.TOKEN_HOLDERS,

    filters: [
      {
        field: 'holderAddress',
        operator: 'eq',
        value: address,
      },
      {
        field: 'sortBy',
        operator: 'eq',
        value: 'balance',
      },
      {
        field: 'sortDirection',
        operator: 'eq',
        value: 'desc',
      },
    ],
  })
  const removeSmallBal = data?.data.filter((holder) => Number(holder.balance) * RON_CONSTANT > 1) ?? []
  const allBalance = removeSmallBal.reduce((acc, curr) => Number(acc) + Number(curr.balance), 0) * RON_CONSTANT

  return (
    <Card className="h-fit w-full overflow-hidden p-3">
      {!isLoading ? (
        <>
          <div className="flex items-center gap-1">
            <h1 className="mb-1 scroll-m-20 text-xl font-semibold tracking-tight text-primary">{data?.data[0].holderAddress.name} </h1>
            {allBalance > 5000 ? '🐋' : allBalance > 1000 ? '🦈' : ''}
          </div>
          <code className="h-fit rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-semibold">
            {address}
            {/* {holder?.data?.items?.} */}
          </code>

          <h2 className="my-3">{"Top HODLs'"}</h2>
          {removeSmallBal?.map((holder, idx) => (
            <div
              className="mb-1 flex items-center justify-start gap-2"
              key={idx}
            >
              <Avatar className="h-7 w-7">
                <ImageWrapper
                  url={`https://black-changing-salmon-202.mypinata.cloud/ipfs/${holder.token.imageUrl}`}
                  className="h-5"
                />
              </Avatar>
              <h3>{holder.token.name}</h3>
              <h3 className="ml-auto">{(holder.balance * RON_CONSTANT).toFixed(2)} RON</h3>
            </div>
          ))}
        </>
      ) : (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )}
    </Card>
  )
}

export default CreatorInfo
