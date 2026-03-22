import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth/withAuth';
import { plinPaymentService } from '@/lib/payment/plinPaymentService';
import { isSpecialistRole } from '@/lib/auth/roles';
import { ensureTrustedOrigin, jsonNoStore } from '@/lib/security/http';

/**
 * POST - Admin/specialist confirms or rejects a payment voucher.
 * Requires ADMIN or SPECIALIST role.
 */
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

    if (user.role !== 'ADMIN' && !isSpecialistRole(user.role)) {
      return jsonNoStore(
        { error: 'No tienes permisos para esta accion' },
        { status: 403 }
      );
    }

    const { voucherId, action } = await request.json();

    if (!voucherId || !['approve', 'reject'].includes(action)) {
      return jsonNoStore(
        { error: 'Se requiere voucherId y action (approve/reject)' },
        { status: 400 }
      );
    }

    const voucher = await plinPaymentService.reviewVoucher({
      voucherId,
      action,
      reviewedBy: user.id,
    });

    return jsonNoStore({
      success: true,
      voucher: {
        id: voucher.id,
        status: voucher.status,
        appointmentId: voucher.appointmentId,
      },
    });
  } catch (error) {
    console.error('[Payment] Voucher confirmation failed:', error);
    return jsonNoStore(
      { error: error?.message || 'Error al procesar la confirmacion' },
      { status: 500 }
    );
  }
}

/**
 * GET - Get pending vouchers for review.
 * Requires ADMIN or SPECIALIST role.
 */
export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return jsonNoStore({ error: 'No autorizado' }, { status: 401 });
    }

    if (user.role !== 'ADMIN' && !isSpecialistRole(user.role)) {
      return jsonNoStore(
        { error: 'No tienes permisos para esta accion' },
        { status: 403 }
      );
    }

    const vouchers = await plinPaymentService.getPendingVouchers();

    return jsonNoStore({ vouchers });
  } catch (error) {
    console.error('[Payment] Failed to fetch vouchers:', error);
    return jsonNoStore(
      { error: 'Error al obtener comprobantes' },
      { status: 500 }
    );
  }
}
