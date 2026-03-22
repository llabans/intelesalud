import { prisma } from '@/lib/db';
import { PROFESSIONAL_CATALOG, SPECIALTY_CATALOG } from '@/lib/platform/catalog';

const DEFAULT_SLOT_DURATION_MINUTES = 40;
const SLOT_HORIZON_DAYS = 21;

let _catalogSeeded = false;
const _patientSeeded = new Set();

function buildSlotId(slug, startTime) {
  const timestamp = startTime
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, '')
    .replace('T', '_');

  return `slot_${slug}_${timestamp}`;
}

function addMinutes(date, minutes) {
  const next = new Date(date);
  next.setMinutes(next.getMinutes() + minutes);
  return next;
}

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function buildUpcomingSlots(professional) {
  const now = new Date();
  const today = startOfDay(now);
  const slots = [];

  for (let offset = 0; offset < SLOT_HORIZON_DAYS; offset += 1) {
    const current = new Date(today);
    current.setDate(current.getDate() + offset);
    const hours = professional.schedule[current.getDay()] || [];

    for (const hour of hours) {
      const startTime = new Date(current);
      startTime.setHours(hour, 0, 0, 0);
      if (startTime <= now) {
        continue;
      }

      const defaultDuration =
        professional.services[0]?.durationMinutes || DEFAULT_SLOT_DURATION_MINUTES;
      slots.push({
        id: buildSlotId(professional.slug, startTime),
        startTime,
        endTime: addMinutes(startTime, defaultDuration),
      });
    }
  }

  return slots;
}

async function upsertSpecialties(db) {
  const specialtyMap = new Map();

  for (const specialty of SPECIALTY_CATALOG) {
    const record = await db.specialty.upsert({
      where: { slug: specialty.slug },
      update: {
        name: specialty.name,
        description: specialty.description,
        summary: specialty.summary,
        icon: specialty.icon,
        color: specialty.color,
      },
      create: {
        id: specialty.id,
        slug: specialty.slug,
        name: specialty.name,
        description: specialty.description,
        summary: specialty.summary,
        icon: specialty.icon,
        color: specialty.color,
      },
    });

    specialtyMap.set(specialty.slug, record);
  }

  return specialtyMap;
}

async function upsertProfessional(db, professional, specialtyMap) {
  const user = await db.user.upsert({
    where: { firebaseUid: professional.userUid },
    update: {
      name: `${professional.firstName} ${professional.lastName}`,
      email: `${professional.slug}@intelesalud.medicalcore.app`,
      image: professional.photoUrl,
      role: 'SPECIALIST',
    },
    create: {
      firebaseUid: professional.userUid,
      name: `${professional.firstName} ${professional.lastName}`,
      email: `${professional.slug}@intelesalud.medicalcore.app`,
      image: professional.photoUrl,
      role: 'SPECIALIST',
    },
  });

  const specialistProfile = await db.specialistProfile.upsert({
    where: { userId: user.id },
    update: {
      firstName: professional.firstName,
      lastName: professional.lastName,
      title: professional.title,
      bio: professional.bio,
      slug: professional.slug,
      photoUrl: professional.photoUrl,
      headline: professional.headline,
      experienceYears: professional.experienceYears,
      specialistYears: professional.specialistYears,
      university: professional.university,
      ratingAverage: professional.ratingAverage,
      ratingCount: professional.ratingCount,
      featured: professional.featured,
      licenseCode: professional.licenseCode,
    },
    create: {
      userId: user.id,
      firstName: professional.firstName,
      lastName: professional.lastName,
      title: professional.title,
      bio: professional.bio,
      slug: professional.slug,
      photoUrl: professional.photoUrl,
      headline: professional.headline,
      experienceYears: professional.experienceYears,
      specialistYears: professional.specialistYears,
      university: professional.university,
      ratingAverage: professional.ratingAverage,
      ratingCount: professional.ratingCount,
      featured: professional.featured,
      licenseCode: professional.licenseCode,
    },
  });

  for (const [index, specialtySlug] of professional.specialtySlugs.entries()) {
    const specialty = specialtyMap.get(specialtySlug);
    if (!specialty) {
      continue;
    }

    await db.specialistSpecialty.upsert({
      where: {
        specialistId_specialtyId: {
          specialistId: specialistProfile.id,
          specialtyId: specialty.id,
        },
      },
      update: {
        isPrimary: index === 0,
      },
      create: {
        specialistId: specialistProfile.id,
        specialtyId: specialty.id,
        isPrimary: index === 0,
      },
    });
  }

  for (const service of professional.services) {
    const specialty = specialtyMap.get(service.specialtySlug);
    if (!specialty) {
      continue;
    }

    await db.service.upsert({
      where: { id: service.id },
      update: {
        specialistId: specialistProfile.id,
        specialtyId: specialty.id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        durationMinutes: service.durationMinutes,
        price: service.price,
        currency: service.currency,
        isActive: true,
      },
      create: {
        id: service.id,
        specialistId: specialistProfile.id,
        specialtyId: specialty.id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        durationMinutes: service.durationMinutes,
        price: service.price,
        currency: service.currency,
        isActive: true,
      },
    });
  }

  for (const slot of buildUpcomingSlots(professional)) {
    await db.availabilitySlot.upsert({
      where: { id: slot.id },
      update: {
        specialistId: specialistProfile.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
      },
      create: {
        id: slot.id,
        specialistId: specialistProfile.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
      },
    });
  }

  return specialistProfile;
}

