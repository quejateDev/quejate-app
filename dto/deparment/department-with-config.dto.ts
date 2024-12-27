import { Prisma } from "@prisma/client";

export type DepartmentWithConfig = Prisma.DepartmentGetPayload<{
    include: {
        pqrConfig: true
    };
}>;