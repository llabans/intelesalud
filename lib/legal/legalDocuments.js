const LAST_UPDATED = '9 de marzo de 2026';

export const TERMS_DOCUMENT_VERSION = 'terms-pe-2026-03-09';
export const PRIVACY_DOCUMENT_VERSION = 'privacy-pe-2026-03-09';
export const CONSENT_DOCUMENT_VERSION = 'consent-pe-2026-03-09';

const LEGAL_REFERENCES = [
  {
    label: 'Ley N. 29733, Ley de Proteccion de Datos Personales',
    href: 'https://www.gob.pe/institucion/congreso-de-la-republica/normas-legales/243470-29733',
  },
  {
    label: 'Decreto Supremo N. 003-2013-JUS',
    href: 'https://www.gob.pe/institucion/minjus/normas-legales/1941246-003-2013-jus',
  },
  {
    label: 'Decreto Supremo N. 016-2024-JUS',
    href: 'https://www.gob.pe/institucion/anpd/normas-legales/6554453-16-2024-jus',
  },
  {
    label: 'Ley N. 29414, derechos de las personas usuarias de los servicios de salud',
    href: 'https://www.gob.pe/10423-derechos-de-las-personas-usuarias-de-los-servicios-de-salud',
  },
  {
    label: 'Decreto Supremo N. 027-2015-SA',
    href: 'https://www.gob.pe/institucion/minsa/normas-legales/997327-027-2015-sa',
  },
  {
    label: 'Ley N. 30421, Ley Marco de Telesalud',
    href: 'https://www.gob.pe/institucion/congreso-de-la-republica/normas-legales/192482-30421',
  },
  {
    label: 'Decreto Supremo N. 005-2021-SA',
    href: 'https://www.gob.pe/institucion/presidencia/normas-legales/1599291-005-2021-sa',
  },
  {
    label: 'Derechos ARCO y procedimiento ante la ANPD',
    href: 'https://www.gob.pe/9270',
  },
];

