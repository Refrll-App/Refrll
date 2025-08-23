import { useState } from 'react';
import { useCreateUser } from './hooks/useAdmin';

const CreateUserModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type: 'employee',
    roles: ['seeker'],
    currentRole: 'seeker',
    yearsOfExp: 0,
    location: '',
  });
  const createUser = useCreateUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'yearsOfExp' ? parseInt(value) || 0 : value,
      ...(name === 'type' && value === 'hr' ? { roles: ['hr'], currentRole: 'hr' } : {}),
      ...(name === 'type' && value === 'employee' ? { roles: ['seeker'], currentRole: 'seeker' } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser.mutate(formData, {
      onSuccess: () => {
        setFormData({
          name: '',
          email: '',
          password: '',
          type: 'employee',
          roles: ['seeker'],
          currentRole: 'seeker',
          yearsOfExp: 0,
          location: '',
        });
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Years of Experience</label>
            <input
              type="number"
              name="yearsOfExp"
              value={formData.yearsOfExp}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createUser.isLoading}
              className="bg-gradient-to-r from-indigo-600 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-teal-600 transition duration-300"
            >
              Create
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;