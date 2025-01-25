import { useTheme } from '@/components/theme-provider'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RoutesEnum } from '@/enums/routes.enum'
import { useIsMobile } from '@/hooks/use-mobile'
import { useBreadcrumb, useParsed, useShow } from '@refinedev/core'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import CreatorInfo from './creator-info'

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
          <CreatorInfo address={data?.data.createdBy} />
        </div>
      </div>
    </div>
  )
}

export default TokenShow
