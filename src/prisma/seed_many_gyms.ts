import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const gymNames = [
  "Titan Gym", "PowerHouse Fitness", "Iron Factory", "Muscle Pro Gym",
  "Extreme Fit Club", "Urban Fitness Center", "EnergyZone Gym",
  "MegaForce Gym", "BodyTech Max", "ProActive Gym",
  "FitClub Elite", "The Stronghold", "Spartan Fitness",
  "PumpNation", "BeastMode Gym", "Coliseo Fitness",
  "Evolution Gym", "Athletic Republic", "Oxygen Fitness",
  "GymBox", "FlexLab", "Alpha Fitness", "Barbell Studio",
  "LevelUp Gym", "Peak Performance Gym", "Revive Fitness",
  "PrimeFit Gym", "Magma Fitness", "Urban Iron Gym",
  "SportLife Center", "Endurance Gym", "Gorilla Gym",
  "Fitness Lab Pro", "Muscle Arena", "ApexStrength",
  "The Workout Zone", "Impulse Gym", "Black Diamond Fitness",
  "Victory Gym", "Fitness Hub", "Galaxy Gym", "Next Level Fitness",
  "Impact Fitness", "Iron Temple", "Blade Fitness", "Fortress Gym",
  "Vigor Fitness", "Raptor Gym", "SteelWorks Gym"
];

// Para coordenadas aleatorias dentro de La Paz
function randomCoord(base: number, variation = 0.01) {
  return base + (Math.random() * variation - variation / 2);
}

export async function createManyGyms(quantity = 50, createdBy = "system@seed.com") {
  try {
    for (let i = 0; i < quantity; i++) {
      const name = gymNames[i] ?? `Gym ${i + 1}`;

      // Dirección aleatoria
      const address = await prisma.address.create({
        data: {
          city: "La Paz",
          zone: `Zona ${["Sur", "Norte", "Central", "Este", "Oeste"][i % 5]}`,
          detail: `Calle ${Math.floor(Math.random() * 200)} Nº ${100 + i}`,
          latitude: randomCoord(-16.5),
          longitude: randomCoord(-68.15),
          createdBy
        }
      });

      const tenant = await prisma.tenant.create({
        data: {
          name,
          createdBy
        }
      });

      const branch = await prisma.branch.create({
        data: {
          addressId: address.id,
          name: "Sucursal Principal",
          tenantId: tenant.id,
          createdBy
        }
      });

      const plan = await prisma.plan.create({
        data: {
          branchId: branch.id,
          name: "Plan Estándar",
          description: "Acceso a máquinas, cardio y áreas comunes.",
          price: 150 + Math.floor(Math.random() * 80),
          duration: 30,
          accessDays: 7,
          createdBy
        }
      });

      const schedules = [
        { start: "07:00", end: "22:00" }, // Lunes
        { start: "07:00", end: "22:00" }, // Martes
        { start: "07:00", end: "22:00" }, // Miércoles
        { start: "07:00", end: "22:00" }, // Jueves
        { start: "07:00", end: "22:00" }, // Viernes
        { start: "08:00", end: "20:00" }, // Sábado
        { start: "09:00", end: "14:00" }  // Domingo
      ];

      await prisma.planSchedule.createMany({
        data: schedules.map((s, idx) => ({
          dayOfWeek: idx + 1,
          startTime: s.start,
          endTime: s.end,
          planId: plan.id,
          createdBy
        }))
      });

      console.log(`🏋️ Gimnasio creado (${i + 1}/${quantity}): ${name}`);
    }

    console.log("🎉 Gyms creados correctamente.");
  } catch (error) {
    console.error("❌ Error creando gimnasios:", error);
  }
}

// ------------------------------
// MAIN RUNNER
// ------------------------------

async function main() {
  await createManyGyms(50, "system@seed.com");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
