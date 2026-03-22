export const BRAND_NAME = 'InteleSalud';
export const DEFAULT_BOOKING_PATH = '/portal/agendar';

export const SPECIALTY_CATALOG = [
  {
    id: 'spec_general_medicine',
    slug: 'medicina-general',
    name: 'Medicina general',
    description: 'Primera consulta, chequeos integrales y continuidad de cuidado para adultos.',
    summary: 'Atencion integral para sintomas frecuentes, control preventivo y orientacion clinica.',
    icon: 'Stethoscope',
    color: 'from-sky-500/15 to-cyan-500/5',
  },
  {
    id: 'spec_pediatrics',
    slug: 'pediatria',
    name: 'Pediatria',
    description: 'Acompanamiento clinico para ninos, controles y dudas frecuentes del desarrollo.',
    summary: 'Evaluaciones de crecimiento, fiebre, infecciones comunes y seguimiento infantil.',
    icon: 'Baby',
    color: 'from-teal-500/15 to-emerald-500/5',
  },
  {
    id: 'spec_mental_health',
    slug: 'salud-mental',
    name: 'Salud mental',
    description: 'Consultas de bienestar emocional, ansiedad, estres y acompanamiento terapeutico inicial.',
    summary: 'Espacio profesional, prudente y humano para evaluacion y continuidad emocional.',
    icon: 'Brain',
    color: 'from-indigo-500/15 to-sky-500/5',
  },
  {
    id: 'spec_nutrition',
    slug: 'nutricion',
    name: 'Nutricion',
    description: 'Planes alimentarios personalizados, recomposicion corporal y educacion nutricional.',
    summary: 'Soporte preventivo y terapeutico para alimentacion sostenible y control metabolico.',
    icon: 'Apple',
    color: 'from-emerald-500/15 to-lime-500/5',
  },
  {
    id: 'spec_endocrinology',
    slug: 'endocrinologia',
    name: 'Endocrinologia',
    description: 'Atencion especializada para diabetes, tiroides y alteraciones hormonales frecuentes.',
    summary: 'Seguimiento clinico de metabolismo, glucosa, hormonas y control longitudinal.',
    icon: 'Activity',
    color: 'from-sky-500/15 to-blue-500/5',
  },
  {
    id: 'spec_dermatology',
    slug: 'dermatologia',
    name: 'Dermatologia',
    description: 'Orientacion por teleconsulta para acne, dermatitis, lesiones cutaneas y seguimiento.',
    summary: 'Revision remota inicial de piel con plan de continuidad y solicitudes de estudios.',
    icon: 'Sparkles',
    color: 'from-amber-500/15 to-rose-500/5',
  },
  {
    id: 'spec_cardiology',
    slug: 'cardiologia',
    name: 'Cardiologia',
    description: 'Prevencion, segunda opinion y control de condiciones cardiovasculares.',
    summary: 'Lectura de examenes, riesgo cardiovascular y seguimiento de hipertension y arritmias.',
    icon: 'HeartPulse',
    color: 'from-blue-500/15 to-cyan-500/5',
  },
  {
    id: 'spec_chronic_followup',
    slug: 'seguimiento-cronico',
    name: 'Seguimiento de enfermedades cronicas',
    description: 'Control longitudinal de condiciones cronicas y coordinacion de proximo paso.',
    summary: 'Planificacion de controles, adherencia, resultados y continuidad administrativa.',
    icon: 'ClipboardCheck',
    color: 'from-cyan-500/15 to-teal-500/5',
  },
];

