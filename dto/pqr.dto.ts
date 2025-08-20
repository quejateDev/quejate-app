import { Prisma } from "@prisma/client";

export type getGetPQRDTO = Prisma.PQRSGetPayload<{
    include: {
      creator: true;
      department: {
        include: {
          entity: true
        }
      };
      customFieldValues: true;
      likes: true;
    };
  }>;