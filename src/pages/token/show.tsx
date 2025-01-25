import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RoutesEnum } from '@/enums/routes.enum'
import { useIsMobile } from '@/hooks/use-mobile'
import { useParsed, useShow } from '@refinedev/core'
import clsx from 'clsx'

const TokenShow = () => {
  const isMobile = useIsMobile()
  const { id } = useParsed()
  const { queryResult } = useShow({
    resource: RoutesEnum.TOKENS,
    id,
  })

  const { data } = queryResult
  console.log(data)

  return (
    <div className={clsx('h-full w-full px-2', { 'flex gap-3': !isMobile })}>
      <div className="h-[90%] w-full">
        <iframe
          height="100%"
          width="100%"
          id="geckoterminal-embed"
          title="GeckoTerminal Embed"
          src={`https://www.geckoterminal.com/ronin/pools/${id}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0`}
          frameBorder="0"
          allow="clipboard-write"
          allowfullscreen
        ></iframe>
      </div>
      <Card className="mt-2 h-fit w-full p-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Token Info</h1>
          <div className="flex space-x-2">
            <Button>Katana</Button>
            <Button className="bg-destructive">Tama.meme</Button>
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
    </div>
  )
}

export default TokenShow
