import { AuthProviderType, FitnessGoal, Gender, PrismaClient, RoutineLevel, WorkoutIntensity } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaClient();

  try {

    const salt = bcrypt.genSaltSync(10);

    // datos de configuración
    await prisma.equipment.createMany({
      data: [
        { name: 'Cinta de correr', type: 'Máquina de cardio' },
        { name: 'Bicicleta estática', type: 'Máquina de cardio' },
        { name: 'Elíptica', type: 'Máquina de cardio' },
        { name: 'Remo', type: 'Máquina de cardio' },
        { name: 'Prensa de piernas', type: 'Máquina de fuerza' },
        { name: 'Máquina de pecho', type: 'Máquina de fuerza' },
        { name: 'Máquina de espalda', type: 'Máquina de fuerza' },
        { name: 'Mancuernas', type: 'Pesas libres' },
        { name: 'Barras olímpicas', type: 'Pesas libres' },
        { name: 'Kettlebells', type: 'Pesas libres' },
        { name: 'Bandas de resistencia', type: 'Accesorios de entrenamiento' },
        { name: 'Balones medicinales', type: 'Accesorios de entrenamiento' },
      ]
    });

    // rutinas 
    const routineWeigth = await prisma.routine.create({
      data: {
        name: 'Rutina de fuerza',
        goal: FitnessGoal.gain_muscle,
        level: RoutineLevel.beginner,
        description: 'Desarrolla la fuerza muscular mediante ejercicios de resistencia.',
        createdBy: 'system',
        routineDays: {
          create: [
            {
              dayOfWeek: 1,
              exercises: ['Sentadillas', 'Press de banca', 'Remo con barra'],
              createdBy: 'system',
              equipments: {
                connect: [{ id: 5 }, { id: 8 }, { id: 9 }]
              }
            },
            {
              dayOfWeek: 3,
              exercises: ['Peso muerto', 'Abdominales'],
              createdBy: 'system',
              equipments: {
                connect: [{ id: 5 }, { id: 8 }, { id: 9 }]
              }
            },
          ],
        },
      },
    });
    
    await prisma.routine.create({
      data: {
        name: 'Rutina de pérdida de peso',
        goal: FitnessGoal.lose_weight,
        level: RoutineLevel.intermediate,
        description: 'Combina ejercicios cardiovasculares y de fuerza para quemar grasa.',
        createdBy: 'system',
        routineDays: {
          create: [
            {
              dayOfWeek: 2,
              exercises: ['Cinta de correr', 'Entrenamiento en circuito'],
              createdBy: 'system',
              equipments: {
                connect: [{ id: 1 }]
              }
            },
            {
              dayOfWeek: 4,
              exercises: ['Bicicleta estática', 'Entrenamiento en intervalos'],
              createdBy: 'system',
              equipments: {
                connect: [{ id: 2 }]
              }
            }
           ],
        },
      },
    });
    
    await prisma.routine.create({
      data: {
        name: 'Rutina de tonificación',
        goal: FitnessGoal.maintain,
        level: RoutineLevel.advanced,
        description: 'Mejora la definición muscular y la resistencia general.',
        createdBy: 'system',
        routineDays: {
          create: [
            {
              dayOfWeek: 1,
              exercises: ['Entrenamiento con pesas', 'Abdominales'],
              createdBy: 'system',
              equipments: {
                connect: [{ id: 8 }, { id: 9 }]
              }
            }
           ],
        },
      },
    });
    
    await prisma.routine.create({
      data: {
        name: 'Rutina de resistencia',
        goal: FitnessGoal.improve_endurance,
        level: RoutineLevel.beginner,
        description: 'Aumenta la resistencia cardiovascular y muscular a través de entrenamientos prolongados.',
        createdBy: 'system',
        routineDays: {
          create: [
            {
              dayOfWeek: 3,
              exercises: ['Elíptica', 'Remo'],
              createdBy: 'system',
              equipments: {
                connect: [{ id: 3 }, { id: 4 }]
              } 
            },
            {
              dayOfWeek: 5,
              exercises: ['Cinta de correr', 'Bicicleta estática'],
              createdBy: 'system',
              equipments: {
                connect: [{ id: 1 }, { id: 2 }]
              }
            }
           ],
        },
      },
    });

    // datos de usuario trigger
    const numberDocument = '8405213';
    const name = 'shirley';
    const lastName = 'arias';
    const email = 'shirley.arias.mo@gmail.com';
    const password = '123123';

    const user = await prisma.user.create({
      data: {
        numberDocument: numberDocument,
        name: name,
        lastName: lastName,
        password: bcrypt.hashSync(password, salt),
        gender: Gender.female,
        birthDate: new Date('1999-05-15'),
        createdBy: email,
      },
    });

    await prisma.authProvider.create({
      data: {
        userId: user.id,
        provider: AuthProviderType.email,
        email: email,
        verified: true,
        createdBy: email,
      }
    });

    // asigando usuario a una rutina
    await prisma.userRoutine.create({
      data: {
        userId: user.id,
        routineId: routineWeigth.id,
        createdBy: email,
      }
    });

    //registro de log
    await prisma.workoutLog.create({
      data: {
        userId: user.id,
        routineId: routineWeigth.id,
        date: new Date(),
        durationMin: 45,
        intensity: WorkoutIntensity.medium,
        createdBy: email,
      }
    });

    // datos de tenant trigger
    const tenantName = 'GYM Holu Fit';
    const branchName = 'Casa Matriz';
    const branchCity = 'La Paz';
    const branchZone = 'Zona Sur';
    const branchDetail = 'Av. Siempre Viva #123';
    const branchLatitude = -16.500000;
    const branchLongitude = -68.150000;
    const planName = 'Plan Básico';
    const planDescription = 'Acceso a todas las instalaciones durante el horario laboral.';
    const planPrice = 29.99;
    const planDuration = 30;
    const planAccessDays = 5;
    const startTimeMonFri = '08:00';
    const endTimeMonFri = '22:00';
    const startTimeWeekend = '09:00';
    const endTimeWeekend = '16:00';
    const DayOfWeek = [1, 2, 3, 4, 5, 6, 7];


    const address = await prisma.address.create({
      data: {
        city: branchCity,
        zone: branchZone,
        detail: branchDetail,
        latitude: branchLatitude,
        longitude: branchLongitude,
        createdBy: email,
      },
    });


    const tenant = await prisma.tenant.create({
      data: {
        name: tenantName,
        createdBy: email,
      },
    });

    const branch = await prisma.branch.create({
      data: {
        addressId: address.id,
        name: branchName,
        tenantId: tenant.id,
        createdBy: email,
      },
    });

    const plan = await prisma.plan.create({
      data: {
        branchId: branch.id,
        name: planName,
        description: planDescription,
        price: planPrice,
        duration: planDuration,
        accessDays: planAccessDays,
        createdBy: email,
      },
    });

    await prisma.planSchedule.createMany({
      data: [
        ...DayOfWeek.map(day => ({
          dayOfWeek: day,
          startTime: (day >= 1 && day <= 5) ? startTimeMonFri : startTimeWeekend,
          endTime: (day >= 1 && day <= 5) ? endTimeMonFri : endTimeWeekend,
          planId: plan.id,
          createdBy: email,
        })),
      ]
    });

    console.log('✅ Datos de semilla insertados correctamente.');
  } catch (error) {
    console.error('❌ Error al insertar datos de semilla:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
