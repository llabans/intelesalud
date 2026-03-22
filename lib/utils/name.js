export function splitFullName(fullName, defaultFirst = 'Paciente', defaultLast = '') {
  const trimmed = (fullName || '').trim();
  if (!trimmed) return { firstName: defaultFirst, lastName: defaultLast };
  const [first, ...rest] = trimmed.split(' ');
  return { firstName: first, lastName: rest.join(' ') || defaultLast };
}
