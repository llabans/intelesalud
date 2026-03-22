const DATE_FORMATTER = new Intl.DateTimeFormat('es-PE', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'America/Lima',
});

const TIME_FORMATTER = new Intl.DateTimeFormat('es-PE', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: 'America/Lima',
});

const STATUS_MAP = {
  PENDING: {
    label: 'Reserva creada',
    tone: 'amber',
    description: 'Tu horario quedo separado. Sube el comprobante para que el equipo confirme la teleconsulta.',
    portalSection: 'requests',
  },
  AWAITING_CONFIRMATION: {
    label: 'Pago en revision',
    tone: 'amber',
    description: 'El comprobante fue recibido y esta pendiente de validacion por el equipo.',
    portalSection: 'requests',
  },
  CONFIRMED: {
    label: 'Cita confirmada',
    tone: 'emerald',
    description: 'La teleconsulta esta confirmada y la sala virtual quedara disponible en cuanto exista sesion real.',
    portalSection: 'upcoming',
  },
  COMPLETED: {
    label: 'Atencion completada',
    tone: 'slate',
    description: 'La atencion ya se realizo y queda registrada en tu historial.',
    portalSection: 'history',
  },
  CANCELLED: {
    label: 'Cancelada',
    tone: 'red',
    description: 'La solicitud fue cancelada.',
    portalSection: 'history',
  },
  NO_SHOW: {
    label: 'No asistio',
    tone: 'red',
    description: 'La cita no pudo completarse.',
    portalSection: 'history',
  },
};

export function getStatusPresentation(status, paymentVoucherStatus) {
  if (status === 'PENDING' && paymentVoucherStatus === 'REJECTED') {
    return {
      label: 'Comprobante observado',
      tone: 'red',
      description: 'Necesitas subir un nuevo comprobante para completar la confirmacion.',
      portalSection: 'requests',
    };
  }

  return STATUS_MAP[status] || {
    label: status || 'Sin estado',
    tone: 'slate',
    description: 'No se encontro una descripcion legible para esta cita.',
    portalSection: 'requests',
  };
}

export function formatDateLabel(value) {
  if (!value) {
    return '';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return DATE_FORMATTER.format(parsed);
}

export function formatTimeLabel(value) {
  if (!value) {
    return '';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return TIME_FORMATTER.format(parsed);
}

export function serializeMessage(message, currentUserId) {
  return {
    id: message.id,
    body: message.body,
    createdAt: message.createdAt,
    author: {
      id: message.author.id,
      name: message.author.name || message.author.email || 'Usuario',
      role: message.author.role,
    },
    isOwn: currentUserId ? message.author.id === currentUserId : false,
  };
}

export function serializeAppointment(appointment, currentUserId) {
  const status = getStatusPresentation(appointment.status, appointment.paymentVoucher?.status);
  const slotStart = appointment.slot?.startTime || null;
  const slotEnd = appointment.slot?.endTime || null;

  return {
    id: appointment.id,
    status: appointment.status,
    statusLabel: status.label,
    statusTone: status.tone,
    statusDescription: status.description,
    portalSection: status.portalSection,
    intakeNotes: appointment.intakeNotes || '',
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
    slot: {
      startTime: slotStart,
      endTime: slotEnd,
      dateLabel: formatDateLabel(slotStart),
      startLabel: formatTimeLabel(slotStart),
      endLabel: formatTimeLabel(slotEnd),
    },
    service: appointment.service
      ? {
          id: appointment.service.id,
          name: appointment.service.name,
          description: appointment.service.description,
          duration: appointment.service.duration,
          durationMinutes: appointment.service.durationMinutes,
          price: appointment.service.price,
          currency: appointment.service.currency,
          specialty: appointment.service.specialty
            ? {
                id: appointment.service.specialty.id,
                slug: appointment.service.specialty.slug,
                name: appointment.service.specialty.name,
              }
            : null,
        }
      : null,
    patient: appointment.patient
      ? {
          id: appointment.patient.id,
          name:
            appointment.patient.user?.name ||
            appointment.patient.fullName ||
            [appointment.patient.firstName, appointment.patient.lastName].filter(Boolean).join(' ') ||
            appointment.patient.user?.email ||
            'Paciente',
          email: appointment.patient.user?.email || '',
          phone: appointment.patient.phone || '',
        }
      : null,
    specialist: appointment.specialist
      ? {
          id: appointment.specialist.id,
          slug: appointment.specialist.slug,
          name:
            appointment.specialist.user?.name ||
            [appointment.specialist.firstName, appointment.specialist.lastName]
              .filter(Boolean)
              .join(' ') ||
            'Especialista',
          title: appointment.specialist.title || '',
          headline: appointment.specialist.headline || '',
          email: appointment.specialist.user?.email || '',
          university: appointment.specialist.university || '',
          ratingAverage: appointment.specialist.ratingAverage,
          ratingCount: appointment.specialist.ratingCount,
        }
      : null,
    payment: appointment.payment
      ? {
          id: appointment.payment.id,
          amount: appointment.payment.amount,
          currency: appointment.payment.currency,
          provider: appointment.payment.provider,
          status: appointment.payment.status,
        }
      : null,
    paymentVoucher: appointment.paymentVoucher
      ? {
          id: appointment.paymentVoucher.id,
          imageUrl: appointment.paymentVoucher.imageUrl,
          status: appointment.paymentVoucher.status,
          reviewedAt: appointment.paymentVoucher.reviewedAt,
          createdAt: appointment.paymentVoucher.createdAt,
        }
      : null,
    meetingSession: appointment.meetingSession
      ? {
          id: appointment.meetingSession.id,
          provider: appointment.meetingSession.provider,
          joinUrl: appointment.meetingSession.joinUrl || '',
          status: appointment.meetingSession.status,
        }
      : null,
    review: appointment.review
      ? {
          id: appointment.review.id,
          rating: appointment.review.rating,
          comment: appointment.review.comment,
        }
      : null,
    canUploadVoucher:
      appointment.status === 'PENDING' &&
      (!appointment.paymentVoucher || appointment.paymentVoucher.status === 'REJECTED'),
    canJoinMeeting:
      appointment.status === 'CONFIRMED' && Boolean(appointment.meetingSession?.joinUrl),
    messages: Array.isArray(appointment.messages)
      ? appointment.messages.map((message) => serializeMessage(message, currentUserId))
      : [],
  };
}

export function getBadgeClasses(tone) {
  return {
    emerald: 'bg-emerald-100 text-emerald-800',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-700',
    slate: 'bg-slate-100 text-slate-700',
  }[tone] || 'bg-slate-100 text-slate-700';
}
