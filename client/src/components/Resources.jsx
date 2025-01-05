// // src/components/Resources.jsx
// import React, { useState, useEffect } from 'react';
// import { PieChart, Pie, Cell } from 'recharts';
// import { useResources } from '../context/ResourceContext';

// const COLORS = ['#0088FE', '#00C49F'];

// // Individual Resource Component
// const Resource = ({ id, name, used, available, onDelete }) => {
//   const data = [
//     { name: 'Used', value: used },
//     { name: 'Available', value: available },
//   ];

//   return (
//     <div className="border p-4 mb-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 flex justify-between items-center">
//       <div>
//         <h3 className="font-bold text-lg text-gray-800">{name}</h3>
//         <p className="text-gray-600 text-sm">Used: {used}%</p>
//         <p className="text-gray-600 text-sm">Available: {available}%</p>
//       </div>

//       {/* Mini Pie Chart for each resource */}
//       <PieChart width={80} height={80}>
//         <Pie
//           data={data}
//           dataKey="value"
//           cx="50%"
//           cy="50%"
//           outerRadius={35}
//           fill="#8884d8"
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index]} />
//           ))}
//         </Pie>
//       </PieChart>

//       {/* Delete Button */}
//       <button
//         onClick={() => onDelete(id)}
//         className="ml-4 text-red-500 hover:text-red-700 transition-colors"
//         aria-label={`Delete ${name}`}
//       >
//         Delete
//       </button>
//     </div>
//   );
// };

// // Main Resources Component
// const Resources = () => {
//   const { resources, setResources } = useResources();
//   const [newResource, setNewResource] = useState({ name: '', used: '', available: '' });
//   const [view, setView] = useState('requested');

//   useEffect(() => {
//     // Set initial resources on first render
//     if (resources.length === 0) {
//       const initialResources = [
//         { id: 1, name: 'Coal', used: 60, available: 40 },
//         { id: 2, name: 'Electricity', used: 30, available: 70 },
//         { id: 3, name: 'Labor', used: 80, available: 20 },
//         { id: 4, name: 'Water', used: 50, available: 50 },
//       ];
//       setResources(initialResources);
//     }
//   }, [resources, setResources]);

//   const handleAddResource = () => {
//     const { name, used, available } = newResource;
//     if (!name || used < 0 || available < 0 || used + available > 100) return;

//     const id = resources.length + 1;
//     const newRes = {
//       id,
//       name,
//       used: parseInt(used),
//       available: parseInt(available),
//     };

//     setResources([...resources, newRes]);
//     setNewResource({ name: '', used: '', available: '' });
//   };

//   const handleDeleteResource = (id) => {
//     setResources(resources.filter((resource) => resource.id !== id));
//   };

//   const handleClearUsed = () => {
//     setResources(resources.filter((resource) => resource.available > 0));
//   };

//   const handleClearAll = () => {
//     if (window.confirm('Are you sure you want to clear all resources?')) {
//       setResources([]);
//     }
//   };

//   const currentResources = resources.filter((resource) => resource.available > 0);
//   const usedResources = resources.filter((resource) => resource.available === 0);

//   return (
//     <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100 min-h-screen">
//       <div className="w-full md:w-1/2">
//         <div className="mb-6">
//           <button
//             onClick={() => setView('requested')}
//             className={`px-4 py-2 rounded-md mr-2 ${view === 'requested' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
//           >
//             Resources Requested
//           </button>
//           <button
//             onClick={() => setView('allocated')}
//             className={`px-4 py-2 rounded-md ${view === 'allocated' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
//           >
//             Resources Allocated
//           </button>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
//           <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add Resource</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//             <input
//               type="text"
//               placeholder="Resource Name"
//               value={newResource.name}
//               onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
//               className="p-2 border border-gray-300 rounded-md"
//             />
//             <input
//               type="number"
//               placeholder="Used (%)"
//               value={newResource.used}
//               onChange={(e) => setNewResource({ ...newResource, used: e.target.value })}
//               className="p-2 border border-gray-300 rounded-md"
//             />
//             <input
//               type="number"
//               placeholder="Available (%)"
//               value={newResource.available}
//               onChange={(e) => setNewResource({ ...newResource, available: e.target.value })}
//               className="p-2 border border-gray-300 rounded-md"
//             />
//           </div>
//           <button
//             onClick={handleAddResource}
//             className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
//           >
//             Add Resource
//           </button>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           {view === 'requested' ? (
//             <>
//               <h2 className="text-2xl font-semibold mb-4 text-gray-800">Resources Requested</h2>
//               <div>
//                 {currentResources.map((resource) => (
//                   <Resource
//                     key={resource.id}
//                     id={resource.id}
//                     name={resource.name}
//                     used={resource.used}
//                     available={resource.available}
//                     onDelete={handleDeleteResource}
//                   />
//                 ))}
//               </div>
//             </>
//           ) : (
//             <>
//               <h2 className="text-2xl font-semibold mb-4 text-gray-800">Resources Allocated</h2>
//               <div>
//                 {usedResources.map((resource) => (
//                   <Resource
//                     key={resource.id}
//                     id={resource.id}
//                     name={resource.name}
//                     used={resource.used}
//                     available={resource.available}
//                     onDelete={handleDeleteResource}
//                   />
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         <div className="flex gap-4 mt-6">
//           <button
//             onClick={handleClearUsed}
//             className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
//           >
//             Clear Used Resources
//           </button>
//           <button
//             onClick={handleClearAll}
//             className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
//           >
//             Clear All Resources
//           </button>
//         </div>
//       </div>
      
