import { prisma } from '@/lib/db';
import { ensurePlatformCatalog } from '@/lib/platform/bootstrap';
import { PROFESSIONAL_CATALOG, SPECIALTY_CATALOG } from '@/lib/platform/catalog';

function normalizeInt(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeFloat(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatSlotDate(date) {
  return new Intl.DateTimeFormat('es-PE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Lima',
  }).format(new Date(date));
}

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

function buildFallbackAvailability(professional) {
  const now = new Date();
  const slots = [];

  for (let offset = 0; offset < 21 && slots.length < 3; offset += 1) {
    const current = new Date(now);
    current.setHours(0, 0, 0, 0);
    current.setDate(current.getDate() + offset);

    const hours = professional.schedule?.[current.getDay()] || [];
    for (const hour of hours) {
      const startTime = new Date(current);
      startTime.setHours(hour, 0, 0, 0);

      if (startTime <= now) {
        continue;
      }

      slots.push({
        id: `slot_${professional.slug}_${startTime
          .toISOString()
          .replace(/[-:]/g, '')
          .replace(/\.\d{3}Z$/, '')
          .replace('T', '_')}`,
        startTime: startTime.toISOString(),
        formatted: formatSlotDate(startTime),
      });

      if (slots.length >= 3) {
        break;
      }
    }
  }

  return slots;
}

function serializeFallbackProfessional(professional) {
  const specialties = professional.specialtySlugs
    .map((slug) => SPECIALTY_CATALOG.find((specialty) => specialty.slug === slug))
    .filter(Boolean);

  return {
    id: professional.id,
    slug: professional.slug,
    name: [professional.firstName, professional.lastName].filter(Boolean).join(' '),
    title: professional.title,
    headline: professional.headline,
    bio: professional.bio,
    photoUrl: professional.photoUrl || '',
    experienceYears: professional.experienceYears,
    specialistYears: professional.specialistYears,
    university: professional.university,
    ratingAverage: professional.ratingAverage,
    ratingCount: professional.ratingCount,
    featured: professional.featured,
    licenseCode: professional.licenseCode,
    specialties: specialties.map((specialty, index) => ({
      id: specialty.id,
      slug: specialty.slug,
      name: specialty.name,
      isPrimary: index === 0,
    })),
    services: professional.services.map((service) => {
      const specialty =
        SPECIALTY_CATALOG.find((entry) => entry.slug === service.specialtySlug) || specialties[0];

      return {
        id: service.id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        durationMinutes: service.durationMinutes,
        price: service.price,
        currency: service.currency,
        specialty: specialty
          ? {
              id: specialty.id,
              slug: specialty.slug,
              name: specialty.name,
            }
          : null,
      };
    }),
    availability: buildFallbackAvailability(professional),
    schedule: professional.schedule || {},
  };
}

function applyFilters(professionals, filters) {
  return professionals.filter((professional) => {
    if (
      filters.minExperienceYears &&
      (professional.experienceYears || 0) < filters.minExperienceYears
    ) {
      return false;
    }

    if (
      filters.minSpecialistYears &&
      (professional.specialistYears || 0) < filters.minSpecialistYears
    ) {
      return false;
    }

    if (
      filters.university &&
      !`${professional.university || ''}`
        .toLowerCase()
        .includes(filters.university.toLowerCase())
    ) {
      return false;
    }

    if (filters.minRating && (professional.ratingAverage || 0) < filters.minRating) {
      return false;
    }

    if (
      filters.specialty &&
      !professional.specialties.some((specialty) => specialty.slug === filters.specialty)
    ) {
      return false;
    }

    return true;
  });
}

export function parseProfessionalFilters(searchParams = {}) {
  return {
    specialty: searchParams.specialty || '',
    minExperienceYears: normalizeInt(searchParams.minExperienceYears),
    minSpecialistYears: normalizeInt(searchParams.minSpecialistYears),
    university: searchParams.university || '',
    minRating: normalizeFloat(searchParams.minRating),
  };
}

export async function listSpecialties() {
  if (!hasDatabaseUrl()) {
    return [...SPECIALTY_CATALOG].sort((a, b) => a.name.localeCompare(b.name));
  }

  await ensurePlatformCatalog(prisma);

  return prisma.specialty.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function listProfessionals(filters = {}) {
  if (!hasDatabaseUrl()) {
    return applyFilters(
      PROFESSIONAL_CATALOG.map((professional) =>
        serializeFallbackProfessional(professional)
      ),
      filters
    ).sort((a, b) => {
      if (a.featured !== b.featured) {
        return Number(b.featured) - Number(a.featured);
      }

      return (b.ratingAverage || 0) - (a.ratingAverage || 0);
    });
  }

  await ensurePlatformCatalog(prisma);

  const where = {
    ...(filters.minExperienceYears
      ? { experienceYears: { gte: filters.minExperienceYears } }
      : {}),
    ...(filters.minSpecialistYears
      ? { specialistYears: { gte: filters.minSpecialistYears } }
      : {}),
    ...(filters.university
      ? { university: { contains: filters.university, mode: 'insensitive' } }
      : {}),
    ...(filters.minRating ? { ratingAverage: { gte: filters.minRating } } : {}),
    ...(filters.specialty
      ? {
          specialties: {
            some: {
              specialty: {
                slug: filters.specialty,
              },
            },
          },
        }
      : {}),
  };

  const professionals = await prisma.specialistProfile.findMany({
    where,
    include: {
      user: true,
      services: {
        where: { isActive: true },
        include: {
          specialty: true,
        },
        orderBy: { price: 'asc' },
      },
      specialties: {
        include: {
          specialty: true,
        },
      },
      availability: {
        where: {
          isBooked: false,
          startTime: { gte: new Date() },
        },
        orderBy: { startTime: 'asc' },
        take: 3,
      },
    },
    orderBy: [{ featured: 'desc' }, { ratingAverage: 'desc' }],
  });

  return professionals.map((professional) => {
    const seedProfessional = PROFESSIONAL_CATALOG.find(
      (entry) => entry.slug === professional.slug
    );

    return {
      id: professional.id,
      slug: professional.slug,
      name:
        professional.user?.name ||
        [professional.firstName, professional.lastName].filter(Boolean).join(' '),
      title: professional.title,
      headline: professional.headline,
      bio: professional.bio,
      photoUrl: professional.photoUrl || professional.user?.image || '',
      experienceYears: professional.experienceYears,
      specialistYears: professional.specialistYears,
      university: professional.university,
      ratingAverage: professional.ratingAverage,
      ratingCount: professional.ratingCount,
      featured: professional.featured,
      licenseCode: professional.licenseCode,
      specialties: professional.specialties.map((entry) => ({
        id: entry.specialty.id,
        slug: entry.specialty.slug,
        name: entry.specialty.name,
        isPrimary: entry.isPrimary,
      })),
      services: professional.services.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        durationMinutes: service.durationMinutes,
        price: service.price,
        currency: service.currency,
        specialty: {
          id: service.specialty.id,
          slug: service.specialty.slug,
          name: service.specialty.name,
        },
      })),
      availability: professional.availability.map((slot) => ({
        id: slot.id,
        startTime: slot.startTime,
        formatted: formatSlotDate(slot.startTime),
      })),
      schedule: seedProfessional?.schedule || {},
    };
  });
}

export async function getProfessionalFilterOptions() {
  if (!hasDatabaseUrl()) {
    return {
      specialties: [...SPECIALTY_CATALOG].sort((a, b) => a.name.localeCompare(b.name)),
      universities: [...new Set(PROFESSIONAL_CATALOG.map((professional) => professional.university).filter(Boolean))].sort(),
      experienceOptions: [5, 10, 15],
      specialistYearsOptions: [3, 5, 10],
      ratingOptions: [3.5, 4, 4.5, 4.8],
    };
  }

  const [specialties, professionals] = await Promise.all([
    listSpecialties(),
    prisma.specialistProfile.findMany({
      select: { university: true },
      distinct: ['university'],
      where: { university: { not: null } },
      orderBy: { university: 'asc' },
    }),
  ]);

  return {
    specialties,
    universities: professionals.map((professional) => professional.university).filter(Boolean),
    experienceOptions: [5, 10, 15],
    specialistYearsOptions: [3, 5, 10],
    ratingOptions: [3.5, 4, 4.5, 4.8],
  };
}
