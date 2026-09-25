import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchReportDetails,
    markReportInProgress,
    resolveReport,
    rejectReport,
    respondToReport
} from '../../../api/civilianAdminApi';
import { ArrowLeft, Download, Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const CivilianReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseFile, setResponseFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadReportDetails();
    }, [id]);

    const loadReportDetails = async () => {
        try {
            const data = await fetchReportDetails(id);
            setReport(data);
        } catch (error) {
            console.error("Error fetching report details:", error);
            addToast("Failed to load report details", "error");
        } finally {
            setLoading(false);
        }
    };


    const handleStatusChange = async (action) => {
        if (!window.confirm(`Are you sure you want to mark this as ${action}?`)) return;

        try {
            setSubmitting(true);
            if (action === 'IN_PROGRESS') await markReportInProgress(id);
            else if (action === 'RESOLVED') await resolveReport(id);
            else if (action === 'REJECTED') await rejectReport(id);

            addToast(`Report marked as ${action}`, "success");
            loadReportDetails();
        } catch (error) {
            console.error(`Error updating status to ${action}:`, error);
            addToast("Failed to update status", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSendResponse = async (e) => {
        e.preventDefault();
        if (!responseMessage.trim()) {
            addToast("Please enter a response message", "warning");
            return;
        }

        try {
            setSubmitting(true);
            // Handle file upload if exists (Mocking file upload logic for DTO)
            // In a real app, you'd upload the file first to get a path, or use FormData.
            // The DTO expects { message, attachmentPath }.
            // For this demo, we'll just send text. If file integration is needed, we need a file upload endpoint.

            // Handle file upload if exists (Mocking file upload logic for DTO)
            const attachmentPath = responseFile ? "path/to/uploaded/file.pdf" : null;

            await respondToReport(id, responseMessage, attachmentPath);
            addToast("Response sent successfully", "success");
            setResponseMessage('');
            setResponseFile(null);
            loadReportDetails();
        } catch (error) {
            console.error("Error sending response:", error);
            addToast("Failed to send response", "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!report) return <div>Report not found</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
            case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100 border-blue-200';
            case 'RESOLVED': return 'text-green-600 bg-green-100 border-green-200';
            case 'REJECTED': return 'text-red-600 bg-red-100 border-red-200';
            default: return 'text-gray-600 bg-gray-100 border-gray-200';
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <button
                onClick={() => navigate('/admin/civilian-reports')}
                className="flex items-center text-gray-600 hover:text-teal-600 mb-6 transition-colors"
            >
                <ArrowLeft className="mr-2" size={20} /> Back to Reports
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Report Info Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                    {report.title}
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(report.status)}`}>
                                        {report.status?.replace('_', ' ')}
                                    </span>
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Ref ID: <span className="font-mono text-gray-700">{report.referenceCode}</span></p>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold 
                                        ${report.priority === 'HIGH' ? 'bg-red-50 text-red-600' :
                                        report.priority === 'MEDIUM' ? 'bg-yellow-50 text-yellow-600' :
                                            'bg-green-50 text-green-600'}`}>
                                    {report.priority} Priority
                                </span>
                                <p className="text-xs text-gray-400 mt-2">{new Date(report.createdAt).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Description</h3>
                                <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap leading-relaxed border border-gray-100">
                                    {report.description || "No description provided."}
                                </div>
                            </div>

                            {report.attachmentPath && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Attachments</h3>
                                    <a
                                        href={report.attachmentPath} // Assuming this serves the file or opens a viewer
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors"
                                    >
                                        <Download className="mr-2" size={16} /> View Attachment
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Admin Response Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Admin Response</h3>
                        <form onSubmit={handleSendResponse}>
                            <div className="mb-4">
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                    rows="4"
                                    placeholder="Write your response here..."
                                    value={responseMessage}
                                    onChange={(e) => setResponseMessage(e.target.value)}
                                ></textarea>
                            </div>
                            {/* File input placeholder - would need actual file upload logic */}
                            {/* <div className="mb-4">
                                    <input type="file" onChange={(e) => setResponseFile(e.target.files[0])} />
                                </div> */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="inline-flex items-center px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50"
                                >
                                    <Send className="mr-2" size={16} /> Send Response
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar: Civilian Info & Actions */}
                <div className="space-y-6">
                    {/* Civilian Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Submitted By</h3>
                        <div className="flex items-center mb-4">
                            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">
                                {report.civilianName ? report.civilianName.charAt(0) : 'U'}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{report.civilianName || 'Unknown'}</p>
                                <p className="text-xs text-gray-500">ID: {report.civilianId}</p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            <p className="mb-1"><span className="font-medium">Email:</span> {report.civilianEmail || 'N/A'}</p>
                        </div>
                        <button
                            onClick={() => navigate(`/admin/civilians/${report.civilianId}`)}
                            className="mt-4 w-full px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                        >
                            View Profile
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Actions</h3>
                        <div className="space-y-3">
                            {report.status === 'PENDING' && (
                                <button
                                    onClick={() => handleStatusChange('IN_PROGRESS')}
                                    disabled={submitting}
                                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                                >
                                    <Clock className="mr-2" size={18} /> Mark as In Progress
                                </button>
                            )}
                            {(report.status === 'PENDING' || report.status === 'IN_PROGRESS') && (
                                <>
                                    <button
                                        onClick={() => handleStatusChange('RESOLVED')}
                                        disabled={submitting}
                                        className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm transition-colors"
                                    >
                                        <CheckCircle className="mr-2" size={18} /> Resolve
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange('REJECTED')}
                                        disabled={submitting}
                                        className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm transition-colors"
                                    >
                                        <XCircle className="mr-2" size={18} /> Reject
                                    </button>
                                </>
                            )}
                            {(report.status === 'RESOLVED' || report.status === 'REJECTED') && (
                                <div className="p-3 bg-gray-50 text-center text-sm text-gray-500 rounded-lg italic border border-gray-100">
                                    This report is closed.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status History / Dates */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Timeline</h3>
                        <div className="border-l-2 border-gray-200 ml-2 space-y-6">
                            <div className="relative pl-6">
                                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-teal-400 ring-4 ring-white"></div>
                                <p className="text-sm font-medium text-gray-900">Submitted</p>
                                <p className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleString()}</p>
                            </div>
                            {report.statusChangedAt && (
                                <div className="relative pl-6">
                                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-gray-400 ring-4 ring-white"></div>
                                    <p className="text-sm font-medium text-gray-900">Last Update</p>
                                    <p className="text-xs text-gray-500">{new Date(report.statusChangedAt).toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CivilianReportDetails;
