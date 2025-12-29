'use client';

import { useAdminUser } from '../admin/AdminUserProvider';

export function usePermissions() {
  const user = useAdminUser();

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isAgent = user?.role === 'agent';
  const isViewer = isAgent; // Agent role is now view-only

  // Check if user can perform specific actions
  const canCreate = isAdmin || isManager;
  const canEdit = isAdmin || isManager;
  const canDelete = isAdmin || isManager;
  const canView = isAdmin || isManager || isAgent;

  // Check if user can access specific pages
  const canAccessHome = isAdmin || isManager;
  const canAccessRoles = isAdmin || isManager;
  const canAccessCars = canView;
  const canAccessContacts = canView;
  const canAccessRequests = canView;
  const canAccessFAQ = canView;

  return {
    user,
    isAdmin,
    isManager,
    isAgent,
    isViewer,
    canCreate,
    canEdit,
    canDelete,
    canView,
    canAccessHome,
    canAccessRoles,
    canAccessCars,
    canAccessContacts,
    canAccessRequests,
    canAccessFAQ,
  };
}
