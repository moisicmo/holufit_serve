import { RoleSelect } from "@/modules/role/entities/role.entity";
import { BranchSelect } from "@/modules/branch/entities/branch.entity";
import { Prisma } from "@prisma/client";

export type UserEntity = Prisma.UserGetPayload<{
  select: typeof UserSelect;
}>;

export const UserSelect = {
  id: true,
  numberDocument: true,
  typeDocument: true,
  name: true,
  lastName: true,
  authProviders: { select: { email: true } },
  roles: { select: { role: { select: RoleSelect }, branch: { select: BranchSelect } } },
};