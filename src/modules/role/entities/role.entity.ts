import { PermissionSelect} from '@/modules/permission/entities/permission.entity';
import { Prisma } from '@prisma/client';


export type RoleType = Prisma.RoleGetPayload<{
  select: typeof RoleSelect;
}>;
export const RoleSelect = {
  id: true,
  tenant: true,
  name: true,
  description: true,
  isProtected: true,
  permissions: {
    select: PermissionSelect
  }
};