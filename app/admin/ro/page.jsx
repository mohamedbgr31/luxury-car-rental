"use client"
import { useState, useEffect } from 'react';
import {
  Search, User, UserPlus, Trash2, Shield, ShieldAlert, Eye,
  Car, Filter, X, ChevronDown, LogOut, Home,
  CheckCircle
} from 'lucide-react';
import { useAdminUser } from '../AdminUserProvider';
import Sidebar from "@/components/ui/sidebar";


const roleDescriptions = {
  admin: "Full system access with ability to manage users and settings",
  manager: "Can manage vehicle listings and handle customer bookings",
  agent: "View-only access to system data and reports",
  client: "Access to personal bookings and vehicle browsing"
};

const roleColors = {
  admin: "from-amber-400 to-yellow-500",
  manager: "from-blue-400 to-cyan-500",
  agent: "from-pink-400 to-red-500",
  client: "from-purple-400 to-violet-500"
};

const RoleIcon = ({ role, size = 16 }) => {
  switch (role) {
    case 'admin':
      return <ShieldAlert size={size} className="text-amber-400" />;
    case 'manager':
      return <Shield size={size} className="text-blue-400" />;
    case 'agent':
      return <Shield size={size} className="text-pink-400" />;
    case 'client':
      return <Car size={size} className="text-purple-400" />;
    default:
      return <User size={size} className="text-gray-400" />;
  }
};

