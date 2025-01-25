import { useTheme } from '@/components/theme-provider'
import { Avatar } from '@/components/ui/avatar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RoutesEnum } from '@/enums/routes.enum'
import { useIsMobile } from '@/hooks/use-mobile'
import { RON_CONSTANT } from '@/utils/common'
import { useBreadcrumb, useList, useParsed, useShow } from '@refinedev/core'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

const TokenShow = () => {
  const { breadcrumbs } = useBreadcrumb()
  const { theme } = useTheme()
  const isMobile = useIsMobile()
  const { id } = useParsed()
  const { queryResult } = useShow({
    resource: RoutesEnum.TOKENS,
    id,
  })

  const { data } = queryResult

  const { data: holder, isLoading: isLoadingHolder } = useList({
    resource: RoutesEnum.TOKEN_HOLDERS,

    filters: [
      {
        field: 'holderAddress',
        operator: 'eq',
        value: data?.data.createdBy,
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

  return (
    <div className="h-full w-full px-2">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map(({ label, href, icon }, idx) => (
            <>
              <BreadcrumbItem key={label}>
                <BreadcrumbLink href={href}>
                  {icon}
                  {label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {idx + 1 < breadcrumbs.length && <BreadcrumbSeparator />}
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className={twMerge(clsx('flex h-full w-full flex-col gap-3', { 'flex-row': !isMobile }))}>
        <div className="h-[90%] w-full">
          <div className="h-full w-full overflow-hidden rounded-md">
            <iframe
              height="100%"
              width="100%"
              id="geckoterminal-embed"
              title="GeckoTerminal Embed"
              src={`https://www.geckoterminal.com/ronin/pools/${id}?embed=1&info=0&swaps=0&grayscale=0&light_chart=${theme === 'light' ? 1 : 0}`}
              frameBorder="0"
              allow="clipboard-write"
              // allowfullscreen
            ></iframe>
          </div>
        </div>
        <div className="flex max-w-[800px] flex-col gap-3">
          <Card className="h-fit w-full p-3">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">Token Info</h1>
              <div className="flex space-x-2">
                <Button>
                  <a
                    href={`https://app.roninchain.com/liquidity/${data?.data.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Katana
                  </a>
                </Button>
                <Button className="bg-destructive">
                  <a
                    href={`https://tama.meme/token/${data?.data.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tama.Meme
                  </a>
                </Button>
              </div>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              {data && (
                <img
                  src={`https://black-changing-salmon-202.mypinata.cloud/ipfs/${data?.data.imageUrl}`}
                  alt={`Token Image: ${data?.data.id}`}
                  className="max-w-[200px] rounded-md"
                  onError={(e) => {
                    e.currentTarget.src = ''
                    e.currentTarget.alt = 'No Image'
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-primary">{data?.data.name}</h4>
              <code className="relative w-fit rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {data?.data.address}
              </code>

              <p className="mt-3">Description:</p>
              <small className="text-sm font-medium leading-none">{data?.data.description}</small>
            </div>
          </Card>
          <Card className="h-fit w-full p-3">
            {!isLoadingHolder ? (
              <>
                <h1 className="text-lg font-semibold">Creator Info</h1>
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-primary">{holder?.data[0].holderAddress.name}</h4>
                <code className="relative h-fit w-fit rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                  {data?.data.createdBy}
                  {/* {holder?.data?.items?.} */}
                </code>

                <h2 className="my-3">{"Top HODLs'"}</h2>
                {holder?.data.map((holder, idx) => (
                  <div
                    className="mb-1 flex items-center justify-start gap-2"
                    key={idx}
                  >
                    <Avatar className="h-7 w-7">
                      <img
                        src={`https://black-changing-salmon-202.mypinata.cloud/ipfs/${holder.token.imageUrl}`}
                        alt={`Token Image: ${holder.token.id}`}
                        onError={(e) => {
                          e.currentTarget.src = ''
                          e.currentTarget.alt = 'No Image'
                          e.currentTarget.style.display = 'none'
                        }}
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
        </div>
      </div>
    </div>
  )
}

export default TokenShow