export const PROFESSIONAL_CATALOG = [
  {
    id: 'pro_camila_suarez',
    userUid: 'seed-specialist-camila-suarez',
    slug: 'camila-suarez',
    firstName: 'Camila',
    lastName: 'Suarez',
    title: 'Medica internista',
    headline: 'Atencion clinica integral y seguimiento preventivo para adultos.',
    bio: 'Consultas de medicina general, chequeo preventivo y seguimiento de sintomas frecuentes con enfoque humano y ordenado.',
    experienceYears: 12,
    specialistYears: 8,
    university: 'Universidad Peruana Cayetano Heredia',
    ratingAverage: 4.9,
    ratingCount: 148,
    featured: true,
    licenseCode: 'CMP 44521',
    photoUrl: 'https://picsum.photos/seed/intelesalud-camila/640/800',
    specialtySlugs: ['medicina-general', 'seguimiento-cronico'],
    schedule: {
      1: [9, 10, 16],
      2: [9, 11, 17],
      3: [9, 10, 15],
      4: [9, 11, 16],
      5: [9, 10, 12],
    },
    services: [
      {
        id: 'srv_camila_general',
        specialtySlug: 'medicina-general',
        name: 'Consulta medica integral',
        description: 'Evaluacion general, orientacion diagnostica y plan inicial de manejo.',
        duration: '30',
        durationMinutes: 30,
        price: 89,
        currency: 'S/',
      },
      {
        id: 'srv_camila_control',
        specialtySlug: 'seguimiento-cronico',
        name: 'Control de continuidad',
        description: 'Seguimiento de indicaciones, resultados y evolucion clinica.',
        duration: '25',
        durationMinutes: 25,
        price: 79,
        currency: 'S/',
      },
    ],
  },
  {
    id: 'pro_valeria-rojas',
    userUid: 'seed-specialist-valeria-rojas',
    slug: 'valeria-rojas',
    firstName: 'Valeria',
    lastName: 'Rojas',
    title: 'Pediatra',
    headline: 'Consulta pediatrica cercana para controles, infecciones comunes y dudas frecuentes.',
    bio: 'Acompanamiento de crecimiento, fiebre, infecciones respiratorias leves y seguimiento pediatrico por teleconsulta.',
    experienceYears: 14,
    specialistYears: 9,
    university: 'Universidad Nacional Mayor de San Marcos',
    ratingAverage: 4.8,
    ratingCount: 121,
    featured: true,
    licenseCode: 'CMP 51782',
    photoUrl: 'https://picsum.photos/seed/intelesalud-valeria/640/800',
    specialtySlugs: ['pediatria'],
    schedule: {
      1: [10, 11, 17],
      2: [9, 12, 16],
      4: [9, 10, 15],
      6: [9, 10],
    },
    services: [
      {
        id: 'srv_valeria_pediatria',
        specialtySlug: 'pediatria',
        name: 'Consulta pediatrica virtual',
        description: 'Evaluacion de sintomas frecuentes, orientacion de cuidados y seguimiento infantil.',
        duration: '30',
        durationMinutes: 30,
        price: 95,
        currency: 'S/',
      },
    ],
  },
  {
    id: 'pro_lucia-ferreyra',
    userUid: 'seed-specialist-lucia-ferreyra',
    slug: 'lucia-ferreyra',
    firstName: 'Lucia',
    lastName: 'Ferreyra',
    title: 'Psicologa clinica',
    headline: 'Espacio prudente y profesional para estres, ansiedad y bienestar emocional.',
    bio: 'Primera escucha, seguimiento emocional y orientacion administrativa del proceso de atencion en salud mental.',
    experienceYears: 10,
    specialistYears: 10,
    university: 'Pontificia Universidad Catolica del Peru',
    ratingAverage: 4.9,
    ratingCount: 97,
    featured: true,
    licenseCode: 'CPSP 20188',
    photoUrl: 'https://picsum.photos/seed/intelesalud-lucia/640/800',
    specialtySlugs: ['salud-mental'],
    schedule: {
      2: [17, 18, 19],
      3: [16, 18],
      4: [17, 19],
      5: [16, 18],
    },
    services: [
      {
        id: 'srv_lucia_mental',
        specialtySlug: 'salud-mental',
        name: 'Orientacion en salud mental',
        description: 'Consulta inicial para identificar necesidades y definir continuidad.',
        duration: '45',
        durationMinutes: 45,
        price: 120,
        currency: 'S/',
      },
    ],
  },
  {
    id: 'pro_jorge-galvez',
    userUid: 'seed-specialist-jorge-galvez',
    slug: 'jorge-galvez',
    firstName: 'Jorge',
    lastName: 'Galvez',
    title: 'Nutricionista clinico',
    headline: 'Planificacion alimentaria, educacion nutricional y control metabolico.',
    bio: 'Acompana objetivos de salud, peso y adherencia alimentaria con indicaciones realistas y medibles.',
    experienceYears: 9,
    specialistYears: 7,
    university: 'Universidad Cientifica del Sur',
    ratingAverage: 4.7,
    ratingCount: 88,
    featured: false,
    licenseCode: 'CNP 9021',
    photoUrl: 'https://picsum.photos/seed/intelesalud-jorge/640/800',
    specialtySlugs: ['nutricion', 'seguimiento-cronico'],
    schedule: {
      1: [8, 9, 18],
      3: [8, 10, 17],
      5: [9, 11, 18],
    },
    services: [
      {
        id: 'srv_jorge_nutricion',
        specialtySlug: 'nutricion',
        name: 'Consulta nutricional',
        description: 'Evaluacion de habitos, objetivos y plan alimentario personalizado.',
        duration: '35',
        durationMinutes: 35,
        price: 90,
        currency: 'S/',
      },
    ],
  },
  {
    id: 'pro_sofia-ore',
    userUid: 'seed-specialist-sofia-ore',
    slug: 'sofia-ore',
    firstName: 'Sofia',
    lastName: 'Ore',
    title: 'Endocrinologa',
    headline: 'Control metabolico, diabetes y desordenes hormonales con seguimiento continuo.',
    bio: 'Consulta especializada para diabetes, tiroides y coordinacion de examenes y ajustes terapeuticos.',
    experienceYears: 15,
    specialistYears: 11,
    university: 'Universidad Nacional Federico Villarreal',
    ratingAverage: 4.8,
    ratingCount: 112,
    featured: true,
    licenseCode: 'CMP 39811',
    photoUrl: 'https://picsum.photos/seed/intelesalud-sofia/640/800',
    specialtySlugs: ['endocrinologia', 'seguimiento-cronico'],
    schedule: {
      1: [15, 16, 18],
      2: [15, 17],
      4: [16, 18],
      5: [15, 16],
    },
    services: [
      {
        id: 'srv_sofia_endocrino',
        specialtySlug: 'endocrinologia',
        name: 'Control endocrinologico',
        description: 'Ajuste y seguimiento de diabetes, tiroides y alteraciones hormonales.',
        duration: '30',
        durationMinutes: 30,
        price: 115,
        currency: 'S/',
      },
    ],
  },
  {
    id: 'pro_diego-herrera',
    userUid: 'seed-specialist-diego-herrera',
    slug: 'diego-herrera',
    firstName: 'Diego',
    lastName: 'Herrera',
    title: 'Dermatologo',
    headline: 'Teleorientacion dermatologica para lesiones, acne y seguimiento de tratamientos.',
    bio: 'Consulta remota para triage dermatologico, seguimiento de evolucion y solicitud de imagenes complementarias.',
    experienceYears: 13,
    specialistYears: 10,
    university: 'Universidad Peruana de Ciencias Aplicadas',
    ratingAverage: 4.6,
    ratingCount: 76,
    featured: false,
    licenseCode: 'CMP 42290',
    photoUrl: 'https://picsum.photos/seed/intelesalud-diego/640/800',
    specialtySlugs: ['dermatologia'],
    schedule: {
      2: [14, 15, 18],
      3: [14, 16],
      5: [14, 17],
    },
    services: [
      {
        id: 'srv_diego_dermato',
        specialtySlug: 'dermatologia',
        name: 'Evaluacion dermatologica',
        description: 'Revision inicial de lesiones y continuidad de plan terapeutico.',
        duration: '25',
        durationMinutes: 25,
        price: 99,
        currency: 'S/',
      },
    ],
  },
  {
    id: 'pro_elena-paredes',
    userUid: 'seed-specialist-elena-paredes',
    slug: 'elena-paredes',
    firstName: 'Elena',
    lastName: 'Paredes',
    title: 'Cardiologa',
    headline: 'Prevencion cardiovascular, lectura de examenes y seguimiento cronico.',
    bio: 'Segunda opinion, control de hipertension, palpitaciones y seguimiento de examenes cardiologicos.',
    experienceYears: 17,
    specialistYears: 13,
    university: 'Universidad de San Martin de Porres',
    ratingAverage: 4.9,
    ratingCount: 163,
    featured: true,
    licenseCode: 'CMP 35077',
    photoUrl: 'https://picsum.photos/seed/intelesalud-elena/640/800',
    specialtySlugs: ['cardiologia', 'seguimiento-cronico'],
    schedule: {
      1: [8, 12, 17],
      3: [9, 12, 18],
      4: [8, 11, 17],
    },
    services: [
      {
        id: 'srv_elena_cardio',
        specialtySlug: 'cardiologia',
        name: 'Consulta cardiovascular',
        description: 'Evaluacion de riesgo, lectura de examenes y plan clinico inicial.',
        duration: '40',
        durationMinutes: 40,
        price: 129,
        currency: 'S/',
      },
    ],
  },
];

