export const UserSelect = {
  id: true,
  numberDocument: true,
  typeDocument: true,
  image: true,
  name: true,
  lastName: true,
  gender: true,
  birthDate: true,
  authProviders: true,
  weightRecords: true,
  habis: {
    select: {
      id: true,
      title: true,
      type: true,
      progress: {
        select: {
          id: true,
          status: true,
          progressDate: true,
          createdAt: true,
        }
      }
    }
  },
  dailyActivities: {
    select: {
      id: true,
      title: true,
      time: true,
      progress: {
        select: {
          id: true,
          status: true,
          progressDate: true,
          createdAt: true,
        }
      }
    }
  },
};