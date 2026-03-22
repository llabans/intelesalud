import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth/withAuth';
import { prisma } from '@/lib/db';
import { ensureTrustedOrigin, jsonNoStore } from '@/lib/security/http';

function splitName(fullName) {
  const [firstName, ...rest] = (fullName || '').split(' ');
  return {
    firstName: firstName || 'Paciente',
    lastName: rest.join(' ') || 'InteleSalud',
  };
}

export async function POST(request) {
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
    const fullName = body.fullName?.trim() || user.name || '';
    const { firstName, lastName } = splitName(fullName);

    const profile = await prisma.patientProfile.upsert({
      where: { userId: user.id },
      update: {
        firstName,
        lastName,
        fullName,
        careIntent: body.careIntent?.trim() || null,
        preferredSpecialtyId: body.preferredSpecialtyId || null,
        location: body.location?.trim() || null,
        attentionPreference: body.attentionPreference?.trim() || null,
        onboardingCompletedAt: new Date(),
      },
      create: {
        userId: user.id,
        firstName,
        lastName,
        fullName,
        careIntent: body.careIntent?.trim() || null,
        preferredSpecialtyId: body.preferredSpecialtyId || null,
        location: body.location?.trim() || null,
        attentionPreference: body.attentionPreference?.trim() || null,
        onboardingCompletedAt: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: fullName || user.name,
      },
    });

    return jsonNoStore({
      success: true,
      profile,
      redirectTo: '/portal',
    });
  } catch (error) {
    console.error('[Onboarding] Failed:', error);
    return jsonNoStore({ error: 'No se pudo completar el onboarding.' }, { status: 500 });
  }
}
