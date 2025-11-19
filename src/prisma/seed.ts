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
    const image = 'https://holufitserve-production.up.railway.app/static/animals/crocodile.png';

    const user = await prisma.user.create({
      data: {
        image: image,
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

    const radioCategory = await prisma.radioCategory.create({
      data: {
        name: 'general'
      }
    });
    await prisma.radio.createMany({
      data: [
        {
          stationUUID: '777d14b2-f344-11e9-a96c-52543be04c81',
          name: 'Los 40 Dance',
          url: 'http://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_DANCE_SC',
          resolvedUrl: 'http://25443.live.streamtheworld.com:80/LOS40_DANCE_SC',
          image: 'https://recursosweb.prisaradio.com/fotos/original/010002753887.png',
          categoryId: radioCategory.id,
          genre: 'electro',
          country: 'Spain',
          bitrate: 128,
          codec: 'MP3',
          tags: ['dance', 'dance music', 'edm', 'electro', 'electronic', 'house'],
          languages: ['es'],
          createdBy: email,
        },
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
