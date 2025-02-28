// import React, { useState } from 'react';
// import { ChevronDown, X, CalendarIcon } from 'lucide-react';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';

// const SmartFilter = () => {
//   // Filter definitions
//   const filterDefinitions = {
//     priority: {
//       label: 'Priority',
//       values: ['Low', 'Medium', 'High', 'Urgent']
//     },
//     category: {
//       label: 'Category',
//       values: ['Development', 'Design', 'Marketing', 'Sales']
//     },
//     project: {
//       label: 'Project',
//       values: ['Project A', 'Project B', 'Project C']
//     },
//     assignedTo: {
//       label: 'Assigned To',
//       values: ['John Doe', 'Jane Smith', 'Bob Johnson']
//     }
//   };

//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [selectedFilters, setSelectedFilters] = useState({});
//   const [dateRange, setDateRange] = useState({ start: '', end: '' });

//   const toggleDropdown = (filterKey) => {
//     setActiveDropdown(activeDropdown === filterKey ? null : filterKey);
//   };

//   const selectFilterValue = (filterKey, value) => {
//     setSelectedFilters(prev => ({
//       ...prev,
//       [filterKey]: value
//     }));
//     setActiveDropdown(null);
//   };

//   const clearFilter = (filterKey) => {
//     const newFilters = { ...selectedFilters };
//     delete newFilters[filterKey];
//     setSelectedFilters(newFilters);
//   };

//   const clearAllFilters = () => {
//     setSelectedFilters({});
//     setDateRange({ start: '', end: '' });
//   };

//   return (
//     <div className="w-full">
//       <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
//         <div className="text-sm font-medium text-gray-700">Smart Filters</div>
        
//         {/* Filter Dropdowns */}
//         <div className="flex flex-1 gap-2">
//           {Object.entries(filterDefinitions).map(([key, filter]) => (
//             <div key={key} className="relative">
//               <Button
//                 variant={selectedFilters[key] ? "secondary" : "outline"}
//                 className="h-9 px-3 flex items-center gap-2"
//                 onClick={() => toggleDropdown(key)}
//               >
//                 {selectedFilters[key] || filter.label}
//                 <ChevronDown className={`w-4 h-4 transition-transform ${
//                   activeDropdown === key ? 'transform rotate-180' : ''
//                 }`} />
//               </Button>

//               {activeDropdown === key && (
//                 <div className="absolute z-50 w-48 mt-1 bg-white border rounded-md shadow-lg">
//                   {filter.values.map((value) => (
//                     <div
//                       key={value}
//                       className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
//                       onClick={() => selectFilterValue(key, value)}
//                     >
//                       {value}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}

//           {/* Date Range Picker */}
//           <Button
//             variant="outline"
//             className="h-9 px-3 flex items-center gap-2"
//           >
//             <CalendarIcon className="w-4 h-4" />
//             <span>DD-MM-YYYY - DD-MM-YYYY</span>
//           </Button>
//         </div>

//         {/* Clear All Button */}
//         <Button
//           variant="ghost"
//           className="h-9 px-3 text-blue-500"
//           onClick={clearAllFilters}
//         >
//           Clear All
//         </Button>
//       </div>

//       {/* Status Cards */}

//       <div className="grid grid-cols-5 gap-4 mt-4">

//       <Card className="p-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-medium">Assigned to me</h3>
//             <span className="text-gray-500">(7)</span>
//           </div>
//         </Card>

//         <Card className="p-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-medium">Open</h3>
//             <span className="text-gray-500">(1)</span>
//           </div>
//         </Card>

//         <Card className="p-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-medium">In Progress</h3>
//             <span className="text-gray-500">(7)</span>
//           </div>
//         </Card>

//         <Card className="p-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-medium">Resolved</h3>
//             <span className="text-gray-500">(7)</span>
//           </div>
//         </Card>

//         <Card className="p-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-medium">Closed</h3>
//             <span className="text-gray-500">(9)</span>
//           </div>
//         </Card>

//       </div>
//     </div>
//   );
// };

// export default SmartFilter;




