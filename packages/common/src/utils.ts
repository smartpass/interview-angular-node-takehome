import qs from 'qs'

export const formatUrl = (base: string, queryString?: unknown) => {
  const suffix = queryString ? `?${qs.stringify(queryString)}` : ''
  return `${base}${suffix}`
}
