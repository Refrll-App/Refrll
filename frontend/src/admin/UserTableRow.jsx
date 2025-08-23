import { useState } from 'react';
import { useUpdateUser, useDeleteUser } from './hooks/useAdmin';
import { Trash2 } from 'lucide-react';

const UserTableRow = ({ user }) => {
  const [role, setRole] = useState(user.currentRole);
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    updateUser.mutate(
      { id: user._id, currentRole: newRole },
      {
        onError: () => setRole(user.currentRole), // Revert on error
      }
    );
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser.mutate(user._id);
    }
  };

  return (
    <tr className="border-b hover:bg-indigo-50 transition duration-300">
      <td className="p-4 text-sm">{user.name}</td>
      <td className="p-4 text-sm">{user.email}</td>
      <td className="p-4">
        <select
          value={role}
          onChange={handleRoleChange}
          className="p-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={updateUser.isLoading}
        >
          {user.roles.map((r) => (
            <option key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>
      </td>
      <td className="p-4">
        <button
          onClick={handleDelete}
          disabled={deleteUser.isLoading}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
};

export default UserTableRow;