import React, { useState, useEffect } from 'react';
import { ChevronDown, X, CalendarIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SmartFilter = () => {
  const [filters, setFilters] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusCounts, setStatusCounts] = useState({
    assigned: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  });

  // Fetch filters and tickets on component mount
  useEffect(() => {
    fetchFilters();
    fetchTickets();
  }, []);

  // Update status counts whenever tickets change
  useEffect(() => {
    updateStatusCounts();
  }, [tickets]);

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/tickets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store JWT in localStorage
        }
      });
      if (!response.ok) throw new Error('Failed to fetch tickets');
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const updateStatusCounts = () => {
    const currentUser = JSON.parse(localStorage.getItem('user')); // Assuming you store user info
    
    const counts = {
      assigned: tickets.filter(ticket => 
        ticket.assignee === currentUser?.id
      ).length,
      open: tickets.filter(ticket => 
        ticket.status === 'Open'
      ).length,
      inProgress: tickets.filter(ticket => 
        ticket.status === 'In-progress'
      ).length,
      resolved: tickets.filter(ticket => 
        ticket.status === 'Resolved'
      ).length,
      closed: tickets.filter(ticket => 
        ticket.status === 'Closed'
      ).length
    };

    setStatusCounts(counts);
  };

  const fetchFilters = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/filters');
      const data = await response.json();
      setFilters(data);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const getFilterDefinitions = () => {
    const definitions = {};
    filters.forEach(parent => {
      definitions[parent.filter_parent_id] = {
        label: parent.filter_name,
        values: parent.children?.map(child => child.filter_child_name) || [],
        childMap: parent.children?.reduce((acc, child) => {
          acc[child.filter_child_name] = child.filter_child_id;
          return acc;
        }, {}) || {}
      };
    });
    return definitions;
  };

  const toggleDropdown = (filterKey) => {
    setActiveDropdown(activeDropdown === filterKey ? null : filterKey);
  };

  const filterTickets = (filters) => {
    let filteredTickets = [...tickets];
    
    // Apply each selected filter
    Object.entries(filters).forEach(([key, value]) => {
      switch(key) {
        case 'priority':
          filteredTickets = filteredTickets.filter(ticket => 
            ticket.priority === value
          );
          break;
        case 'project':
          filteredTickets = filteredTickets.filter(ticket => 
            ticket.project === value
          );
          break;
        // Add other filter cases as needed
      }
    });

    return filteredTickets;
  };

  const selectFilterValue = (filterKey, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterKey]: value
    };
    
    setSelectedFilters(newFilters);
    setActiveDropdown(null);

    // Filter tickets and update counts
    const filteredTickets = filterTickets(newFilters);
    setTickets(filteredTickets);
  };

  const clearAllFilters = async () => {
    setSelectedFilters({});
    setDateRange({ start: '', end: '' });
    // Refetch original tickets
    fetchTickets();
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="text-sm font-medium text-gray-700">Smart Filters</div>
        
        {/* Filter Dropdowns */}
        <div className="flex flex-1 gap-2">
          {Object.entries(getFilterDefinitions()).map(([key, filter]) => (
            <div key={key} className="relative">
              <Button
                variant={selectedFilters[key] ? "secondary" : "outline"}
                className="h-9 px-3 flex items-center gap-2"
                onClick={() => toggleDropdown(key)}
              >
                {selectedFilters[key] || filter.label}
                <ChevronDown className={`w-4 h-4 transition-transform ${
                  activeDropdown === key ? 'transform rotate-180' : ''
                }`} />
              </Button>

              {activeDropdown === key && (
                <div className="absolute z-50 w-48 mt-1 bg-white border rounded-md shadow-lg">
                  {filter.values.map((value) => (
                    <div
                      key={value}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => selectFilterValue(key, value)}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Date Range Picker */}
          <Button
            variant="outline"
            className="h-9 px-3 flex items-center gap-2"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>DD-MM-YYYY - DD-MM-YYYY</span>
          </Button>
        </div>

        {/* Clear All Button */}
        <Button
          variant="ghost"
          className="h-9 px-3 text-blue-500"
          onClick={clearAllFilters}
        >
          Clear All
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-5 gap-4 mt-4">
        <Card className="p-4 cursor-pointer hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Assigned to me</h3>
            <span className="text-gray-500">({statusCounts.assigned})</span>
          </div>
        </Card>

        <Card className="p-4 cursor-pointer hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Open</h3>
            <span className="text-gray-500">({statusCounts.open})</span>
          </div>
        </Card>

        <Card className="p-4 cursor-pointer hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">In Progress</h3>
            <span className="text-gray-500">({statusCounts.inProgress})</span>
          </div>
        </Card>

        <Card className="p-4 cursor-pointer hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Resolved</h3>
            <span className="text-gray-500">({statusCounts.resolved})</span>
          </div>
        </Card>

        <Card className="p-4 cursor-pointer hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Closed</h3>
            <span className="text-gray-500">({statusCounts.closed})</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SmartFilter;