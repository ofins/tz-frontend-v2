import { useCustom } from '@refinedev/core'

export const useGetMultiTokenList = (payload: { addresses: string; network: string }) =>
  useCustom({
    url: `http://localhost:3000/v1/services/gecko/tokens`,
    method: 'post',
    config: {
      payload,
    },
  })
