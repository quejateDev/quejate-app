import { Prisma } from "@prisma/client";

export type getGetPQRDTO = Prisma.PQRSGetPayload<{
    include: {
      creator: true;
      department: true;
      customFieldValues: true;
      likes: true;
    };
  }>;