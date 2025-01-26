import { RoutesEnum } from '@/enums/routes.enum'
import { BACKEND_API_URL } from '@/utils/common'
import { useCustom } from '@refinedev/core'

export const useGetMultiTokenList = (payload: { addresses: string; network: string }) =>
  useCustom({
    url: `${BACKEND_API_URL}/${RoutesEnum.GECKO_TOKENS}`,
    method: 'post',
    config: {
      payload,
    },
  })
