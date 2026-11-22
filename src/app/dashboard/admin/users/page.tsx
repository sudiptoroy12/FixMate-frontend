
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  UserRound,
  ShieldCheck,
  Wrench,
  Mail,
  CalendarDays,
  Eye,
  X,
  AlertCircle,
  CheckCircle2,
  Filter,
  Image as ImageIcon,
  Save,
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/(getToken)/getTokenFromClient";

// ========================================
// TYPES
// ========================================

type UserRole = "customer" | "technician" | "admin";

interface AdminUser {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

type RoleFilter = "all" | UserRole | "unknown";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const filters: { label: string; value: RoleFilter }[] = [
  { label: "All Users", value: "all" },
  { label: "Customers", value: "customer" },
  { label: "Technicians", value: "technician" },
  { label: "Admins", value: "admin" },
  { label: "Unknown", value: "unknown" },
];

const availableRoles: UserRole[] = [
  "customer",
  "technician",
  "admin",
];

// ========================================
// HELPERS
// ========================================

const normalizeRole = (role?: string): RoleFilter => {
  const normalized = role?.toLowerCase().trim();

  if (
    normalized === "customer" ||
    normalized === "technician" ||
    normalized === "admin"
  ) {
    return normalized;
  }

  return "unknown";
};

const formatDate = (date?: string) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name?: string) => {
  if (!name?.trim()) return "U";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

// ========================================
// API REQUESTS
// ========================================

const getAuthToken = async () => {
  const token = await getTokenFromClient();

  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  return token;
};

const requestUsers = async (): Promise<AdminUser[]> => {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/api/admin/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result: ApiResponse<AdminUser[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to retrieve users.");
  }

  return Array.isArray(result.data) ? result.data : [];
};

const updateUserRole = async (
  userId: string,
  role: UserRole
): Promise<AdminUser> => {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const token = await getAuthToken();

  const response = await fetch(
    `${API_URL}/api/admin/users/${encodeURIComponent(userId)}/role`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    }
  );

  const result: ApiResponse<AdminUser> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update user role.");
  }

  return result.data;
};