export const LEGAL_DOCUMENTS = {
  terms: {
    title: 'Terminos de Servicio',
    version: TERMS_DOCUMENT_VERSION,
    lastUpdated: LAST_UPDATED,
    intro:
      'Estos Terminos regulan el acceso y uso de la plataforma InteleSalud, orientada a la gestion de atenciones de telesalud multiespecialidad en Peru. Deben leerse junto con la Politica de Privacidad y el Consentimiento Informado.',
    sections: [
      {
        title: '1. Alcance del servicio',
        paragraphs: [
          'La plataforma permite registrar cuentas, solicitar citas, intercambiar informacion clinica previa, cargar comprobantes de pago y coordinar atenciones medicas a distancia.',
          'El uso de la plataforma no sustituye la atencion de emergencia. Si presentas dolor toracico intenso, dificultad respiratoria, perdida de conciencia u otra urgencia, debes acudir inmediatamente al servicio de emergencia mas cercano o comunicarte con la linea 106/113 segun corresponda.',
        ],
      },
      {
        title: '2. Requisitos del usuario',
        paragraphs: [
          'Debes proporcionar informacion veraz, actualizada y suficiente para la gestion clinica y administrativa de tu atencion.',
          'Eres responsable de custodiar el acceso a tu cuenta, verificar tus datos de contacto y mantener disponible un dispositivo apto para videollamada segura.',
        ],
      },
      {
        title: '3. Reserva, pagos y comprobantes',
        paragraphs: [
          'La reserva de un horario queda sujeta a disponibilidad y a la validacion del flujo de agenda. El pago o la carga del comprobante no elimina la posibilidad de reprogramacion por razones clinicas, tecnicas o de seguridad del paciente.',
          'Los comprobantes cargados deben corresponder a la cita solicitada y podran ser auditados antes de confirmar la atencion.',
        ],
      },
      {
        title: '4. Uso clinico y limites',
        paragraphs: [
          'La telemedicina tiene limitaciones inherentes: no siempre permite examen fisico completo, puede depender de la calidad de la conexion y puede requerir derivacion a atencion presencial, examenes auxiliares u opinion adicional.',
          'El criterio medico prevalece sobre cualquier preferencia operativa del usuario cuando se trate de seguridad clinica, continuidad de cuidados o proteccion de datos sensibles.',
        ],
      },
      {
        title: '5. Propiedad intelectual y uso permitido',
        paragraphs: [
          'El contenido del sitio, marcas, textos, interfaces y materiales clinicos pertenecen a sus titulares o se usan con autorizacion. No puedes copiar, redistribuir ni explotar estos contenidos fuera del servicio sin autorizacion.',
        ],
      },
      {
        title: '6. Suspension, cambios y jurisdiccion',
        paragraphs: [
          'La plataforma puede actualizar funcionalidades, medidas de seguridad y contenido legal cuando sea necesario por cambios normativos, clinicos o tecnologicos.',
          'Las relaciones derivadas del uso del servicio se interpretan conforme a la ley peruana, sin perjuicio de los derechos irrenunciables de los usuarios de servicios de salud y de proteccion de datos personales.',
        ],
      },
    ],
    references: LEGAL_REFERENCES,
  },
  privacy: {
    title: 'Politica de Privacidad',
    version: PRIVACY_DOCUMENT_VERSION,
    lastUpdated: LAST_UPDATED,
    intro:
      'Esta Politica describe como InteleSalud trata datos personales y datos de salud en el contexto de prestaciones de telemedicina y gestion administrativa del portal del paciente. El tratamiento se orienta por los principios de legalidad, consentimiento, proporcionalidad, finalidad, calidad, seguridad y disposicion de recurso previstos por la normativa peruana.',
    sections: [
      {
        title: '1. Datos que tratamos',
        paragraphs: [
          'Podemos tratar datos de identificacion y contacto, informacion de autenticacion, antecedentes clinicos reportados por el paciente, documentos cargados, informacion de pago y metadatos tecnicos necesarios para la seguridad de la plataforma.',
          'Los datos vinculados a la salud se consideran sensibles y reciben un nivel reforzado de confidencialidad, acceso restringido y trazabilidad.',
        ],
      },
      {
        title: '2. Finalidades del tratamiento',
        bullets: [
          'Crear y administrar cuentas de usuario.',
          'Verificar identidad y autenticar sesiones clinicas.',
          'Programar citas, coordinar teleconsultas y registrar consentimientos.',
          'Gestionar pagos, comprobantes y soporte operativo.',
          'Mantener evidencias de seguridad, prevenir fraude y atender requerimientos legales o sanitarios.',
        ],
      },
      {
        title: '3. Base juridica y consentimiento',
        paragraphs: [
          'El tratamiento de datos personales se apoya en la ejecucion de la relacion asistencial y contractual, en obligaciones legales aplicables al sector salud y, cuando corresponda, en el consentimiento del titular para datos sensibles, comunicaciones y prestaciones de telemedicina.',
          'El consentimiento puede ser revocado en los casos permitidos por la ley; sin embargo, la revocacion no afecta tratamientos ya ejecutados ni obligaciones de conservacion derivadas de la normativa sanitaria o de seguridad.',
        ],
      },
      {
        title: '4. Conservacion y transferencias',
        paragraphs: [
          'Los datos se conservan solo durante el tiempo necesario para las finalidades informadas, la continuidad asistencial, la atencion de reclamos, la seguridad de la plataforma y los plazos legales aplicables.',
          'El servicio puede apoyarse en proveedores tecnologicos de autenticacion, infraestructura, agenda, videollamada, seguridad y almacenamiento. Cuando ello implique flujo internacional de datos, se exigiran medidas contractuales y tecnicas razonables para mantener la confidencialidad e integridad.',
        ],
      },
      {
        title: '5. Derechos del titular',
        paragraphs: [
          'Puedes ejercer tus derechos de acceso, rectificacion, cancelacion y oposicion (ARCO), asi como solicitar informacion sobre el tratamiento, dentro de los canales oficiales del servicio. Si no recibes respuesta o la respuesta es insatisfactoria, puedes acudir ante la Autoridad Nacional de Proteccion de Datos Personales.',
          'De acuerdo con la orientacion oficial de la ANPD, el plazo de respuesta es de hasta 20 dias habiles para acceso y hasta 10 dias habiles para rectificacion, cancelacion u oposicion.',
        ],
      },
      {
        title: '6. Seguridad y confidencialidad',
        paragraphs: [
          'Se aplican controles razonables de acceso, sesiones autenticadas, cifrado en transito, registro de eventos y minimizacion de datos para proteger la informacion personal y clinica.',
          'Todo tercero que participe en la operacion del servicio debe cumplir deberes de confidencialidad compatibles con la naturaleza sensible de los datos tratados.',
        ],
      },
      {
        title: '7. Autoridades y reclamos',
        paragraphs: [
          'Si consideras vulnerados tus derechos en salud o privacidad, puedes iniciar tus solicitudes a traves de los canales oficiales del servicio y, adicionalmente, recurrir a SUSALUD o a la ANPD segun la naturaleza del reclamo.',
        ],
      },
    ],
    references: LEGAL_REFERENCES,
  },
  consent: {
    title: 'Consentimiento Informado para Telemedicina',
    version: CONSENT_DOCUMENT_VERSION,
    lastUpdated: LAST_UPDATED,
    intro:
      'Este documento recoge el consentimiento informado para atenciones de telemedicina en InteleSalud. Su aceptacion digital deja constancia de que el paciente recibio informacion suficiente sobre el acto asistencial, sus limites y el tratamiento de datos involucrado.',
    sections: [
      {
        title: '1. Naturaleza de la atencion',
        paragraphs: [
          'La telemedicina permite una evaluacion clinica remota mediante videollamada, intercambio de informacion y revision de documentos, con el objetivo de orientar diagnostico, conducta, seguimiento o necesidad de derivacion presencial.',
          'Entiendo que la teleconsulta puede no reemplazar totalmente una consulta presencial y que el profesional puede indicar evaluacion fisica, examenes complementarios o atencion de emergencia cuando el caso lo requiera.',
        ],
      },
      {
        title: '2. Riesgos y limitaciones informados',
        bullets: [
          'Limitaciones para realizar examen fisico completo.',
          'Posibles fallas de conectividad, audio, video o envio de archivos.',
          'Riesgo de que la informacion proporcionada por el paciente sea incompleta o inexacta.',
          'Necesidad de suspender o reprogramar la atencion si no existen condiciones tecnicas o clinicas seguras.',
        ],
      },
      {
        title: '3. Declaraciones del paciente',
        paragraphs: [
          'Declaro que la informacion que proporciono es veraz, que me encuentro en un ambiente razonablemente privado para la atencion y que comprendo que debo buscar ayuda inmediata si presento signos de urgencia o emergencia.',
          'Autorizo el tratamiento de mis datos personales y datos de salud estrictamente necesarios para gestionar la atencion, continuidad asistencial, seguridad clinica y cumplimiento normativo.',
        ],
      },
      {
        title: '4. Confidencialidad y evidencias',
        paragraphs: [
          'Se podran registrar evidencias administrativas del consentimiento, incluyendo fecha, hora, identificador de sesion y otros elementos razonables para demostrar su otorgamiento. La grabacion integral de una consulta solo deberia realizarse con una autorizacion adicional y especifica.',
          'Los datos clinicos y administrativos seran tratados con reserva y podran compartirse solo con personal autorizado, proveedores necesarios o autoridades competentes cuando la ley lo exija.',
        ],
      },
      {
        title: '5. Revocacion y atencion de reclamos',
        paragraphs: [
          'Puedo revocar este consentimiento antes del inicio efectivo de la atencion, sin perjuicio de los tratamientos ya ejecutados y de las obligaciones legales de conservacion.',
          'Conozco que puedo presentar consultas o reclamos por mis derechos en salud y por la proteccion de mis datos ante los canales del servicio, SUSALUD y la ANPD.',
        ],
      },
    ],
    references: LEGAL_REFERENCES,
  },
};
