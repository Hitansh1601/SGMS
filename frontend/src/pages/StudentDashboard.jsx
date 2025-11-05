import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { grievanceAPI, studentAPI } from '../services/api';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [grievances, setGrievances] = useState([]);
    const [stats, setStats] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const [newGrievance, setNewGrievance] = useState({
        title: '',
        description: '',
        category_id: '',
        priority: 'medium',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [grievancesRes, statsRes, categoriesRes] = await Promise.all([
                grievanceAPI.getAll(),
                grievanceAPI.getStats(),
                studentAPI.getCategories(),
            ]);
            
            setGrievances(grievancesRes.data.data.grievances);
            setStats(statsRes.data.data);
            setCategories(categoriesRes.data.data);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGrievance = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(newGrievance).forEach(key => {
                formData.append(key, newGrievance[key]);
            });

            await grievanceAPI.create(formData);
            toast.success('Grievance submitted successfully!');
            setShowCreateForm(false);
            setNewGrievance({ title: '', description: '', category_id: '', priority: 'medium' });
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit grievance');
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
                            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
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
                        {['dashboard', 'grievances', 'new'].map((tab) => (
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
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Overview</h2>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                    <div className="card">
                                        <h3 className="text-sm font-medium text-gray-600">Total Grievances</h3>
                                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total || 0}</p>
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

                                {/* Recent Grievances */}
                                <div className="card">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Grievances</h3>
                                    {grievances.length === 0 ? (
                                        <p className="text-gray-500">No grievances yet. Create your first one!</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {grievances.slice(0, 5).map((grievance) => (
                                                <div key={grievance.grievance_id} className="border-l-4 border-blue-500 pl-4 py-2">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{grievance.title}</h4>
                                                            <p className="text-sm text-gray-600 mt-1">{grievance.category_name}</p>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`badge ${getPriorityColor(grievance.priority)}`}>
                                                                {grievance.priority}
                                                            </span>
                                                            <span className={`badge ${getStatusColor(grievance.status_name)}`}>
                                                                {grievance.status_name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        {new Date(grievance.created_at).toLocaleDateString()}
                                                    </p>
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
                                <h2 className="text-xl font-bold text-gray-900 mb-6">My Grievances</h2>
                                {grievances.length === 0 ? (
                                    <div className="card text-center py-12">
                                        <p className="text-gray-500 mb-4">No grievances found</p>
                                        <button onClick={() => setActiveTab('new')} className="btn btn-primary">
                                            Create New Grievance
                                        </button>
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
                                                            <span>📁 {grievance.category_name}</span>
                                                            <span>📅 {new Date(grievance.created_at).toLocaleDateString()}</span>
                                                            {grievance.assigned_faculty_name && (
                                                                <span>👤 {grievance.assigned_faculty_name}</span>
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
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* New Grievance Tab */}
                        {activeTab === 'new' && (
                            <div className="max-w-2xl mx-auto">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Submit New Grievance</h2>
                                <div className="card">
                                    <form onSubmit={handleCreateGrievance} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={newGrievance.title}
                                                onChange={(e) => setNewGrievance({ ...newGrievance, title: e.target.value })}
                                                className="input-field"
                                                required
                                                minLength={5}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                            <select
                                                value={newGrievance.category_id}
                                                onChange={(e) => setNewGrievance({ ...newGrievance, category_id: e.target.value })}
                                                className="input-field"
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.category_id} value={cat.category_id}>
                                                        {cat.category_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                            <select
                                                value={newGrievance.priority}
                                                onChange={(e) => setNewGrievance({ ...newGrievance, priority: e.target.value })}
                                                className="input-field"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                            <textarea
                                                value={newGrievance.description}
                                                onChange={(e) => setNewGrievance({ ...newGrievance, description: e.target.value })}
                                                className="input-field"
                                                rows="6"
                                                required
                                                minLength={20}
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-4">
                                            <button type="button" onClick={() => setActiveTab('dashboard')} className="btn btn-secondary">
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Submit Grievance
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;
