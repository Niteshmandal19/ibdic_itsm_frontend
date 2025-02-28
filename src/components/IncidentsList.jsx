import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    Calendar,
    Filter,
    RefreshCw,
    User,
    Info,
    Loader,
    AlertTriangle
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  
import IncidentDetails from './IncidentDetails';

const API_BASE_URL = 'http://localhost:3000/api';

const IncidentsList = () => {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('Open');
    const filterOptions = useMemo(() => 
        ['Assigned to me', 'Open', 'In-progress', 'Resolved', 'Closed', 'On-hold']
    );
    const tabsRef = useRef([]);
    const [sliderPosition, setSliderPosition] = useState(0);
    const [sliderWidth, setSliderWidth] = useState(0);

    const [filters, setFilters] = useState({
        projects: [],
        issueTypes: [],
        requestTypes: [],
        // assignees: [],
        priorities: [],
        statuses: [],
        // created_by: []
    });

    const [globalSearch, setGlobalSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: '',
        isOpen: false
    });

    const [organizations, setOrganizations] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState('all');
    const [userRole, setUserRole] = useState('');

    const [assignees, setAssignees] = useState([]);
    const [selectedAssignee, setSelectedAssignee] = useState('all');


    const fetchAssignees = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/users/assignee`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAssignees(response.data.users);
        } catch (error) {
            console.error('Error fetching assignees:', error);
        }
    };

    useEffect(() => {
        fetchAssignees();
    }, []);


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.role || '');
    }, []);

    // Fetch organizations
    const fetchOrganizations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/organization/list`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    limit: 100, // Adjust as needed
                    sortOrder: 'ASC'
                }
            });
            setOrganizations(response.data.organizations);
        } catch (error) {
            console.error('Error fetching organizations:', error);
        }
    };

    // Fetch organizations on component mount if user has correct role
    useEffect(() => {
        if (['IBDIC_USER', 'IBDIC_ADMIN'].includes(userRole)) {
            fetchOrganizations();
        }
    }, [userRole]);




    const currentUser = useMemo(() => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }, []);

    // Calculate counts for each status


    const getDateForComparison = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };


    useEffect(() => {
        const activeTab = tabsRef.current[filterOptions.indexOf(activeFilter)];
        if (activeTab) {
            setSliderPosition(activeTab.offsetLeft);
            setSliderWidth(activeTab.offsetWidth);
        }
    }, [activeFilter, filterOptions]);

    // Modified filter change handler
    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        // Clear other status filters when changing tabs
        const newFilters = {
            ...filters,
            statuses: []
        };
        setFilters(newFilters);
        setCurrentPage(1);
    };





    // Fetch incidents from the backend
    const fetchIncidents = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/tickets`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIncidents(response.data);
            setError(null);
        } catch (err) {
            // You might want to handle 401 (unauthorized) errors specifically
            if (err.response && err.response.status === 401) {
                // Redirect to login or refresh token
                navigate('/login');
            }
            setError(err.response?.data?.message || 'Error fetching tickets');
            console.error('Error fetching tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchIncidents();
    }, []);

    // Handle row click to navigate to detailed view
    const handleRowClick = (incident, e) => {
        // Prevent opening details if clicking on the title link
        if (e.target.tagName === 'A') {
            return;
        }
        setSelectedIncident(incident);
    };




    // Predefined filter options
    const PREDEFINED_FILTERS = {
        projects: ['IH', 'SIIE', 'DTF', 'ITN'],
        issueTypes: ['Incident', 'Bug', 'FeatureRequest', 'Support'],
        requestTypes: ['CriticalBug', 'UIBug', 'NewModule', 'LoginHelp'],
        // assignees: ['support123HR', 'support123DEV', 'support123INFRA'],
        priorities: ['Urgent', 'High', 'Medium', 'Low'],
        statuses: ['Open', 'In-progress', 'Resolved', 'Closed', 'On-hold'],
        // created_by: ['me']
    };

    // Generate unique filter options from incidents
    const uniqueFilters = useMemo(() => {
        if (!incidents.length) return {
            projects: [],
            issueTypes: [],
            requestTypes: [],
            // assignees: [],
            priorities: [],
            statuses: [],
            // created_by: []
        };

        return {
            projects: [...new Set([...PREDEFINED_FILTERS.projects])].filter(Boolean).sort(),
            issueTypes: [...new Set([...PREDEFINED_FILTERS.issueTypes])].filter(Boolean).sort(),
            requestTypes: [...new Set([...PREDEFINED_FILTERS.requestTypes])].filter(Boolean).sort(),
            // assignees: [...new Set([...PREDEFINED_FILTERS.assignees])].filter(Boolean).sort(),
            priorities: [...new Set([...PREDEFINED_FILTERS.priorities])].filter(Boolean).sort(),
            statuses: [...new Set([...PREDEFINED_FILTERS.statuses])].filter(Boolean).sort(),
            // created_by: [...new Set([...PREDEFINED_FILTERS.created_by])].filter(Boolean).sort()
        };
    }, [incidents]);

    // Filter incidents based on search and filter criteria
    const filteredIncidents = useMemo(() => {
        return incidents.filter(incident => {
            const matchesGlobalSearch = globalSearch
                ? Object.values(incident).some(val =>
                    String(val).toLowerCase().includes(globalSearch.toLowerCase())
                )
                : true;

            // Handle "Assigned to me" filter
            if (activeFilter === 'Assigned to me') {
                if (incident.assignee !== currentUser?.id) {
                    return false;
                }
            } else {
                // For other filters, check status
                const status = incident.status === 'In Progress' ? 'In-progress' : incident.status;
                if (activeFilter && activeFilter !== status) {
                    return false;
                }
            }

            // Date filtering logic
            let matchesDateRange = true;
            if (dateFilter.startDate || dateFilter.endDate) {
                const incidentDate = getDateForComparison(incident.createdAt);
                const startDate = getDateForComparison(dateFilter.startDate);
                const endDate = getDateForComparison(dateFilter.endDate);

                if (startDate && endDate) {
                    matchesDateRange = incidentDate >= startDate && incidentDate <= endDate;
                } else if (startDate) {
                    matchesDateRange = incidentDate >= startDate;
                } else if (endDate) {
                    matchesDateRange = incidentDate <= endDate;
                }
            }

            // Organization filter
            const matchesOrg = selectedOrg === 'all' || incident.organization_id === selectedOrg;

            // Other filters
            const matchesProjects = filters.projects.length === 0 || filters.projects.includes(incident.project);
            const matchesIssueTypes = filters.issueTypes.length === 0 || filters.issueTypes.includes(incident.issueType);
            const matchesRequestTypes = filters.requestTypes.length === 0 || filters.requestTypes.includes(incident.requestType);
            const matchesPriorities = filters.priorities.length === 0 || filters.priorities.includes(incident.priority);
            const matchesAssignee = selectedAssignee === 'all' || incident.assignee === selectedAssignee;

            return (
                matchesGlobalSearch &&
                matchesDateRange &&
                matchesProjects &&
                matchesIssueTypes &&
                matchesRequestTypes &&
                matchesPriorities &&
                matchesOrg &&
                matchesAssignee
            );
        });
    }, [incidents, filters, globalSearch, dateFilter, activeFilter, currentUser, selectedOrg, selectedAssignee]);



    const statusCounts = useMemo(() => {
        if (!filteredIncidents.length) return {};

        return filteredIncidents.reduce((counts, incident) => {
            
            // Count by status
            const status = incident.status === 'In Progress' ? 'In-progress' : incident.status;
            counts[status] = (counts[status] || 0) + 1;

            // Count assigned to current user
            if (incident.assignee === currentUser?.id) {
                counts['Assigned to me'] = (counts['Assigned to me'] || 0) + 1;
            }

            return counts;
        }, {
            'Assigned to me': 0,
            'Open': 0,
            'In-progress': 0,
            'Resolved': 0,
            'Closed': 0,
            'On-hold': 0
        });
    }, [filteredIncidents, currentUser]);

    // Paginate filtered incidents
    const paginatedIncidents = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredIncidents.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredIncidents, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);

    // Add date filter reset to the existing resetFilters function
    const resetFilters = useCallback(() => {
        setFilters({
            projects: [],
            issueTypes: [],
            requestTypes: [],
            priorities: [],
            statuses: [],
            created_by: []
        });
        setDateFilter(prev => ({
            ...prev,
            startDate: '',
            endDate: ''
        }));
        setGlobalSearch('');
        setCurrentPage(1);
        setActiveFilter('Open');
        setSelectedOrg('all');
        setSelectedAssignee('all');

    }, []);

    // Toggle filter selection
    const toggleFilter = useCallback((filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].includes(value)
                ? prev[filterType].filter(item => item !== value)
                : [...prev[filterType], value]
        }));
    }, []);

    // Get badge classes for different attributes
    // const getPriorityBadgeClass = useCallback((priority) => {
    //     switch (priority) {
    //         case 'Urgent': return 'priority-badge priority-badge-urgent';
    //         case 'High': return 'priority-badge priority-badge-high';
    //         case 'Medium': return 'priority-badge priority-badge-medium';
    //         default: return 'priority-badge priority-badge-low';
    //     }
    // }, []);

    // const getStatusBadgeClass = useCallback((status) => {
    //     switch (status) {
    //         case 'Open': return 'status-badge status-badge-open';
    //         case 'In Progress': return 'status-badge status-badge-in-progress';
    //         case 'Resolved': return 'status-badge status-badge-resolved';
    //         default: return 'status-badge status-badge-closed';
    //     }
    // }, []);

    // Loading State
    if (loading) {
        return (
            <Card className="w-full h-64 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                    <p className="text-gray-600">Loading tickets...</p>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full h-64 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                    <p className="text-red-600">Error loading tickets: {error}</p>
                    <Button
                        variant="outline"
                        onClick={fetchIncidents}
                    >
                        Retry
                    </Button>
                </div>
            </Card>
        );
    }

    const DateFilterPopup = () => {
        const [tempStartDate, setTempStartDate] = useState(dateFilter.startDate);
        const [tempEndDate, setTempEndDate] = useState(dateFilter.endDate);

        return (
            <div className="p-4 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                        type="date"
                        value={tempStartDate}
                        onChange={(e) => {
                            setTempStartDate(e.target.value);
                            if (tempEndDate && e.target.value > tempEndDate) {
                                setTempEndDate(e.target.value);
                            }
                        }}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                        type="date"
                        value={tempEndDate}
                        min={tempStartDate}
                        onChange={(e) => setTempEndDate(e.target.value)}
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setTempStartDate('');
                            setTempEndDate('');
                            setDateFilter(prev => ({
                                ...prev,
                                startDate: '',
                                endDate: '',
                                isOpen: false
                            }));
                            setCurrentPage(1);
                        }}
                    >
                        Clear
                    </Button>
                    <Button
                        onClick={() => {
                            setDateFilter(prev => ({
                                ...prev,
                                startDate: tempStartDate,
                                endDate: tempEndDate,
                                isOpen: false
                            }));
                            setCurrentPage(1);
                        }}
                    >
                        Apply
                    </Button>
                </div>
            </div>
        );
    };

    const getPriorityBadgeVariant = (priority) => {
        switch (priority.toLowerCase()) {
            case 'urgent': return 'destructive';
            case 'high': return 'orange';
            case 'medium': return 'warning';
            case 'low': return 'secondary';
            default: return 'outline';
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status.toLowerCase()) {
            case 'open': return 'default';
            case 'in progress': return 'warning';
            case 'resolved': return 'success';
            case 'closed': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Incidents List</CardTitle>
                    {/* Existing search input */}

                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
                        <Input
                            placeholder="Search incidents..."
                            className="pl-8 w-64"
                            value={globalSearch}
                            onChange={(e) => {
                                setGlobalSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    {['IBDIC_USER', 'IBDIC_ADMIN'].includes(userRole) && ( // Fixed role typo
                    <Select
                        value={selectedOrg}
                        onValueChange={(value) => {
                            setSelectedOrg(value);
                            setCurrentPage(1);
                        }}
                    >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Organization" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Organizations</SelectItem>
                                {organizations.map((org) => (
                                    <SelectItem key={org.organization_id} value={org.organization_id}>
                                        {org.organization_id}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {/* Assignee Select */}
                    <Select
                        value={selectedAssignee}
                        onValueChange={(value) => {
                            setSelectedAssignee(value);
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select Assignee" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Assignees</SelectItem>
                            {assignees.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                    {user.first_name} {user.last_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>


                    <Popover open={dateFilter.isOpen} onOpenChange={(open) =>
                        setDateFilter(prev => ({ ...prev, isOpen: open }))
                    }>
                        <PopoverTrigger asChild>
                            <Button
                                variant={dateFilter.startDate || dateFilter.endDate ? "default" : "outline"}
                                size="icon"
                            >
                                <Calendar size={16} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <DateFilterPopup />
                        </PopoverContent>
                    </Popover>

                    <Button
                        variant={isFilterOpen ? "default" : "outline"}
                        size="icon"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <Filter size={16} />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={resetFilters}
                    >
                        <RefreshCw size={16} />
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {/* Filter Tabs */}
                <div className="w-full bg-white rounded-lg p-1.5 mb-6">
                    <div className="relative flex items-center">
                        <div
                            className="absolute h-[85%] bg-blue-50 rounded-md transition-all duration-300 ease-in-out"
                            style={{
                                left: sliderPosition,
                                width: sliderWidth
                            }}
                        />

                        {filterOptions.map((filter, index) => {
                            const isActive = filter === activeFilter;
                            const count = statusCounts[filter] || 0;

                            return (
                                <button
                                    key={filter}
                                    ref={el => tabsRef.current[index] = el}
                                    onClick={() => handleFilterChange(filter)}
                                    className={`relative flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 min-w-[140px] ${isActive ? 'text-blue-700' : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <span>{filter}</span>
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${isActive
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>



                {/* Expandable Filters */}
                {isFilterOpen && (
                    <div className="mb-6 p-4 border rounded-lg bg-gray-50 grid grid-cols-3 gap-4">
                        {Object.entries(uniqueFilters).map(([filterType, options]) => (
                            <div key={filterType} className="space-y-2">
                                <h3 className="font-semibold capitalize">{filterType}</h3>
                                <div className="space-y-1">
                                    {options.map(option => (
                                        <label key={option} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={filters[filterType].includes(option)}
                                                onChange={() => toggleFilter(filterType, option)}
                                                className="rounded"
                                            />
                                            <span className="text-sm">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Platform</TableHead>
                                <TableHead>Issue Type</TableHead>
                                <TableHead>Request Type</TableHead>
                                <TableHead>Assignee</TableHead>
                                <TableHead>Created By</TableHead>
                                <TableHead>Organization</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedIncidents.map(incident => (
                                <TableRow
                                    key={incident.id}
                                    onClick={(e) => handleRowClick(incident, e)}
                                    className="cursor-pointer"
                                >
                                    <TableCell>{incident.id}</TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Link
                                            to={`/incidents/${incident.id}`}
                                            className="text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            {incident.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{incident.project}</TableCell>
                                    <TableCell>{incident.issueType}</TableCell>
                                    <TableCell>{incident.requestType}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            <User size={14} className="text-gray-500" />
                                            <span>{incident.assignedTo?.first_name} {incident.assignedTo?.last_name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{incident.creator?.first_name} {incident.creator?.last_name}</TableCell>
                                    <TableCell>{incident.organization_id}</TableCell>
                                    <TableCell>
                                        <Badge variant={getPriorityBadgeVariant(incident.priority)}>
                                            {incident.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(incident.status)}>
                                            {incident.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{incident.createdAt}</TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSelectedIncident(incident)}
                                        >
                                            <Info size={14} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-600">
                        Showing {paginatedIncidents.length} of {filteredIncidents.length} incidents
                    </p>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </CardContent>

            {selectedIncident && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <Card className="w-full max-w-3xl mx-6 rounded-2xl shadow-lg">
                        <div className="relative p-4">

                            <IncidentDetails
                                incident={selectedIncident}
                                onClose={() => setSelectedIncident(null)}
                            />
                        </div>
                    </Card>
                </div>
            )}

        </Card>
    );
};

export default IncidentsList;


// ------------------------------------------------------------------------------------------------------------


// import React, { useState, useMemo, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Search,
//   Info,
//   Loader,
//   AlertTriangle
// } from 'lucide-react';
// import IncidentDetails from './IncidentDetails';
// import SmartFilter from './Filter';

// const API_BASE_URL = 'http://localhost:3000/api';

// const IncidentsList = () => {
//     const navigate = useNavigate();
//     const [incidents, setIncidents] = useState([]);
//     const [filteredIncidents, setFilteredIncidents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [globalSearch, setGlobalSearch] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(10);
//     const [selectedIncident, setSelectedIncident] = useState(null);
//     const [dateRange, setDateRange] = useState({ start: '', end: '' });

//     // Fetch incidents from the backend
//     const fetchIncidents = async () => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem('token');
//             const response = await axios.get(`${API_BASE_URL}/tickets`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             setIncidents(response.data);
//             setFilteredIncidents(response.data);
//             setError(null);
//         } catch (err) {
//             if (err.response && err.response.status === 401) {
//                 navigate('/login');
//             }
//             setError(err.response?.data?.message || 'Error fetching tickets');
//             console.error('Error fetching tickets:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Initial data fetch
//     useEffect(() => {
//         fetchIncidents();
//     }, []);

//     // Handle filters from SmartFilter
//     const handleFilterChange = (selectedFilters) => {
//         let filtered = [...incidents];

//         // Apply selected filters
//         Object.entries(selectedFilters).forEach(([key, value]) => {
//             if (value) {
//                 filtered = filtered.filter(incident => {
//                     switch(key) {
//                         case 'status':
//                             return incident.status === value;
//                         case 'priority':
//                             return incident.priority === value;
//                         case 'project':
//                             return incident.project === value;
//                         // Add more cases as needed
//                         default:
//                             return true;
//                     }
//                 });
//             }
//         });

//         // Apply date range filter if set
//         if (dateRange.start || dateRange.end) {
//             filtered = filtered.filter(incident => {
//                 const incidentDate = new Date(incident.createdAt);
//                 const start = dateRange.start ? new Date(dateRange.start) : null;
//                 const end = dateRange.end ? new Date(dateRange.end) : null;

//                 if (start && end) {
//                     return incidentDate >= start && incidentDate <= end;
//                 } else if (start) {
//                     return incidentDate >= start;
//                 } else if (end) {
//                     return incidentDate <= end;
//                 }
//                 return true;
//             });
//         }

//         // Apply global search
//         if (globalSearch) {
//             filtered = filtered.filter(incident =>
//                 Object.values(incident).some(val =>
//                     String(val).toLowerCase().includes(globalSearch.toLowerCase())
//                 )
//             );
//         }

//         setFilteredIncidents(filtered);
//         setCurrentPage(1); // Reset to first page when filters change
//     };

//     // Handle date range changes
//     const handleDateRangeChange = (newDateRange) => {
//         setDateRange(newDateRange);
//     };

//     // Paginate filtered incidents
//     const paginatedIncidents = useMemo(() => {
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         return filteredIncidents.slice(startIndex, startIndex + itemsPerPage);
//     }, [filteredIncidents, currentPage, itemsPerPage]);

//     const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);

//     // Handle row click to navigate to detailed view
//     const handleRowClick = (incident, e) => {
//         if (e.target.tagName === 'A') {
//             return;
//         }
//         setSelectedIncident(incident);
//     };

//     const getPriorityBadgeVariant = (priority) => {
//         switch (priority.toLowerCase()) {
//             case 'urgent': return 'destructive';
//             case 'high': return 'orange';
//             case 'medium': return 'warning';
//             case 'low': return 'secondary';
//             default: return 'outline';
//         }
//     };

//     const getStatusBadgeVariant = (status) => {
//         switch (status.toLowerCase()) {
//             case 'open': return 'default';
//             case 'in progress': return 'warning';
//             case 'resolved': return 'success';
//             case 'closed': return 'secondary';
//             default: return 'outline';
//         }
//     };

//     // Loading State
//     if (loading) {
//         return (
//             <Card className="w-full h-64 flex items-center justify-center">
//                 <div className="text-center space-y-4">
//                     <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600" />
//                     <p className="text-gray-600">Loading tickets...</p>
//                 </div>
//             </Card>
//         );
//     }

//     if (error) {
//         return (
//             <Card className="w-full h-64 flex items-center justify-center">
//                 <div className="text-center space-y-4">
//                     <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
//                     <p className="text-red-600">Error loading tickets: {error}</p>
//                     <Button
//                         variant="outline"
//                         onClick={fetchIncidents}
//                     >
//                         Retry
//                     </Button>
//                 </div>
//             </Card>
//         );
//     }

//     return (
//         <Card className="w-full">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
//                 <CardTitle>Incidents List</CardTitle>
//                 <div className="flex items-center space-x-2">
//                     <div className="relative">
//                         <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
//                         <Input
//                             placeholder="Search incidents..."
//                             className="pl-8 w-64"
//                             value={globalSearch}
//                             onChange={(e) => {
//                                 setGlobalSearch(e.target.value);
//                                 handleFilterChange({}); // Trigger filter with empty filters to apply search
//                             }}
//                         />
//                     </div>
//                 </div>
//             </CardHeader>

//             <CardContent>
//                 <div className="mb-6">
//                     <SmartFilter
//                         onFilterChange={handleFilterChange}
//                         onDateRangeChange={handleDateRangeChange}
//                         tickets={incidents}
//                     />
//                 </div>

//                 <div className="rounded-md border">
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>ID</TableHead>
//                                 <TableHead>Title</TableHead>
//                                 <TableHead>Project</TableHead>
//                                 <TableHead>Issue Type</TableHead>
//                                 <TableHead>Request Type</TableHead>
//                                 <TableHead>Assignee</TableHead>
//                                 <TableHead>Created By</TableHead>
//                                 <TableHead>Organization</TableHead>
//                                 <TableHead>Priority</TableHead>
//                                 <TableHead>Status</TableHead>
//                                 <TableHead>Created At</TableHead>
//                                 <TableHead className="w-12"></TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {paginatedIncidents.map(incident => (
//                                 <TableRow
//                                     key={incident.id}
//                                     onClick={(e) => handleRowClick(incident, e)}
//                                     className="cursor-pointer hover:bg-gray-50"
//                                 >
//                                     <TableCell>{incident.id}</TableCell>
//                                     <TableCell onClick={(e) => e.stopPropagation()}>
//                                         <Link
//                                             to={`/incidents/${incident.id}`}
//                                             className="text-blue-600 hover:text-blue-800 hover:underline"
//                                         >
//                                             {incident.title}
//                                         </Link>
//                                     </TableCell>
//                                     <TableCell>{incident.project}</TableCell>
//                                     <TableCell>{incident.issueType}</TableCell>
//                                     <TableCell>{incident.requestType}</TableCell>
//                                     <TableCell>
//                                         <div className="flex items-center space-x-1">
//                                             <span>{incident.assignedTo?.first_name} {incident.assignedTo?.last_name}</span>
//                                         </div>
//                                     </TableCell>
//                                     <TableCell>{incident.creator?.first_name} {incident.creator?.last_name}</TableCell>
//                                     <TableCell>{incident.organization_id}</TableCell>
//                                     <TableCell>
//                                         <Badge variant={getPriorityBadgeVariant(incident.priority)}>
//                                             {incident.priority}
//                                         </Badge>
//                                     </TableCell>
//                                     <TableCell>
//                                         <Badge variant={getStatusBadgeVariant(incident.status)}>
//                                             {incident.status}
//                                         </Badge>
//                                     </TableCell>
//                                     <TableCell>{incident.createdAt}</TableCell>
//                                     <TableCell onClick={(e) => e.stopPropagation()}>
//                                         <Button
//                                             variant="ghost"
//                                             size="icon"
//                                             onClick={() => setSelectedIncident(incident)}
//                                         >
//                                             <Info size={14} />
//                                         </Button>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </div>

//                 <div className="flex items-center justify-between mt-4">
//                     <p className="text-sm text-gray-600">
//                         Showing {paginatedIncidents.length} of {filteredIncidents.length} incidents
//                     </p>
//                     <div className="flex items-center space-x-2">
//                         <Button
//                             variant="outline"
//                             onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                             disabled={currentPage === 1}
//                         >
//                             Previous
//                         </Button>
//                         <span className="text-sm">
//                             Page {currentPage} of {totalPages}
//                         </span>
//                         <Button
//                             variant="outline"
//                             onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                             disabled={currentPage === totalPages}
//                         >
//                             Next
//                         </Button>
//                     </div>
//                 </div>
//             </CardContent>

//             {selectedIncident && (
//                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//                     <Card className="w-full max-w-3xl mx-6 rounded-2xl shadow-lg">
//                         <div className="relative p-4">
//                             <IncidentDetails
//                                 incident={selectedIncident}
//                                 onClose={() => setSelectedIncident(null)}
//                             />
//                         </div>
//                     </Card>
//                 </div>
//             )}
//         </Card>
//     );
// };

// export default IncidentsList;