import { Prisma } from "@prisma/client";

export type RadioType = Prisma.RadioGetPayload<{
  select: typeof RadioSelect;
}>;

export const RadioSelect = {
  id: true,
  stationUUID: true,
  name: true,
  url: true,
  resolvedUrl: true,
  image: true,
  category: true,
  genre: true,
  country: true,
  description: true,
  bitrate: true,
  codec: true,
  isHls: true,
  isOnline: true,
  lastCheck: true,
  lastCheckOk: true,
  latitude: true,
  longitude: true,
  tags: true,
  languages: true,
  avgRating: true,
  ratingCount: true,
};

