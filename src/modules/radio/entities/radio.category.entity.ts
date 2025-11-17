import { Prisma } from "@prisma/client";

export type RadioCategoryType = Prisma.RadioCategoryGetPayload<{
  select: typeof RadioCategorySelect;
}>;

export const RadioCategorySelect = {
  id: true,
  name: true,
};