export const FAQ_ITEMS = [
  {
    question: '¿Necesito crear una cuenta para reservar?',
    answer:
      'Puedes explorar especialidades y profesionales sin cuenta, pero para reservar y dar seguimiento debes iniciar sesion con Google.',
  },
  {
    question: '¿Como funciona el pago de la teleconsulta?',
    answer:
      'La plataforma reserva el horario, muestra el monto y solicita el comprobante por Plin. El equipo revisa el pago antes de confirmar la cita.',
  },
  {
    question: '¿La plataforma reemplaza una emergencia medica?',
    answer:
      'No. InteleSalud orienta administrativamente y coordina atenciones programadas. No reemplaza atencion de urgencia ni brinda indicaciones diagnosticas de emergencia.',
  },
  {
    question: '¿Que encuentro en el portal del paciente?',
    answer:
      'Encontraras citas, historial, documentos mock, indicaciones, mensajes, perfil y una sala virtual preparada para integrar videollamada real.',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    id: 'step_1',
    title: 'Explora especialidades y profesionales',
    description: 'Revisa experiencia, universidad, disponibilidad y valoraciones antes de reservar.',
  },
  {
    id: 'step_2',
    title: 'Reserva tu horario',
    description: 'Selecciona especialidad, profesional, fecha, horario y motivo de consulta desde un flujo guiado.',
  },
  {
    id: 'step_3',
    title: 'Sube tu pago y confirma',
    description: 'El sistema mantiene el flujo de comprobante por Plin y confirma la atencion cuando el pago se valida.',
  },
  {
    id: 'step_4',
    title: 'Gestiona tu continuidad',
    description: 'Accede a tu portal, mensajes, documentos mock y sala virtual desde cualquier dispositivo.',
  },
];

