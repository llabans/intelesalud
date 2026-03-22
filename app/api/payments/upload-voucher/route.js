import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getAuthUser } from '@/lib/auth/withAuth';
import { plinPaymentService } from '@/lib/payment/plinPaymentService';
import { prisma } from '@/lib/db';
import { ensureTrustedOrigin, jsonNoStore } from '@/lib/security/http';

/**
 * POST - Upload a Plin payment voucher image.
 * Accepts multipart form data with the voucher image.
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

    const formData = await request.formData();
    const file = formData.get('voucher');
    const appointmentId = formData.get('appointmentId');

    if (!file || !appointmentId || typeof appointmentId !== 'string') {
      return jsonNoStore(
        { error: 'Se requiere el comprobante y el ID de cita' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
        paymentVoucher: true,
      },
    });

    if (!appointment) {
      return jsonNoStore({ error: 'La cita indicada no existe' }, { status: 404 });
    }

    if (appointment.patient.userId !== user.id) {
      return jsonNoStore(
        { error: 'No puedes subir comprobantes para una cita ajena' },
        { status: 403 }
      );
    }

    if (appointment.paymentVoucher && appointment.paymentVoucher.status !== 'REJECTED') {
      return jsonNoStore(
        { error: 'Esta cita ya tiene un comprobante registrado' },
        { status: 409 }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return jsonNoStore(
        { error: 'Solo se permiten imagenes (JPEG, PNG, WebP)' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return jsonNoStore({ error: 'El archivo no debe superar 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1];
    const fileName = `voucher_${randomUUID()}.${ext}`;
    const uploadDir = process.env.UPLOAD_DIR
      ? join(process.env.UPLOAD_DIR, 'vouchers')
      : join(process.cwd(), 'public', 'uploads', 'vouchers');

    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, fileName), buffer);

    const imageUrl = `/uploads/vouchers/${fileName}`;
    const voucher = await plinPaymentService.createVoucher({
      appointmentId,
      imageUrl,
    });

    return jsonNoStore({
      success: true,
      voucher: {
        id: voucher.id,
        imageUrl: voucher.imageUrl,
        status: voucher.status,
      },
    });
  } catch (error) {
    console.error('[Payment] Voucher upload failed:', error);
    return jsonNoStore({ error: 'Error al subir el comprobante' }, { status: 500 });
  }
}
