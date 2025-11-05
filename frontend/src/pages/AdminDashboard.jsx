import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({});
    const [grievances, setGrievances] = useState([]);
    const [students, setStudents] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedGrievance, setSelectedGrievance] = useState(null);
    const [assignFacultyId, setAssignFacultyId] = useState('');

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        try {
            setLoading(true);
            
            if (activeTab === 'dashboard') {
                const statsRes = await adminAPI.getDashboardStats();
                setStats(statsRes.data.data);
            } else if (activeTab === 'grievances') {
                const [grievancesRes, facultyRes] = await Promise.all([
                    adminAPI.getAllGrievances({}),
                    adminAPI.getFaculty({}),
                ]);
                setGrievances(grievancesRes.data.data.grievances);
                setFaculty(facultyRes.data.data.faculty);
            } else if (activeTab === 'users') {
                const [studentsRes, facultyRes] = await Promise.all([
                    adminAPI.getStudents({}),
                    adminAPI.getFaculty({}),
                ]);
                setStudents(studentsRes.data.data.students);
                setFaculty(facultyRes.data.data.faculty);
            } else if (activeTab === 'categories') {
                const categoriesRes = await adminAPI.getCategories();
                setCategories(categoriesRes.data.data);
            }
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignGrievance = async () => {
        try {
            await adminAPI.assignGrievance(selectedGrievance, assignFacultyId);
            toast.success('Grievance assigned successfully!');
            setShowAssignModal(false);
            setSelectedGrievance(null);
            setAssignFacultyId('');
            loadData();
        } catch (error) {
            toast.error('Failed to assign grievance');
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'badge-high';
            case 'medium': return 'badge-medium';
            case 'low': return 'badge-low';
            default: return 'badge-medium';
        }
    };

    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase();
        if (statusLower === 'pending') return 'badge-pending';
        if (statusLower === 'in progress') return 'badge-in-progress';
        if (statusLower === 'resolved') return 'badge-resolved';
        return 'badge-pending';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
                        </div>
                        <button onClick={logout} className="btn btn-secondary">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {['dashboard', 'grievances', 'users', 'categories'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : (
                    <>
                        {/* Dashboard Tab */}
                        {activeTab === 'dashboard' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-6">System Overview</h2>
                                
                                {/* Total Statistics */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="card">
                                        <h3 className="text-sm font-medium text-gray-600">Total Students</h3>
                                        <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totals?.total_students || 0}</p>
                                    </div>
                                    <div className="card">
                                        <h3 className="text-sm font-medium text-gray-600">Total Faculty</h3>
                                        <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totals?.total_faculty || 0}</p>
                                    </div>
                                    <div className="card">
                                        <h3 className="text-sm font-medium text-gray-600">Total Grievances</h3>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totals?.total_grievances || 0}</p>
                                    </div>
                                </div>

                                {/* Grievance Status Statistics */}
                                <div className="card mb-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Grievance Status</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                                            <p className="text-2xl font-bold text-orange-600">{stats.totals?.pending_grievances || 0}</p>
                                            <p className="text-sm text-gray-600 mt-1">Pending</p>
                                        </div>
                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                            <p className="text-2xl font-bold text-blue-600">{stats.totals?.in_progress_grievances || 0}</p>
                                            <p className="text-sm text-gray-600 mt-1">In Progress</p>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                            <p className="text-2xl font-bold text-green-600">{stats.totals?.resolved_grievances || 0}</p>
                                            <p className="text-sm text-gray-600 mt-1">Resolved</p>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <p className="text-2xl font-bold text-gray-600">
                                                {((stats.totals?.resolved_grievances || 0) / (stats.totals?.total_grievances || 1) * 100).toFixed(0)}%
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">Resolution Rate</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Category Distribution */}
                                {stats.byCategory && stats.byCategory.length > 0 && (
                                    <div className="card">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Top Categories</h3>
                                        <div className="space-y-3">
                                            {stats.byCategory.slice(0, 5).map((cat, idx) => (
                                                <div key={idx} className="flex items-center justify-between">
                                                    <span className="text-gray-700">{cat.category_name}</span>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full"
                                                                style={{ width: `${(cat.count / stats.totals.total_grievances) * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-gray-600 font-medium">{cat.count}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Grievances Tab */}
                        {activeTab === 'grievances' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-6">All Grievances</h2>
                                {grievances.length === 0 ? (
                                    <div className="card text-center py-12">
                                        <p className="text-gray-500">No grievances found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {grievances.map((grievance) => (
                                            <div key={grievance.grievance_id} className="card hover:shadow-lg transition-shadow">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-900">{grievance.title}</h3>
                                                        <p className="text-gray-600 mt-2 line-clamp-2">{grievance.description}</p>
                                                        <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                                                            <span>👤 {grievance.student_name}</span>
                                                            <span>📁 {grievance.category_name}</span>
                                                            <span>📅 {new Date(grievance.created_at).toLocaleDateString()}</span>
                                                            {grievance.assigned_faculty_name && (
                                                                <span>👨‍🏫 {grievance.assigned_faculty_name}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end space-y-2">
                                                        <span className={`badge ${getPriorityColor(grievance.priority)}`}>
                                                            {grievance.priority}
                                                        </span>
                                                        <span className={`badge ${getStatusColor(grievance.status_name)}`}>
                                                            {grievance.status_name}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {!grievance.assigned_to && (
                                                    <div className="mt-4">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedGrievance(grievance.grievance_id);
                                                                setShowAssignModal(true);
                                                            }}
                                                            className="btn btn-primary text-sm"
                                                        >
                                                            Assign to Faculty
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Students Section */}
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-6">Students ({students.length})</h2>
                                        <div className="space-y-3">
                                            {students.slice(0, 10).map((student) => (
                                                <div key={student.student_id} className="card py-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">{student.name}</h3>
                                                            <p className="text-sm text-gray-600">{student.email}</p>
                                                            <p className="text-sm text-gray-500">{student.department} • {student.enrollment_no}</p>
                                                        </div>
                                                        <span className={`badge ${student.is_active ? 'badge-in-progress' : 'badge-pending'}`}>
                                                            {student.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Faculty Section */}
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-6">Faculty ({faculty.length})</h2>
                                        <div className="space-y-3">
                                            {faculty.slice(0, 10).map((fac) => (
                                                <div key={fac.faculty_id} className="card py-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">{fac.name}</h3>
                                                            <p className="text-sm text-gray-600">{fac.email}</p>
                                                            <p className="text-sm text-gray-500">{fac.designation} • {fac.department}</p>
                                                        </div>
                                                        <span className={`badge ${fac.is_active ? 'badge-in-progress' : 'badge-pending'}`}>
                                                            {fac.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Categories Tab */}
                        {activeTab === 'categories' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Categories ({categories.length})</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categories.map((category) => (
                                        <div key={category.category_id} className="card">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-gray-900">{category.category_name}</h3>
                                                <span className={`badge ${category.is_active ? 'badge-resolved' : 'badge-pending'}`}>
                                                    {category.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{category.description}</p>
                                            <p className="text-xs text-gray-500 mt-2">Department: {category.department || 'N/A'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Assign Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Assign Grievance to Faculty</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Faculty</label>
                            <select
                                value={assignFacultyId}
                                onChange={(e) => setAssignFacultyId(e.target.value)}
                                className="input-field"
                            >
                                <option value="">Select Faculty</option>
                                {faculty.filter(f => f.is_active).map((fac) => (
                                    <option key={fac.faculty_id} value={fac.faculty_id}>
                                        {fac.name} - {fac.department}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => {
                                    setShowAssignModal(false);
                                    setSelectedGrievance(null);
                                    setAssignFacultyId('');
                                }}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssignGrievance}
                                disabled={!assignFacultyId}
                                className="btn btn-primary"
                            >
                                Assign
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
