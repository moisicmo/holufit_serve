import { BranchSelect } from "@/modules/branch/entities/branch.entity";
import { Prisma } from "@prisma/client";

export type TenantType = Prisma.TenantGetPayload<{
  select: typeof TenantSelect;
}>;

export const TenantSelect = {
  id: true,
  name: true,
  image: true,
  colors: true,
  branches: {
    select: BranchSelect
  }
};