// ========================================
// MAIN PAGE
// ========================================

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<RoleFilter>("all");

  const [selectedUser, setSelectedUser] =
    useState<AdminUser | null>(null);

  const [roleChanges, setRoleChanges] = useState<
    Record<string, UserRole>
  >({});

  const [updatingUserId, setUpdatingUserId] = useState<string | null>(
    null
  );

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ========================================
  // CURRENT LOGGED-IN ADMIN
  // ========================================

  const {
    data: session,
    isPending: sessionLoading,
  } = authClient.useSession();

  const currentUserId = session?.user?.id;

  const currentUserEmail = session?.user?.email?.toLowerCase();

  const isCurrentUser = (user: AdminUser) => {
    return (
      (!!currentUserId &&
        String(user._id) === String(currentUserId)) ||
      (!!currentUserEmail &&
        user.email?.toLowerCase() === currentUserEmail)
    );
  };

  // ========================================
  // INITIAL DATA FETCH
  // ========================================

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const data = await requestUsers();

        if (isMounted) {
          setUsers(data);
        }
      } catch (err) {
        console.error("Fetch admin users error:", err);

        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while fetching users."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  // ========================================
  // MANUAL REFRESH
  // ========================================

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      setError("");
      setSuccessMessage("");

      const data = await requestUsers();

      setUsers(data);
      setRoleChanges({});
      setSuccessMessage("Users refreshed successfully.");
    } catch (err) {
      console.error("Refresh admin users error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while refreshing users."
      );
    } finally {
      setRefreshing(false);
    }
  };

  // ========================================
  // HANDLE ROLE SELECTION
  // ========================================

  const handleRoleChange = (userId: string, role: UserRole) => {
    setRoleChanges((previous) => ({
      ...previous,
      [userId]: role,
    }));

    setError("");
    setSuccessMessage("");
  };

  // ========================================
  // SAVE USER ROLE
  // ========================================

  const handleUpdateRole = async (user: AdminUser) => {
    // Prevent changing the current admin's own role.
    if (sessionLoading) return;

    if (isCurrentUser(user)) {
      setError("You cannot change your own role.");
      return;
    }

    const newRole = roleChanges[user._id];

    if (!newRole) return;

    if (newRole === normalizeRole(user.role)) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to change ${
        user.name || user.email || "this user"
      }'s role to ${newRole}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingUserId(user._id);
      setError("");
      setSuccessMessage("");

      const updatedUser = await updateUserRole(user._id, newRole);

      // Update the user in the table.
      setUsers((previous) =>
        previous.map((item) =>
          item._id === user._id
            ? {
                ...item,
                ...updatedUser,
                role: newRole,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );

      // Update the selected user in the details modal.
      setSelectedUser((previous) =>
        previous?._id === user._id
          ? {
              ...previous,
              ...updatedUser,
              role: newRole,
              updatedAt: new Date().toISOString(),
            }
          : previous
      );

      // Remove the saved draft for this user.
      setRoleChanges((previous) => {
        const updated = { ...previous };
        delete updated[user._id];
        return updated;
      });

      setSuccessMessage(
        `${user.name || "User"}'s role has been updated to ${newRole}.`
      );
    } catch (err) {
      console.error("Update user role error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the user role."
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  // ========================================
  // FILTER USERS
  // ========================================

  const filteredUsers = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return users.filter((user) => {
      const role = normalizeRole(user.role);

      const matchesFilter =
        activeFilter === "all" || role === activeFilter;

      const matchesSearch =
        !searchText ||
        user.name?.toLowerCase().includes(searchText) ||
        user.email?.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [users, search, activeFilter]);

  // ========================================
  // USER STATISTICS
  // ========================================

  const stats = useMemo(() => {
    return {
      total: users.length,
      customers: users.filter(
        (user) => normalizeRole(user.role) === "customer"
      ).length,
      technicians: users.filter(
        (user) => normalizeRole(user.role) === "technician"
      ).length,
      admins: users.filter(
        (user) => normalizeRole(user.role) === "admin"
      ).length,
    };
  }, [users]);

  // ========================================
  // ROLE COUNTS
  // ========================================

  const getRoleCount = (role: RoleFilter) => {
    if (role === "all") return users.length;

    return users.filter(
      (user) => normalizeRole(user.role) === role
    ).length;
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Users Management
            </h1>

            <p className="mt-1 text-sm text-muted">
              View and manage registered FixMate users.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          disabled={refreshing || loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />

          <p className="flex-1">{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600">
          <CheckCircle2 size={19} />

          <p className="flex-1">{successMessage}</p>

          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            aria-label="Dismiss success message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.total}
          icon={<Users size={21} />}
          color="text-primary"
          bg="bg-primary/10"
        />

        <StatCard
          title="Customers"
          value={stats.customers}
          icon={<UserRound size={21} />}
          color="text-blue-600"
          bg="bg-blue-500/10"
        />

        <StatCard
          title="Technicians"
          value={stats.technicians}
          icon={<Wrench size={21} />}
          color="text-amber-600"
          bg="bg-amber-500/10"
        />

        <StatCard
          title="Admins"
          value={stats.admins}
          icon={<ShieldCheck size={21} />}
          color="text-purple-600"
          bg="bg-purple-500/10"
        />
      </div>

      {/* Main Content */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Search and Filters */}
        <div className="space-y-4 border-b border-border p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                All Users
              </h2>

              <p className="mt-1 text-sm text-muted">
                {filteredUsers.length} of {users.length} users
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full rounded-xl border border-border bg-surface-secondary py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary"
              />
            </div>
          </div>

          {/* Role Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="mr-1 text-muted" />

            {filters.map((filter) => {
              const isActive = activeFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-surface-secondary text-muted hover:text-foreground"
                  }`}
                >
                  {filter.label}

                  <span className="ml-2 text-xs opacity-75">
                    {getRoleCount(filter.value)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="space-y-4 p-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-xl bg-surface-secondary"
              />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-secondary text-muted">
              <Users size={28} />
            </div>

            <h3 className="text-lg font-semibold text-foreground">
              No users found
            </h3>

            <p className="mt-2 max-w-sm text-sm text-muted">
              {search || activeFilter !== "all"
                ? "Try changing your search keywords or filters."
                : "There are currently no registered users."}
            </p>

            {(search || activeFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveFilter("all");
                }}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          /* Users Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="border-b border-border bg-surface-secondary/60 text-xs uppercase tracking-wider text-muted">
                  <th className="px-5 py-4 font-semibold">User</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Current Role</th>
                  <th className="px-5 py-4 font-semibold">Change Role</th>
                  <th className="px-5 py-4 font-semibold">Joined</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => {
                  const currentRole = normalizeRole(user.role);

                  // Check whether this is the logged-in admin.
                  const isSelf = isCurrentUser(user);

                  const selectedRole =
                    roleChanges[user._id] ??
                    (currentRole === "unknown"
                      ? "customer"
                      : currentRole);

                  const hasRoleChanged =
                    selectedRole !== currentRole;

                  const isUpdating = updatingUserId === user._id;

                  return (
                    <tr
                      key={user._id}
                      className="transition hover:bg-surface-secondary/40"
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={user} />

                          <div className="min-w-0">
                            <p className="max-w-[200px] truncate text-sm font-semibold text-foreground">
                              {user.name || "Unnamed User"}
                            </p>

                            <p className="mt-1 text-xs text-muted">
                              ID: {user._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        <p className="max-w-[220px] truncate text-sm text-foreground">
                          {user.email || "N/A"}
                        </p>

                        {user.emailVerified && (
                          <span className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-600">
                            <CheckCircle2 size={12} />
                            Verified
                          </span>
                        )}
                      </td>

                      {/* Current Role */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col items-start gap-2">
                          <RoleBadge role={user.role} />

                          {isSelf && (
                            <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                              You
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Change Role */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedRole}
                            onChange={(e) =>
                              handleRoleChange(
                                user._id,
                                e.target.value as UserRole
                              )
                            }
                            disabled={
                              isSelf ||
                              isUpdating ||
                              sessionLoading
                            }
                            aria-label={`Change role for ${
                              user.name || user.email
                            }`}
                            className="min-w-[130px] rounded-lg border border-border bg-surface-secondary px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {availableRoles.map((role) => (
                              <option key={role} value={role}>
                                {role.charAt(0).toUpperCase() +
                                  role.slice(1)}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => handleUpdateRole(user)}
                            disabled={
                              isSelf ||
                              !hasRoleChanged ||
                              isUpdating ||
                              updatingUserId !== null ||
                              sessionLoading
                            }
                            title={
                              isSelf
                                ? "You cannot change your own role"
                                : "Save role change"
                            }
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {isUpdating ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Save size={15} />
                            )}

                            Update
                          </button>
                        </div>

                        {isSelf && (
                          <p className="mt-2 text-xs text-muted">
                            You cannot change your own role.
                          </p>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4 text-sm text-muted">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <ActionButton
                            title="View user details"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye size={16} />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && filteredUsers.length > 0 && (
          <div className="border-t border-border px-5 py-4">
            <p className="text-xs text-muted">
              Showing {filteredUsers.length} user
              {filteredUsers.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface p-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  User Details
                </h2>

                <p className="mt-1 text-xs text-muted">
                  Registered user information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-muted transition hover:bg-surface-secondary hover:text-foreground"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* User Profile */}
              <div className="flex flex-col items-center rounded-xl border border-border bg-surface-secondary p-6 text-center">
                <UserAvatar user={selectedUser} large />

                <h3 className="mt-3 text-lg font-bold text-foreground">
                  {selectedUser.name || "Unnamed User"}
                </h3>

                <p className="mt-1 break-all text-sm text-muted">
                  {selectedUser.email || "No email available"}
                </p>

                <div className="mt-3">
                  <RoleBadge role={selectedUser.role} />
                </div>

                {isCurrentUser(selectedUser) && (
                  <span className="mt-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Your account
                  </span>
                )}
              </div>

              {/* User Information */}
              <div className="space-y-4">
                <DetailItem
                  icon={<UserRound size={17} />}
                  label="Full Name"
                  value={selectedUser.name || "N/A"}
                />

                <DetailItem
                  icon={<Mail size={17} />}
                  label="Email Address"
                  value={selectedUser.email || "N/A"}
                />

                <DetailItem
                  icon={<ShieldCheck size={17} />}
                  label="Account Role"
                  value={selectedUser.role || "Not assigned"}
                />

                <DetailItem
                  icon={<CheckCircle2 size={17} />}
                  label="Email Verification"
                  value={
                    selectedUser.emailVerified
                      ? "Verified"
                      : "Not verified"
                  }
                />

                <DetailItem
                  icon={<CalendarDays size={17} />}
                  label="Registration Date"
                  value={formatDate(selectedUser.createdAt)}
                />

                <DetailItem
                  icon={<CalendarDays size={17} />}
                  label="Last Updated"
                  value={formatDate(selectedUser.updatedAt)}
                />
              </div>

              {/* User ID */}
              <div className="rounded-xl border border-border bg-surface-secondary p-4">
                <p className="text-xs text-muted">User ID</p>

                <p className="mt-2 break-all text-sm font-medium text-foreground">
                  {selectedUser._id}
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================
// REUSABLE COMPONENTS
// ========================================

function StatCard({
  title,
  value,
  icon,
  color,
  bg,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted sm:text-sm">
          {title}
        </p>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
        {value}
      </p>
    </div>
  );
}

function RoleBadge({ role }: { role?: string }) {
  const normalized = normalizeRole(role);

  const styles: Record<RoleFilter, string> = {
    all: "",
    customer: "bg-blue-500/10 text-blue-600",
    technician: "bg-amber-500/10 text-amber-600",
    admin: "bg-purple-500/10 text-purple-600",
    unknown: "bg-gray-500/10 text-gray-500",
  };

  const icons: Record<RoleFilter, React.ReactNode> = {
    all: null,
    customer: <UserRound size={13} />,
    technician: <Wrench size={13} />,
    admin: <ShieldCheck size={13} />,
    unknown: <Users size={13} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${styles[normalized]}`}
    >
      {icons[normalized]}
      {normalized}
    </span>
  );
}

function UserAvatar({
  user,
  large = false,
}: {
  user: AdminUser;
  large?: boolean;
}) {
  const [imageError, setImageError] = useState(false);

  const size = large ? "h-20 w-20 text-xl" : "h-11 w-11 text-sm";

  if (!user.image || imageError) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary ${size}`}
      >
        {user.image && imageError ? (
          <ImageIcon size={large ? 28 : 18} />
        ) : (
          getInitials(user.name)
        )}
      </div>
    );
  }

  return (
    <img
      src={user.image}
      alt={user.name || "User"}
      onError={() => setImageError(true)}
      className={`shrink-0 rounded-full border border-border object-cover ${size}`}
    />
  );
}

function ActionButton({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-secondary text-muted transition hover:text-foreground"
    >
      {children}
    </button>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-primary">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>

        <p className="mt-1 break-words text-sm font-medium text-foreground">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}
