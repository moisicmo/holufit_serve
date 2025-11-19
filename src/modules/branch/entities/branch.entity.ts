import { AddressSelect } from "@/common/entities/address.select";
import { Prisma } from "@prisma/client";

export type BranchType = Prisma.BranchGetPayload<{
  select: typeof BranchSelect;
}>;

export const BranchSelect = {
  id: true,
  name: true,
  phone: true,
  address: { select: AddressSelect },
  plan: {
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      duration: true,
      accessDays: true,
      schedules: {
        select: {
          id: true,
          dayOfWeek: true,
          startTime: true,
          endTime: true,
          active: true,
        }
      }
    }
  }
};

