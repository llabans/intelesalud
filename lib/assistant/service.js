import { prisma } from '@/lib/db';
import { CHATBOT_KNOWLEDGE } from '@/lib/platform/catalog';

const SAFETY_COPY =
  'Puedo orientarte administrativamente, pero no dar diagnosticos ni indicaciones de emergencia. Si tu situacion es urgente, busca atencion humana inmediata por los canales presenciales de tu localidad.';

function detectIntent(message) {
  const normalized = message.toLowerCase();

  if (/(emergencia|urgente|dolor fuerte|me estoy muriendo|infarto)/.test(normalized)) {
    return 'safety';
  }

  if (/(reserv|agend|cita nueva|especialidad|profesional)/.test(normalized)) {
    return 'booking';
  }

  if (/(pago|plin|comprobante|voucher)/.test(normalized)) {
    return 'payment';
  }

  if (/(portal|documento|historial|perfil|indicaciones|sala)/.test(normalized)) {
    return 'portal';
  }

  if (/(videollamada|sala|meet|enlace)/.test(normalized)) {
    return 'room';
  }

  return 'fallback';
}

function buildAssistantReply({ intent, userName }) {
  if (intent === 'safety') {
    return SAFETY_COPY;
  }

  const intro = userName ? `${userName}, ` : '';

  switch (intent) {
    case 'booking':
      return `${intro}${CHATBOT_KNOWLEDGE.booking}`;
    case 'payment':
      return `${intro}${CHATBOT_KNOWLEDGE.payment}`;
    case 'portal':
      return `${intro}${CHATBOT_KNOWLEDGE.portal}`;
    case 'room':
      return `${intro}${CHATBOT_KNOWLEDGE.room}`;
    default:
      return `${intro}${CHATBOT_KNOWLEDGE.safety} Tambien puedo ayudarte con reservas, pagos, estados de cita, documentos o la sala virtual.`;
  }
}

export async function ensureAssistantConversation({ conversationId, userId, channel }) {
  if (conversationId) {
    const existing = await prisma.assistantConversation.findUnique({
      where: { id: conversationId },
    });

    if (existing) {
      return existing;
    }
  }

  return prisma.assistantConversation.create({
    data: {
      userId: userId || null,
      channel,
      title: channel === 'PORTAL' ? 'Asistente InteleSalud' : 'Orientacion InteleSalud',
    },
  });
}

export async function postAssistantMessage({
  conversationId,
  user,
  channel = 'PUBLIC',
  message,
}) {
  const conversation = await ensureAssistantConversation({
    conversationId,
    userId: user?.id,
    channel,
  });

  await prisma.assistantMessage.create({
    data: {
      conversationId: conversation.id,
      authorId: user?.id || null,
      role: 'user',
      content: message,
    },
  });

  const intent = detectIntent(message);
  const reply = buildAssistantReply({
    intent,
    userName: user?.name?.split(' ')?.[0] || '',
  });

  const assistantMessage = await prisma.assistantMessage.create({
    data: {
      conversationId: conversation.id,
      role: 'assistant',
      content: reply,
      metadata: JSON.stringify({ intent }),
    },
  });

  return {
    conversationId: conversation.id,
    message: {
      id: assistantMessage.id,
      role: assistantMessage.role,
      content: assistantMessage.content,
      createdAt: assistantMessage.createdAt,
    },
  };
}

export async function listAssistantMessages(conversationId) {
  return prisma.assistantMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  });
}