//       <div className="w-full md:w-1/2">
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h2 className="text-2xl font-semibold mb-4 text-gray-800">Current Resources</h2>
//           <div>
//             {resources.map((resource) => (
//               <Resource
//                 key={resource.id}
//                 id={resource.id}
//                 name={resource.name}
//                 used={resource.used}
//                 available={resource.available}
//                 onDelete={handleDeleteResource}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Resources;
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
  AiOutlineUndo,
  AiOutlineBulb,
} from 'react-icons/ai';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB'];

// Generate random color for charts
const getRandomColor = (index) => COLORS[index % COLORS.length];

// Individual Resource Component
const Resource = ({ id, name, used, available, onDelete, onEdit, color }) => {
  const data = [
    { name: 'Used', value: used },
    { name: 'Available', value: available },
  ];

  return (
    <motion.div
      className="border p-4 mb-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 flex justify-between items-center"
      style={{ backgroundColor: `${color}10` }} // Light color background
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div>
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-sm">Used: {used}%</p>
        <p className="text-sm">Available: {available}%</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className="h-2.5 rounded-full"
            style={{ width: `${used}%`, backgroundColor: color }}
          ></div>
        </div>
      </div>

      {/* Mini Pie Chart */}
      <PieChart width={80} height={80}>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={35}
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === 0 ? color : '#d3d3d3'} />
          ))}
        </Pie>
      </PieChart>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(id)}
          className="text-blue-500 hover:text-blue-700 transition-colors tooltip"
        >
          <AiOutlineEdit size={20} />
          <span className="tooltip-text">Edit</span>
        </button>
        <button
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-700 transition-colors tooltip"
        >
          <AiOutlineDelete size={20} />
          <span className="tooltip-text">Delete</span>
        </button>
      </div>
    </motion.div>
  );
};

// Main Resources Component
const Resources = () => {
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ name: '', used: '', available: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [darkMode, setDarkMode] = useState(false);
  const [deletedResource, setDeletedResource] = useState(null);

  useEffect(() => {
    // Set initial resources on first render
    const initialResources = [
      { id: 1, name: 'Coal', used: 60, available: 40 },
      { id: 2, name: 'Electricity', used: 30, available: 70 },
      { id: 3, name: 'Labor', used: 80, available: 20 },
      { id: 4, name: 'Water', used: 50, available: 50 },
    ];
    setResources(initialResources);
  }, []);

  const handleAddResource = () => {
    const { name, used, available } = newResource;
    if (!name || used < 0 || available < 0 || used + available !== 100) {
      alert('Invalid input. Ensure Used + Available = 100.');
      return;
    }

    const id = editingId || resources.length + 1;
    const newRes = {
      id,
      name,
      used: parseInt(used),
      available: parseInt(available),
    };

    if (editingId) {
      setResources(
        resources.map((resource) => (resource.id === editingId ? newRes : resource))
      );
      setEditingId(null);
    } else {
      setResources([...resources, newRes]);
    }

    setNewResource({ name: '', used: '', available: '' });
  };

  const handleDeleteResource = (id) => {
    const resourceToDelete = resources.find((resource) => resource.id === id);
    setDeletedResource(resourceToDelete);

    // Remove resource
    setResources(resources.filter((resource) => resource.id !== id));
  };

  const handleUndoDelete = () => {
    if (deletedResource) {
      setResources([...resources, deletedResource]);
      setDeletedResource(null);
    }
  };

  const handleEditResource = (id) => {
    const resourceToEdit = resources.find((resource) => resource.id === id);
    setNewResource(resourceToEdit);
    setEditingId(id);
  };

  const handleSortResources = () => {
    const sorted = [...resources].sort((a, b) => {
      if (sortOrder === 'asc') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
    setResources(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredResources = resources.filter((resource) =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(resources);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setResources(items);
  };

  return (
    <div
      className={`p-6 min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}
    >
      <motion.div
        className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {darkMode ? '🌙' : '☀️'} Manage Resources
          </h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-300 dark:bg-gray-700 p-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            <AiOutlineBulb size={20} />
          </button>
        </div>

        {/* Search Bar and Sort */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-3/4 p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleSortResources}
            className="bg-gray-200 p-2 rounded-md hover:bg-gray-300 transition"
          >
            {sortOrder === 'asc' ? (
              <AiOutlineSortAscending size={20} />
            ) : (
              <AiOutlineSortDescending size={20} />
            )}
          </button>
        </div>

        {/* Add/Edit Resource */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Resource Name"
            value={newResource.name}
            onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
            className="flex-1 p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Used (%)"
            value={newResource.used}
            onChange={(e) => setNewResource({ ...newResource, used: e.target.value })}
            className="w-32 p-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Available (%)"
            value={newResource.available}
            onChange={(e) => setNewResource({ ...newResource, available: e.target.value })}
            className="w-32 p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleAddResource}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            {editingId ? 'Update' : 'Add'} <AiOutlinePlus className="inline" />
          </button>
        </div>

        {/* Undo Deletion */}
        {deletedResource && (
          <motion.div
            className="mb-4 p-4 bg-yellow-100 rounded-md shadow flex justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span>Resource "{deletedResource.name}" deleted.</span>
            <button
              onClick={handleUndoDelete}
              className="text-blue-500 hover:text-blue-700"
            >
              Undo <AiOutlineUndo className="inline" />
            </button>
          </motion.div>
        )}

        {/* Resource List */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="resources">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {filteredResources.map((resource, index) => (
                  <Draggable
                    key={resource.id}
                    draggableId={resource.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Resource
                          id={resource.id}
                          name={resource.name}
                          used={resource.used}
                          available={resource.available}
                          onDelete={handleDeleteResource}
                          onEdit={handleEditResource}
                          color={getRandomColor(index)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </motion.div>
    </div>
  );
};

export default Resources;
