export type Role = 'ADMIN' | 'MANAGER' | 'FULFILLMENT';

const TAB_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: ['home', 'analytics', 'explore', 'shop', 'chat', 'settings', 'help', 'users', 'trash'],
  MANAGER: ['home', 'analytics', 'explore', 'shop', 'chat', 'help', 'trash'],
  FULFILLMENT: ['home', 'chat', 'help'],
};

// The backend's AdminUser.role is a free-form string with no enum constraint — the
// only value actually in use today is "SUPER_ADMIN" (zyn-store's AdminUser schema
// default, and the login route falls back to "ADMIN" if it's ever empty). There is
// no backend-issued "Manager"/"Fulfillment" role yet. Match any role containing
// "ADMIN" as full access so a real admin account is never locked out by an
// unrecognized role string; anything else fails closed to the least-privileged tier.
function normalizeRole(role: string | undefined): Role {
  const upper = (role || '').toUpperCase();
  if (upper === 'MANAGER') return 'MANAGER';
  if (upper === 'FULFILLMENT') return 'FULFILLMENT';
  if (upper.includes('ADMIN')) return 'ADMIN';
  return 'FULFILLMENT';
}

export function canAccessTab(role: string | undefined, tab: string): boolean {
  return TAB_PERMISSIONS[normalizeRole(role)].includes(tab);
}