export async function ensurePlatformCatalog(db = prisma) {
  if (_catalogSeeded) return;

  const specialtyMap = await upsertSpecialties(db);
  const specialists = [];

  for (const professional of PROFESSIONAL_CATALOG) {
    const specialist = await upsertProfessional(db, professional, specialtyMap);
    specialists.push(specialist);
  }

  _catalogSeeded = true;

  return {
    specialties: Array.from(specialtyMap.values()),
    specialists,
  };
}

export async function ensurePatientPortalData(user, db = prisma) {
  if (!user) {
    return null;
  }

  if (_patientSeeded.has(user.id)) {
    return db.patientProfile.findUnique({ where: { userId: user.id } });
  }

  const fullName = user.name?.trim() || user.email || 'Paciente InteleSalud';
  const [firstName, ...rest] = fullName.split(' ');
  const lastName = rest.join(' ') || 'Paciente';

  const patientProfile = await db.patientProfile.upsert({
    where: { userId: user.id },
    update: {
      firstName,
      lastName,
      fullName,
      phone: user.phone || undefined,
    },
    create: {
      userId: user.id,
      firstName,
      lastName,
      fullName,
      phone: user.phone || null,
    },
  });

  const documentsCount = await db.document.count({
    where: { patientId: patientProfile.id },
  });

  if (documentsCount === 0) {
    await db.document.createMany({
      data: [
        {
          patientId: patientProfile.id,
          kind: 'constancia',
          title: 'Constancia de orientacion inicial',
          summary: 'Documento mock de constancia emitida desde el portal del paciente.',
        },
        {
          patientId: patientProfile.id,
          kind: 'receta',
          title: 'Receta mock de teleconsulta',
          summary: 'Ejemplo de prescripcion digital no sensible para flujos demo del portal.',
        },
        {
          patientId: patientProfile.id,
          kind: 'resultado',
          title: 'Resultado mock de laboratorio',
          summary: 'Archivo clinico de ejemplo para mostrar biblioteca documental y seguimiento.',
        },
      ],
    });
  }

  const recordsCount = await db.clinicalRecord.count({
    where: { patientId: patientProfile.id },
  });

  if (recordsCount === 0) {
    await db.clinicalRecord.createMany({
      data: [
        {
          patientId: patientProfile.id,
          entryType: 'TRIAGE',
          title: 'Historia clinica digitalizada inicial',
          summary:
            'Registro mock del motivo de consulta, antecedentes principales y linea base para continuidad asistencial.',
        },
        {
          patientId: patientProfile.id,
          entryType: 'FOLLOW_UP',
          title: 'Seguimiento administrativo',
          summary:
            'Nota mock de seguimiento posterior a la orientacion inicial, preparada para evolucionar a flujo real.',
        },
      ],
    });
  }

  const assistantConversation = await db.assistantConversation.findFirst({
    where: {
      userId: user.id,
      channel: 'PORTAL',
    },
  });

  if (!assistantConversation) {
    const conversation = await db.assistantConversation.create({
      data: {
        userId: user.id,
        channel: 'PORTAL',
        title: 'Asistente InteleSalud',
      },
    });

    await db.assistantMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content:
          'Hola, soy el asistente administrativo de InteleSalud. Puedo ayudarte con reservas, estados de cita, documentos y siguientes pasos.',
      },
    });
  }

  _patientSeeded.add(user.id);

  return patientProfile;
}
