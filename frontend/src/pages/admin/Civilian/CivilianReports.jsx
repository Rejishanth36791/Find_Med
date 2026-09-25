import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchReportMetrics, fetchReports } from '../../../api/civilianAdminApi';
import { Search, Filter, RefreshCw } from 'lucide-react';
import MetricCard from '../../../components/admin/HomeMetricCard';

const CivilianReports = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
        rejected: 0
    });
    const [reports, setReports] = useState([]);
    const [filters, setFilters] = useState({
        type: '',
        status: '',
        search: '',
        page: 0,
        size: 10
    });
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchMetrics();
        fetchReportsData();
    }, [filters]);

    const fetchMetrics = async () => {
        try {
            const data = await fetchReportMetrics();
            setMetrics(data);
        } catch (error) {
            console.error("Error fetching metrics:", error);
        }
    };

    const fetchReportsData = async () => {
        setLoading(true);
        try {
            const params = {
                page: filters.page,
                size: filters.size,
                search: filters.search,
                type: filters.type || undefined,
                status: filters.status || undefined
            };
            const data = await fetchReports(params);
            setReports(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters({ ...filters, page: 0 }); // Reset to page 0 on search
    };

    const handleReset = () => {
        setFilters({
            type: '',
            status: '',
            search: '',
            page: 0,
            size: 10
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            IN_PROGRESS: 'bg-blue-100 text-blue-800',
            RESOLVED: 'bg-green-100 text-green-800',
            REJECTED: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status?.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Civilian Reports & Inquiries</h1>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    label="Pending"
                    value={metrics.pending}
                    borderColor="#d97706" // yellow-600
                />
                <MetricCard
                    label="In Progress"
                    value={metrics.inProgress}
                    borderColor="#2563eb" // blue-600
                />
                <MetricCard
                    label="Resolved"
                    value={metrics.resolved}
                    borderColor="#16a34a" // green-600
                />
                <MetricCard
                    label="Rejected"
                    value={metrics.rejected}
                    borderColor="#dc2626" // red-600
                />
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                <form onSubmit={handleSearch} className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search reference, title..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </form>
                <div className="flex gap-2">
                    <select
                        className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 0 })}
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                    <select
                        className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500"
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 0 })}
                    >
                        <option value="">All Types</option>
                        <option value="REPORT">Report</option>
                        <option value="INQUIRY">Inquiry</option>
                    </select>
                    <button
                        onClick={handleReset}
                        className="p-2 text-gray-500 hover:text-teal-600 border rounded-lg hover:bg-gray-50"
                        title="Reset Filters"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Civilian</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No reports found.</td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {report.referenceCode}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {report.civilianName || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.type === 'REPORT' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                {report.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs" title={report.title}>
                                            {report.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                                                report.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {report.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {getStatusBadge(report.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => navigate(`/admin/civilian-reports/${report.id}`)}
                                                className="text-teal-600 hover:text-teal-900 bg-teal-50 px-3 py-1 rounded-md hover:bg-teal-100 transition-colors"
                                            >
                                                View-Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setFilters({ ...filters, page: Math.max(0, filters.page - 1) })}
                            disabled={filters.page === 0}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setFilters({ ...filters, page: Math.min(totalPages - 1, filters.page + 1) })}
                            disabled={filters.page >= totalPages - 1}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Page <span className="font-medium">{filters.page + 1}</span> of <span className="font-medium">{totalPages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setFilters({ ...filters, page: Math.max(0, filters.page - 1) })}
                                    disabled={filters.page === 0}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setFilters({ ...filters, page: Math.min(totalPages - 1, filters.page + 1) })}
                                    disabled={filters.page >= totalPages - 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CivilianReports;
