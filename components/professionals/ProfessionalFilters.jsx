import Link from 'next/link';

function buildHref(currentFilters, key, value) {
  const nextParams = new URLSearchParams();
  Object.entries({
    specialty: currentFilters.specialty || '',
    minExperienceYears: currentFilters.minExperienceYears || '',
    minSpecialistYears: currentFilters.minSpecialistYears || '',
    university: currentFilters.university || '',
    minRating: currentFilters.minRating || '',
  }).forEach(([paramKey, paramValue]) => {
    if (paramKey === key) {
      return;
    }

    if (paramValue) {
      nextParams.set(paramKey, `${paramValue}`);
    }
  });

  if (value) {
    nextParams.set(key, `${value}`);
  }

  const query = nextParams.toString();
  return query ? `?${query}` : '?';
}

function Chip({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? 'bg-slate-950 text-white'
          : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950'
      }`}
    >
      {children}
    </Link>
  );
}

export default function ProfessionalFilters({ currentFilters, filterOptions }) {
  return (
    <div className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-slate-950">Especialidad</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip href={buildHref(currentFilters, 'specialty', '')} active={!currentFilters.specialty}>
            Todas
          </Chip>
          {filterOptions.specialties.map((specialty) => (
            <Chip
              key={specialty.id}
              href={buildHref(currentFilters, 'specialty', specialty.slug)}
              active={currentFilters.specialty === specialty.slug}
            >
              {specialty.name}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-950">Anios de experiencia</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip href={buildHref(currentFilters, 'minExperienceYears', '')} active={!currentFilters.minExperienceYears}>
            Todos
          </Chip>
          {filterOptions.experienceOptions.map((value) => (
            <Chip
              key={`exp_${value}`}
              href={buildHref(currentFilters, 'minExperienceYears', value)}
              active={Number(currentFilters.minExperienceYears) === value}
            >
              {value}+ anios
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-950">Anios como especialista</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip href={buildHref(currentFilters, 'minSpecialistYears', '')} active={!currentFilters.minSpecialistYears}>
            Todos
          </Chip>
          {filterOptions.specialistYearsOptions.map((value) => (
            <Chip
              key={`spec_${value}`}
              href={buildHref(currentFilters, 'minSpecialistYears', value)}
              active={Number(currentFilters.minSpecialistYears) === value}
            >
              {value}+ anios
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-950">Universidad</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip href={buildHref(currentFilters, 'university', '')} active={!currentFilters.university}>
            Todas
          </Chip>
          {filterOptions.universities.map((university) => (
            <Chip
              key={university}
              href={buildHref(currentFilters, 'university', university)}
              active={currentFilters.university === university}
            >
              {university}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-950">Valoracion</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip href={buildHref(currentFilters, 'minRating', '')} active={!currentFilters.minRating}>
            Todas
          </Chip>
          {filterOptions.ratingOptions.map((value) => (
            <Chip
              key={`rating_${value}`}
              href={buildHref(currentFilters, 'minRating', value)}
              active={Number(currentFilters.minRating) === value}
            >
              {value}+ estrellas
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
