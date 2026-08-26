// FIXME: Function is not so cool
type NestedObject = Record<string, unknown>

function nested(obj: NestedObject, keys: string[], val: unknown) {
  const lastKey = keys.pop()!

  const target = keys.reduce<NestedObject>((acc, key) => {
    if (typeof acc[key] !== 'object' || acc[key] === null) {
      acc[key] = {}
    }

    return acc[key] as NestedObject
  }, obj)

  target[lastKey] = val
}

export function getPrismaWhere(query?: string) {
  const where: Record<string, unknown> = {}
  if (!query) return where
  query.split(';').forEach((item) => {
    const [key, initial, ...rest] = item.split(':')
    const hasNested = rest.length >= 1
    let value: unknown = hasNested ? initial.concat(`:${rest.join(':')}`) : initial
    if (value === 'true') value = true
    if (value === 'false') value = false
    if (value === 'null') value = null
    if (typeof value === 'string') value = value.trim()
    if (key.endsWith('*')) {
      const name = key.slice(0, -1)
      nested(where, name.split('.'), {
        contains: value,
        mode: 'insensitive',
      })
      return
    }
    if (key.endsWith('!')) {
      const name = key.slice(0, -1)
      nested(where, name.split('.'), { not: value })
      return
    }
    if (key.endsWith('>')) {
      const name = key.slice(0, -1)
      nested(where, name.split('.'), { gte: value })
      return
    }
    if (key.endsWith('<')) {
      const name = key.slice(0, -1)
      nested(where, name.split('.'), { lte: value })
      return
    }
    nested(where, key.split('.'), value)
  })
  return where
}