const RoleBadge = ({ role }) => (
  <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center w-fit bg-gradient-to-r ${roleColors[role]} text-black bg-opacity-90`}>
    <RoleIcon role={role} size={14} className="mr-1.5 text-black" />
    <span className="capitalize font-semibold">{role}</span>
  </span>
);

export default function RolesManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [newUser, setNewUser] = useState({
    name: '',
    phone: '',
    password: '',
    role: 'client'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const user = useAdminUser();
  const isManager = user?.role === 'manager';

  // Fetch users from backend
  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.map(u => ({ ...u, id: u._id })));
    }
    fetchUsers();
  }, []);

  // Filter and sort users based on search term, role filter, and sorting
  useEffect(() => {
    let result = [...users];
    if (searchTerm) {
      result = result.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }
    if (selectedRole !== 'all') {
      result = result.filter(user => user.role === selectedRole);
    }
    result.sort((a, b) => {
      let compareA = a[sortBy];
      let compareB = b[sortBy];
      if (sortBy === 'name' || sortBy === 'phone') {
        compareA = compareA.toLowerCase();
        compareB = compareB.toLowerCase();
      }
      if (sortOrder === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });
    setFilteredUsers(result);
  }, [searchTerm, selectedRole, users, sortBy, sortOrder]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(users => users.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        ));
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ ...selectedUser, role: newRole });
        }
        if (selectedUser) {
          setSuccessMessage(`${selectedUser.name}'s role updated to ${newRole}`);
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 3000);
        }
      } else {
        setSuccessMessage('Failed to update role.');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      }
    } catch (error) {
      setSuccessMessage('Error updating role.');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const deleteUser = async (userId) => {
    setUsers(users => users.filter(user => user.id !== userId));
    closeModal();
    setSuccessMessage('User removed (UI only, implement backend for real delete).');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const toggleFilterMenu = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRole('all');
    setSortBy('name');
    setSortOrder('asc');
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.phone || !newUser.password) {
      setSuccessMessage('Name, phone, and password are required.');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      return;
    }
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (res.ok) {
        const data = await res.json();
        setUsers([...users, { ...data, id: data._id }]);
        setIsAddUserModalOpen(false);
        setNewUser({ name: '', phone: '', password: '', role: 'client' });
        setSuccessMessage('User added successfully');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        setSuccessMessage('Failed to add user');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      }
    } catch (error) {
      setSuccessMessage('Error adding user');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  return (
    <div className="bg-black flex min-h-screen relative font-bruno text-white">
      <div className="hidden lg:block fixed h-screen z-10">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col min-h-screen lg:ml-72 xl:ml-80">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-yellow-500">User Management</h1>
            {!isManager && (
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <UserPlus className="w-5 h-5" />
                Add User
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {[
              { role: 'admin', count: users.filter(u => u.role === 'admin').length },
              { role: 'manager', count: users.filter(u => u.role === 'manager').length },
              { role: 'agent', count: users.filter(u => u.role === 'agent').length },
              { role: 'client', count: users.filter(u => u.role === 'client').length }
            ].map(item => (
              <div key={item.role} className="bg-neutral-900 rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 border border-neutral-700 hover:border-neutral-600 transition-all hover:shadow-lg">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="p-2 sm:p-2.5 lg:p-3 rounded-lg lg:rounded-xl bg-neutral-800 border border-neutral-700">
                    <RoleIcon role={item.role} size={18} className="sm:w-6 sm:h-6 lg:w-6 lg:h-6" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {item.count}
                  </div>
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold capitalize text-white mb-1">{item.role}s</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{roleDescriptions[item.role]}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="mb-6 bg-neutral-900 p-4 sm:p-5 lg:p-6 rounded-xl lg:rounded-2xl border border-neutral-700">
            <div className="flex flex-col gap-4 items-stretch">
              <div className="relative flex-grow">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search users by name or phone..."
                  className="bg-neutral-800 border border-neutral-700 rounded-lg sm:rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 w-full focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-gray-400 transition-all text-sm sm:text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-3 items-center flex-wrap sm:flex-nowrap">
                <select
                  className="bg-neutral-800 border border-neutral-700 rounded-lg sm:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white appearance-none pr-8 sm:pr-10 flex-1 sm:flex-none min-w-0 sm:min-w-[140px] text-sm sm:text-base"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23F59E0B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1rem"
                  }}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="agent">Agent</option>
                  <option value="client">Client</option>
                </select>

                <button
                  onClick={toggleFilterMenu}
                  className="bg-neutral-800 border border-neutral-700 rounded-lg sm:rounded-xl p-2.5 sm:p-3 hover:bg-neutral-700 transition-colors"
                >
                  <Filter size={18} className="text-amber-400" />
                </button>

                {(searchTerm || selectedRole !== 'all' || sortBy !== 'name' || sortOrder !== 'asc') && (
                  <button
                    onClick={clearFilters}
                    className="bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm hover:bg-red-500/20 transition-colors flex items-center gap-2 flex-shrink-0"
                  >
                    <X size={12} />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Advanced filter options */}
            {isFilterOpen && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-neutral-700">
                <h4 className="font-medium mb-3 sm:mb-4 text-amber-400 text-sm sm:text-base">Sort Options</h4>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {[
                    { label: 'Name (A-Z)', field: 'name', order: 'asc' },
                    { label: 'Name (Z-A)', field: 'name', order: 'desc' },
                    { label: 'Most Recent', field: 'lastActive', order: 'asc' }
                  ].map(option => (
                    <button
                      key={`${option.field}-${option.order}`}
                      onClick={() => {
                        setSortBy(option.field);
                        setSortOrder(option.order);
                      }}
                      className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm border transition-all ${sortBy === option.field && sortOrder === option.order
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-medium border-transparent'
                          : 'bg-neutral-800 text-gray-300 border-neutral-700 hover:border-neutral-600 hover:bg-neutral-700'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Users Table */}
          <div className="bg-neutral-900 rounded-xl lg:rounded-2xl border border-neutral-700 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-700 bg-neutral-800/50">
                    <th className="text-left p-3 sm:p-4 lg:p-6 font-medium text-amber-400 text-sm sm:text-base">
                      <button
                        className="flex items-center gap-2 hover:text-amber-300 transition-colors"
                        onClick={() => handleSort('name')}
                      >
                        User
                        {sortBy === 'name' && (
                          <ChevronDown
                            size={14}
                            className={`transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </button>
                    </th>
                    <th className="text-left p-3 sm:p-4 lg:p-6 font-medium text-amber-400 hidden md:table-cell text-sm sm:text-base">
                      <button
                        className="flex items-center gap-2 hover:text-amber-300 transition-colors"
                        onClick={() => handleSort('phone')}
                      >
                        Phone
                        {sortBy === 'phone' && (
                          <ChevronDown
                            size={14}
                            className={`transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </button>
                    </th>
                    <th className="text-left p-3 sm:p-4 lg:p-6 font-medium text-amber-400 text-sm sm:text-base">Role</th>
                    <th className="text-center p-3 sm:p-4 lg:p-6 font-medium text-amber-400 text-sm sm:text-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-neutral-800 hover:bg-neutral-800/30 transition-colors">
                      <td className="p-3 sm:p-4 lg:p-6">
                        <div className="flex items-center">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center mr-3 lg:mr-4 border border-neutral-600 text-white font-semibold text-xs sm:text-sm lg:text-base">
                            {user.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-white text-sm sm:text-base lg:text-lg truncate">{user.name}</div>
                            <div className="text-xs sm:text-sm text-gray-400 md:hidden">{user.phone}</div>
                            <div className="text-xs sm:text-sm text-gray-400 hidden md:block">{user.lastActive}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 lg:p-6 text-gray-300 hidden md:table-cell text-sm sm:text-base">{user.phone}</td>
                      <td className="p-3 sm:p-4 lg:p-6">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="p-3 sm:p-4 lg:p-6">
                        {!isManager && (
                          <div className="flex justify-center">
                            <button
                              onClick={() => openModal(user)}
                              className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 rounded-lg lg:rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all font-medium text-xs sm:text-sm"
                            >
                              Manage
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 sm:p-12 text-center text-gray-400">
                        <div className="flex flex-col items-center space-y-4">
                          <Search size={32} className="sm:w-12 sm:h-12 text-gray-600" />
                          <p className="text-base sm:text-lg">No users found matching your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-neutral-700 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between bg-neutral-800/30 gap-4 sm:gap-0">
              <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
                Showing <span className="font-medium text-white">{filteredUsers.length}</span> of <span className="font-medium text-white">{users.length}</span> users
              </div>
              <div className="flex gap-2">
                <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-800 border border-neutral-700 rounded-lg lg:rounded-xl text-gray-400 hover:bg-neutral-700 disabled:opacity-50 transition-colors text-xs sm:text-sm" disabled>
                  Previous
                </button>
                <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-lg lg:rounded-xl font-medium text-xs sm:text-sm">
                  1
                </button>
                <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-800 border border-neutral-700 rounded-lg lg:rounded-xl text-gray-400 hover:bg-neutral-700 disabled:opacity-50 transition-colors text-xs sm:text-sm" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal for changing role */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 rounded-xl lg:rounded-2xl border border-neutral-700 p-6 sm:p-8 w-full max-w-md shadow-2xl mx-4">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Manage User</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="mb-6 sm:mb-8 flex items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl lg:rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center mr-4 text-lg sm:text-xl font-bold border border-neutral-600 text-white">
                {selectedUser.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-lg sm:text-xl font-medium text-white truncate">{selectedUser.name}</h4>
                <p className="text-gray-400 text-sm sm:text-base truncate">{selectedUser.phone}</p>
              </div>
            </div>

            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-medium text-amber-400 text-sm sm:text-base">Current Role:</span>
                <RoleBadge role={selectedUser.role} />
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mb-6 bg-neutral-800 p-3 sm:p-4 rounded-lg lg:rounded-xl border border-neutral-700">
                {roleDescriptions[selectedUser.role]}
              </p>

              <label className="block text-amber-400 mb-4 font-medium text-sm sm:text-base">Change Role</label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {['admin', 'manager', 'agent', 'client'].map(role => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(selectedUser.id, role)}
                    className={`flex items-center p-3 sm:p-4 rounded-lg lg:rounded-xl border transition-all text-sm sm:text-base ${selectedUser.role === role
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black border-transparent font-semibold'
                        : 'bg-neutral-800 text-gray-300 border-neutral-700 hover:border-neutral-600 hover:bg-neutral-700'
                      }`}
                  >
                    <RoleIcon role={role} className="mr-2 sm:mr-3" size={16} />
                    <span className="capitalize truncate">{role}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-700 pt-6">
              <button
                onClick={() => deleteUser(selectedUser.id)}
                className="flex items-center justify-center gap-2 sm:gap-3 w-full py-2.5 sm:py-3 rounded-lg lg:rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all font-medium text-sm sm:text-base"
              >
                <Trash2 size={16} />
                <span>Remove User</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding new user */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 rounded-xl lg:rounded-2xl border border-neutral-700 p-6 sm:p-8 w-full max-w-md shadow-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Add New User</h3>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              <div>
                <label className="block text-amber-400 mb-2 sm:mb-3 font-medium text-sm sm:text-base">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="bg-neutral-800 border border-neutral-700 rounded-lg lg:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 w-full focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-gray-400 transition-all text-sm sm:text-base"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-amber-400 mb-2 sm:mb-3 font-medium text-sm sm:text-base">Phone</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="bg-neutral-800 border border-neutral-700 rounded-lg lg:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 w-full focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-gray-400 transition-all text-sm sm:text-base"
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <label className="block text-amber-400 mb-2 sm:mb-3 font-medium text-sm sm:text-base">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="bg-neutral-800 border border-neutral-700 rounded-lg lg:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 w-full focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-gray-400 transition-all text-sm sm:text-base"
                  placeholder="Password"
                />
              </div>

              <div>
                <label className="block text-amber-400 mb-2 sm:mb-3 font-medium text-sm sm:text-base">Role</label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {['admin', 'manager', 'agent', 'client'].map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setNewUser({ ...newUser, role })}
                      className={`flex items-center p-3 sm:p-4 rounded-lg lg:rounded-xl border transition-all text-sm sm:text-base ${newUser.role === role
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black border-transparent font-semibold'
                          : 'bg-neutral-800 text-gray-300 border-neutral-700 hover:border-neutral-600 hover:bg-neutral-700'
                        }`}
                    >
                      <RoleIcon role={role} className="mr-2 sm:mr-3" size={16} />
                      <span className="capitalize truncate">{role}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="flex-1 py-2.5 sm:py-3 rounded-lg lg:rounded-xl bg-neutral-800 border border-neutral-700 text-gray-300 hover:bg-neutral-700 hover:border-neutral-600 transition-all font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={!newUser.name || !newUser.phone || !newUser.password}
                className="flex-1 py-2.5 sm:py-3 rounded-lg lg:rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-semibold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 animate-fade-in max-w-[calc(100vw-2rem)] sm:max-w-md">
          <div className="bg-emerald-900/90 backdrop-blur-sm text-emerald-100 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-emerald-500/30 shadow-xl shadow-emerald-500/10 flex items-center gap-3">
            <CheckCircle className="text-emerald-400 flex-shrink-0" size={18} />
            <p className="font-medium text-sm sm:text-base">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Add CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}