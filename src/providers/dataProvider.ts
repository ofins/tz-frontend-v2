import type { DataProvider } from '@refinedev/core'
import { generateFilter, generateSort } from '@refinedev/simple-rest'
import type { AxiosInstance } from 'axios'
import { stringify } from 'query-string'
import { $axios } from '../services/axios'

type MethodTypes = 'get' | 'delete' | 'head' | 'options'
type MethodTypesWithBody = 'post' | 'put' | 'patch'

export const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = $axios
): Omit<Required<DataProvider>, 'createMany' | 'updateMany' | 'deleteMany'> => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${apiUrl}/${resource}`

    const { current = 1, pageSize = 25, mode = 'server' } = pagination ?? {}
    console.log(pageSize)
    const { headers: headersFromMeta, method } = meta ?? {}
    const requestMethod = (method as MethodTypes) ?? 'get'
    const queryFilters = generateFilter(filters)

    const query: {
      pageSize?: number
      current?: number
      sortBy?: string
      orderBy?: string
    } = {}

    if (mode === 'server') {
      query.current = current
      query.pageSize = pageSize
    }

    const generatedSort = generateSort(sorters)
    if (generatedSort) {
      const { _sort, _order } = generatedSort
      query.sortBy = _sort.join(',')
      query.orderBy = _order.join(',')
    }

    const combinedQuery = { ...query, ...queryFilters }
    const urlWithQuery = Object.keys(combinedQuery).length ? `${url}?${stringify(combinedQuery)}` : url

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient[requestMethod](urlWithQuery, {
      headers: headersFromMeta,
    })

    const data = res.data.data.items
    const total = res.data.data.pagination.total

    return {
      data,
      total: total || data?.length,
    }
  },

  getMany: async ({ resource, ids, meta }) => {
    const { headers, method } = meta ?? {}
    const requestMethod = (method as MethodTypes) ?? 'get'

    const { data } = await httpClient[requestMethod](`${apiUrl}/${resource}?${stringify({ id: ids })}`, { headers })

    return {
      data,
    }
  },

  create: async ({ resource, variables, meta }) => {
    const url = `${apiUrl}/${resource}`

    const { headers, method } = meta ?? {}
    const requestMethod = (method as MethodTypesWithBody) ?? 'post'

    const { data } = await httpClient[requestMethod](url, variables, {
      headers,
    })

    return {
      data,
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    let url
    if (id === 'undefined') url = `${apiUrl}/${resource}`
    else url = `${apiUrl}/${resource}/${id}`

    const { headers, method } = meta ?? {}
    const requestMethod = (method as MethodTypesWithBody) ?? 'put'

    const { data } = await httpClient[requestMethod](url, variables, {
      headers,
    })

    return {
      data,
    }
  },

  getOne: async ({ resource, id, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`

    const { headers, method } = meta ?? {}
    const requestMethod = (method as MethodTypes) ?? 'get'

    const { data } = await httpClient[requestMethod](url, { headers })

    return {
      data: data.data,
    }
  },

  deleteOne: async ({ resource, id, variables, meta }) => {
    // const url = `${apiUrl}/${resource}/${id}`
    let url
    if (id === 'undefined') url = `${apiUrl}/${resource}`
    else url = `${apiUrl}/${resource}/${id}`

    const { headers, method } = meta ?? {}
    const requestMethod = (method as MethodTypesWithBody) ?? 'delete'

    const { data } = await httpClient[requestMethod](url, {
      data: variables,
      headers,
    })

    return {
      data,
    }
  },

  getApiUrl: () => {
    return apiUrl
  },

  custom: async ({ url, method, filters, sorters, payload, query, headers }) => {
    let requestUrl = `${url}?`

    if (sorters) {
      const generatedSort = generateSort(sorters)
      if (generatedSort) {
        const { _sort, _order } = generatedSort
        const sortQuery = {
          _sort: _sort.join(','),
          _order: _order.join(','),
        }
        requestUrl = `${requestUrl}&${stringify(sortQuery)}`
      }
    }

    if (filters) {
      const filterQuery = generateFilter(filters)
      requestUrl = `${requestUrl}&${stringify(filterQuery)}`
    }

    if (query) {
      requestUrl = `${requestUrl}&${stringify(query)}`
    }

    let axiosResponse
    switch (method) {
      case 'put':
      case 'post':
      case 'patch':
        axiosResponse = await httpClient[method](url, payload, {
          headers,
        })
        break
      case 'delete':
        axiosResponse = await httpClient.delete(url, {
          data: payload,
          headers: headers,
        })
        break
      default:
        axiosResponse = await httpClient.get(requestUrl, {
          headers,
        })
        break
    }

    const { data } = axiosResponse

    return Promise.resolve({ data })
  },
})
