import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth/withAuth';
import { postAssistantMessage } from '@/lib/assistant/service';
import { ensureTrustedOrigin, jsonNoStore } from '@/lib/security/http';

export async function POST(request) {
  try {
    const originError = ensureTrustedOrigin(request);
    if (originError) {
      return originError;
    }

    const authUser = await getAuthUser(request).catch(() => null);
    const body = await request.json();

    if (!body.message?.trim()) {
      return jsonNoStore({ error: 'Escribe un mensaje.' }, { status: 400 });
    }

    const response = await postAssistantMessage({
      conversationId: body.conversationId,
      user: authUser,
      channel: body.channel === 'PORTAL' ? 'PORTAL' : 'PUBLIC',
      message: body.message.trim(),
    });

    return jsonNoStore(response);
  } catch (error) {
    console.error('[Assistant] Failed to respond:', error);
    return jsonNoStore({ error: 'No se pudo responder en este momento.' }, { status: 500 });
  }
}
