import { Prisma } from '@prisma-generated/client'

type DeleteManyArgs<T, A> = Prisma.Exact<A, Prisma.Args<T, 'deleteMany'>>
type FindManyArgs<T, A> = Prisma.Exact<A, Prisma.Args<T, 'findMany'>>
type FindManyAndCountResult<T, A> = [Prisma.Result<T, A, 'findMany'>, number]

// FIXME: The use of extentions in Prisma Service is not useful and remove any
export async function deleteSoft<T, A>(this: T, args: DeleteManyArgs<T, A>): Promise<void> {
  ;(args as any).data = {
    deletedAt: new Date(),
  }

  await (this as any).updateMany(args)
}

export async function findManyAndCount<T, A>(
  this: T,
  args: FindManyArgs<T, A>,
): Promise<FindManyAndCountResult<T, A>> {
  return Promise.all([
    (this as any).findMany(args),
    (this as any).count({ where: (args as any).where }),
  ])
}
