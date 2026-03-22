import { redirect } from 'next/navigation';

function getValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LegacyBookPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const nextParams = new URLSearchParams();

  const serviceId = getValue(resolvedParams?.serviceId);
  const date = getValue(resolvedSearchParams?.date);
  const slot = getValue(resolvedSearchParams?.slot);

  if (serviceId) nextParams.set('serviceId', serviceId);
  if (date) nextParams.set('date', date);
  if (slot) nextParams.set('slot', slot);

  const query = nextParams.toString();
  redirect(`/portal/agendar${query ? `?${query}` : ''}`);
}