export const BENEFIT_ITEMS = [
  {
    id: 'benefit_speed',
    title: 'Agenda centralizada',
    description: 'Una sola experiencia para distintas especialidades y profesionales.',
  },
  {
    id: 'benefit_portal',
    title: 'Portal del paciente',
    description: 'Resumen, historial, indicaciones, documentos y mensajes en una interfaz limpia.',
  },
  {
    id: 'benefit_chat',
    title: 'Asistente administrativo',
    description: 'Orienta reservas, estados de cita y pasos siguientes sin invadir la experiencia.',
  },
  {
    id: 'benefit_secure',
    title: 'Sesion segura',
    description: 'Firebase Authentication con cookie server-side, middleware y trazabilidad.',
  },
];

export const PATIENT_CARE_INTENTS = [
  'Primera consulta',
  'Seguimiento de tratamiento',
  'Revision de examenes',
  'Segunda opinion',
];

export const PATIENT_ATTENTION_PREFERENCES = [
  'Teleconsulta por videollamada',
  'Orientacion inicial remota',
  'Seguimiento administrativo',
];

export const CHATBOT_KNOWLEDGE = {
  booking:
    'Para reservar, elige especialidad, profesional, fecha, horario y motivo de consulta. Si no has iniciado sesion, te pediremos autenticarte primero.',
  payment:
    'El flujo actual usa pago por Plin. Despues de reservar un horario debes subir el comprobante para que el equipo confirme la cita.',
  portal:
    'En tu portal puedes revisar resumen, citas, historial, documentos mock, indicaciones, mensajes y tu perfil.',
  room:
    'La sala virtual de InteleSalud esta lista para integrar un proveedor real de videollamada. Mientras tanto, veras el estado de sesion y el profesional asignado.',
  safety:
    'El asistente de InteleSalud no ofrece diagnosticos ni indicaciones de emergencia. Puede orientarte administrativamente o derivarte con un humano.',
};

export function getServiceSeedById(serviceId) {
  for (const professional of PROFESSIONAL_CATALOG) {
    const match = professional.services.find((service) => service.id === serviceId);
    if (match) {
      return {
        ...match,
        professional,
      };
    }
  }

  return null;
}

export function getSpecialtyBySlug(slug) {
  return SPECIALTY_CATALOG.find((specialty) => specialty.slug === slug) || null;
}
