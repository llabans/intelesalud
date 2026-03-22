import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth/withAuth';
import { prisma } from '@/lib/db';
import { extractClientIp, recordAuthEvent } from '@/lib/auth/security';
import { ensureTrustedOrigin, jsonNoStore } from '@/lib/security/http';

function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
    phone: user.phone,
  };
}

export async function GET(request) {
  const user = await getAuthUser(request);
  if (!user) {
    return jsonNoStore({ error: 'No autorizado' }, { status: 401 });
  }

  const profile = await prisma.patientProfile.findUnique({
    where: { userId: user.id },
  });

  return jsonNoStore({
    user: serializeUser(user),
    profile,
  });
}

export async function PATCH(request) {
  try {
    const originError = ensureTrustedOrigin(request);
    if (originError) {
      return originError;
    }

    const user = await getAuthUser(request);
    if (!user) {
      return jsonNoStore({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const phone = body.phone?.trim() || null;
    const location = body.location?.trim() || null;
    const attentionPreference = body.attentionPreference?.trim() || null;
    const fullName = body.fullName?.trim() || user.name || null;
    const [firstName, ...rest] = (fullName || '').split(' ');
    const lastName = rest.join(' ') || '';

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        phone,
        name: fullName || user.name,
      },
    });

    const patientProfile = await prisma.patientProfile.upsert({
      where: { userId: user.id },
      update: {
        phone,
        fullName,
        firstName: firstName || user.patientProfile?.firstName || 'Paciente',
        lastName: lastName || user.patientProfile?.lastName || 'InteleSalud',
        location,
        attentionPreference,
      },
      create: {
        userId: user.id,
        phone,
        fullName,
        firstName: firstName || 'Paciente',
        lastName: lastName || 'InteleSalud',
        location,
        attentionPreference,
      },
    });

    await recordAuthEvent({
      userId: user.id,
      eventName: 'profile_updated',
      ip: extractClientIp(request),
      userAgent: request.headers.get('user-agent'),
      detail: { fields: ['phone', 'location', 'attentionPreference', 'fullName'] },
    });

    return jsonNoStore({
      user: serializeUser(updatedUser),
      profile: patientProfile,
    });
  } catch (error) {
    console.error('[Auth] Profile update failed:', error);
    return jsonNoStore({ error: 'Error al actualizar perfil' }, { status: 500 });
  }
}
