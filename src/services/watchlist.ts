import { RoutesEnum } from '@/enums/routes.enum'
import { BACKEND_API_URL } from '@/utils/common'
import { useCustom } from '@refinedev/core'

interface GetMultiTokenListPayload {
  addresses: string[]
  network: string
  include?: string[]
}

export const useGetMultiTokenList = (payload: GetMultiTokenListPayload) =>
  useCustom({
    url: `${BACKEND_API_URL}/${RoutesEnum.GECKO_TOKENS}`,
    method: 'post',
    config: {
      payload,
    },
  })
