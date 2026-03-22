export const ROLE_DASHBOARD_PATHS = {
  ADMIN: '/dashboard/admin',
  SPECIALIST: '/dashboard/specialist',
  PATIENT: '/portal',
};

export function isSpecialistRole(role) {
  return role === 'SPECIALIST';
}

export function getDashboardPathForRole(role) {
  return ROLE_DASHBOARD_PATHS[role] || ROLE_DASHBOARD_PATHS.PATIENT;
}
