import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { facultyAPI, grievanceAPI } from '../services/api';
import { toast } from 'react-toastify';

const FacultyDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [grievances, setGrievances] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedGrievance, setSelectedGrievance] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState({ status_id: '', resolution_notes: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [grievancesRes, statsRes] = await Promise.all([
                facultyAPI.getGrievances({}),
                facultyAPI.getStats(),
            ]);
            
            setGrievances(grievancesRes.data.data.grievances);
            setStats(statsRes.data.data);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (grievanceId) => {
        try {
            await grievanceAPI.update(grievanceId, statusUpdate);
            toast.success('Status updated successfully!');
            setSelectedGrievance(null);
            setStatusUpdate({ status_id: '', resolution_notes: '' });
            loadData();
        } catch (error) {
            toast.error('Failed to update status');
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
                            <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
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
                        {['dashboard', 'grievances'].map((tab) => (
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
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Workload Statistics</h2>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                    <div className="card">
                                        <h3 className="text-sm font-medium text-gray-600">Total Assigned</h3>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_assigned || 0}</p>
                                    </div>
                                    <div className="card">
                                        <h3 className="text-sm font-medium text-gray-600">Pending</h3>
                                        <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pending || 0}</p>
                                    </div>
                                    <div className="card">
                                        <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
                                        <p className="text-3xl font-bold text-blue-600 mt-2">{stats.in_progress || 0}</p>
                                    </div>
                                    <div className="card">
                                        <h3 className="text-sm font-medium text-gray-600">Resolved</h3>
                                        <p className="text-3xl font-bold text-green-600 mt-2">{stats.resolved || 0}</p>
                                    </div>
                                </div>

                                {/* High Priority Grievances */}
                                <div className="card">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">High Priority Grievances</h3>
                                    {grievances.filter(g => g.priority === 'high' && g.status_name !== 'Resolved').length === 0 ? (
                                        <p className="text-gray-500">No high priority grievances</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {grievances.filter(g => g.priority === 'high' && g.status_name !== 'Resolved').map((grievance) => (
                                                <div key={grievance.grievance_id} className="border-l-4 border-red-500 pl-4 py-2">
                                                    <h4 className="font-medium text-gray-900">{grievance.title}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{grievance.student_name} • {grievance.student_department}</p>
                                                    <div className="flex items-center space-x-2 mt-2">
                                                        <span className={`badge ${getStatusColor(grievance.status_name)}`}>
                                                            {grievance.status_name}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(grievance.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Grievances Tab */}
                        {activeTab === 'grievances' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Assigned Grievances</h2>
                                {grievances.length === 0 ? (
                                    <div className="card text-center py-12">
                                        <p className="text-gray-500">No grievances assigned yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {grievances.map((grievance) => (
                                            <div key={grievance.grievance_id} className="card hover:shadow-lg transition-shadow">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-900">{grievance.title}</h3>
                                                        <p className="text-gray-600 mt-2">{grievance.description}</p>
                                                        <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                                                            <span>👤 {grievance.student_name}</span>
                                                            <span>📧 {grievance.student_email}</span>
                                                            <span>📁 {grievance.category_name}</span>
                                                            <span>📅 {new Date(grievance.created_at).toLocaleDateString()}</span>
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

                                                {/* Update Status Section */}
                                                {selectedGrievance === grievance.grievance_id ? (
                                                    <div className="mt-6 pt-6 border-t">
                                                        <h4 className="font-medium text-gray-900 mb-4">Update Status</h4>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                                                <select
                                                                    value={statusUpdate.status_id}
                                                                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status_id: e.target.value })}
                                                                    className="input-field"
                                                                >
                                                                    <option value="">Select Status</option>
                                                                    <option value="2">In Progress</option>
                                                                    <option value="3">Resolved</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">Resolution Notes</label>
                                                                <textarea
                                                                    value={statusUpdate.resolution_notes}
                                                                    onChange={(e) => setStatusUpdate({ ...statusUpdate, resolution_notes: e.target.value })}
                                                                    className="input-field"
                                                                    rows="3"
                                                                />
                                                            </div>
                                                            <div className="flex justify-end space-x-4">
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedGrievance(null);
                                                                        setStatusUpdate({ status_id: '', resolution_notes: '' });
                                                                    }}
                                                                    className="btn btn-secondary"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(grievance.grievance_id)}
                                                                    className="btn btn-primary"
                                                                >
                                                                    Update
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="mt-4">
                                                        <button
                                                            onClick={() => setSelectedGrievance(grievance.grievance_id)}
                                                            className="btn btn-primary text-sm"
                                                        >
                                                            Update Status
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default FacultyDashboard;
