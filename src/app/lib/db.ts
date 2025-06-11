import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ['error', 'warn'],
  }).$extends({
    query: {
      $allOperations({ operation, model, args, query }) {
        const start = Date.now();
        return query(args).finally(() => {
          const end = Date.now();
          if (process.env.NODE_ENV === 'development') {
            console.log(`${model}.${operation} took ${end - start}ms`);
          }
        });
      },
    },
  });
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export const db = prisma;