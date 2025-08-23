// import { useState } from 'react';
// import { useCreateJob } from './hooks/useAdmin';

// const CreateJobModal = ({ isOpen, onClose }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     companyId: '',
//     type: 'company',
//     employmentType: 'full-time',
//     jobLevel: 'junior',
//     location: '',
//     remote: false,
//     skillsRequired: [],
//     openings: 1,
//   });
//   const createJob = useCreateJob();

//   const handleChange = (e) => {
//     const { name, value, type: inputType, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: inputType === 'checkbox' ? checked : name === 'openings' ? parseInt(value) || 1 : value,
//     }));
//   };

//   const handleSkillsChange = (e) => {
//     const skills = e.target.value.split(',').map((s) => s.trim()).filter((s) => s);
//     setFormData((prev) => ({ ...prev, skillsRequired: skills }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     createJob.mutate(formData, {
//       onSuccess: () => {
//         setFormData({
//           title: '',
//           description: '',
//           companyId: '',
//           type: 'company',
//           employmentType: 'full-time',
//           jobLevel: 'junior',
//           location: '',
//           remote: false,
//           skillsRequired: [],
//           openings: 1,
//         });
//         onClose();
//       },
//     });
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-20">
//       <div className="bg-white rounded-xl p-6 w-full max-w-md">
//         <h2 className="text-xl font-semibold mb-4">Create Job</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Title</label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               required
//             />
//           </div>
//          <div className='flex justify-between' >
//            <div>
//             <label className="block text-sm font-medium text-gray-600">Company ID</label>
//             <input
//               type="text"
//               name="companyId"
//               value={formData.companyId}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Type</label>
//             <select
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="company">Company</option>
//               <option value="referral">Referral</option>
//             </select>
//           </div>
//          </div>
         
// <div className='flex justify-between'>
//  <div>
//             <label className="block text-sm font-medium text-gray-600">Employment Type</label>
//             <select
//               name="employmentType"
//               value={formData.employmentType}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="full-time">Full-Time</option>
//               <option value="part-time">Part-Time</option>
//               <option value="contract">Contract</option>
//               <option value="internship">Internship</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Job Level</label>
//             <select
//               name="jobLevel"
//               value={formData.jobLevel}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="junior">Junior</option>
//               <option value="mid">Mid</option>
//               <option value="senior">Senior</option>
//               <option value="lead">Lead</option>
//             </select>
//           </div>
// </div>

// <div className='flex gap-4'>
//   <div>
//             <label className="block text-sm font-medium text-gray-600">Location</label>
//             <input
//               type="text"
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Remote</label>
//             <input
//               type="checkbox"
//               name="remote"
//               checked={formData.remote}
//               onChange={handleChange}
//               className="h-4 w-4 mr-2 text-indigo-600 focus:ring-indigo-500"
//             />
//              yes
//           </div>
// </div>

          
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Skills (comma-separated)</label>
//             <input
//               type="text"
//               value={formData.skillsRequired.join(', ')}
//               onChange={handleSkillsChange}
//               className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-600">Openings</label>
//             <input
//               type="number"
//               name="openings"
//               value={formData.openings}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               min="1"
//             />
//           </div>
//           <div className="flex gap-4">
//             <button
//               type="submit"
//               disabled={createJob.isLoading}
//               className="bg-gradient-to-r from-indigo-600 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-teal-600 transition duration-300"
//             >
//               Create
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="border px-4 py-2 rounded-lg hover:bg-gray-100"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateJobModal;




import { useState } from 'react';
import { useCreateJob } from './hooks/useAdmin';

const CreateJobModal = ({ isOpen, onClose }) => {

    const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyId: '',
    type: 'company',
    employmentType: 'full-time',
    jobLevel: 'junior',
    location: '',
    remote: false,
    skillsRequired: [],
    openings: 1,
  });
  const createJob = useCreateJob();

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : name === 'openings' ? parseInt(value) || 1 : value,
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map((s) => s.trim()).filter((s) => s);
    setFormData((prev) => ({ ...prev, skillsRequired: skills }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createJob.mutate(formData, {
      onSuccess: () => {
        setFormData({
          title: '',
          description: '',
          companyId: '',
          type: 'company',
          employmentType: 'full-time',
          jobLevel: 'junior',
          location: '',
          remote: false,
          skillsRequired: [],
          openings: 1,
        });
        onClose();
      },
    });
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 overflow-y-auto z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Create New Job</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Column 1 */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  placeholder="Software Engineer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  placeholder="Detailed job description..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company ID *</label>
                <input
                  type="text"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  placeholder="Company Identifier"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="company">Company</option>
                  <option value="referral">Referral</option>
                </select>
              </div>
            </div>
            
            {/* Column 2 */}
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Level</label>
                  <select
                    name="jobLevel"
                    value={formData.jobLevel}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="junior">Junior</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="City, Country"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remote Position</label>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      name="remote"
                      checked={formData.remote}
                      onChange={handleChange}
                      className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700">Yes, this is a remote position</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                <input
                  type="text"
                  value={formData.skillsRequired.join(', ')}
                  onChange={handleSkillsChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="JavaScript, React, Node.js"
                />
                <p className="mt-1 text-xs text-gray-500">Separate skills with commas</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Openings</label>
                <input
                  type="number"
                  name="openings"
                  value={formData.openings}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="1"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createJob.isLoading}
              className="bg-gradient-to-r from-indigo-600 to-teal-500 text-white px-5 py-2.5 rounded-lg font-medium hover:from-indigo-700 hover:to-teal-600 transition-all disabled:opacity-70"
            >
              {createJob.isLoading ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal;