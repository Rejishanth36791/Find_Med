import React, { useState, useEffect } from 'react';
import {
    FileText,
    AlertTriangle,
    Send,
    Paperclip,
    X,
    CheckCircle,
    HelpCircle,
    ShieldAlert
} from 'lucide-react';
import { submitReport, submitAppeal, getCivilianProfile } from '../../services/civilianService';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const AppealsAndReports = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('report'); // 'report' or 'appeal'
    const [loading, setLoading] = useState(false);
    const [civilian, setCivilian] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Form States
    const [reportForm, setReportForm] = useState({
        type: 'INQUIRY', // REPORT or INQUIRY
        issueCategory: 'TECHNICAL',
        priority: 'MEDIUM',
        title: '',
        description: '',
        attachment: ''
    });

    const [appealForm, setAppealForm] = useState({
        reason: '',
        attachment: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getCivilianProfile(); // Fetch profile to check ban status locally if needed
            setCivilian(data);
        } catch (error) {
            console.error("Failed to load profile", error);
        }
    };

    const handleReportChange = (e) => {
        const { name, value } = e.target;
        setReportForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAppealChange = (e) => {
        const { name, value } = e.target;
        setAppealForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, formType) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, this would upload to a server and get a URL. 
            // For now, we'll just simulate a path or use FileReader for small preview
            // Assuming the backend expects a string path/URL for now.
            const fakePath = "/uploads/" + file.name;
            if (formType === 'report') {
                setReportForm(prev => ({ ...prev, attachment: fakePath }));
            } else {
                setAppealForm(prev => ({ ...prev, attachment: fakePath }));
            }
            showToast('File selected: ' + file.name, 'info');
        }
    };

    const validateForm = () => {
        if (activeTab === 'report') {
            if (!reportForm.title.trim() || !reportForm.description.trim()) {
                showToast('Please fill in all required fields.', 'error');
                return false;
            }
        } else {
            if (!appealForm.reason.trim()) {
                showToast('Please provide a reason for your appeal.', 'error');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        setLoading(true);
        setShowModal(false);

        try {
            if (activeTab === 'report') {
                await submitReport({
                    type: reportForm.type,
                    category: reportForm.issueCategory,
                    priority: reportForm.priority,
                    title: reportForm.title,
                    details: reportForm.description, // Backend uses 'details'
                    attachments: reportForm.attachment ? [reportForm.attachment] : [] // Backend uses list
                });
                showToast('Report submitted successfully!', 'success');
                setReportForm({
                    type: 'INQUIRY',
                    issueCategory: 'TECHNICAL',
                    priority: 'MEDIUM',
                    title: '',
                    description: '',
                    attachment: ''
                });
            } else {
                if (!civilian) throw new Error("Could not identify user.");
                await submitAppeal(civilian.id, {
                    appealReason: appealForm.reason,
                    attachment: appealForm.attachment
                });
                showToast('Appeal submitted successfully!', 'success');
                setAppealForm({ reason: '', attachment: '' });
            }
        } catch (error) {
            console.error("Submission error:", error);
            showToast(error.message || 'Submission failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 font-['Inter']">

            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Appeals & Reports</h1>
                <p className="text-slate-500 mt-2 text-sm max-w-2xl">
                    Submit an Appeal if your account is banned, or make a Report / Inquiry regarding system issues, inventory, or reservations.
                </p>
            </div>

            {/* Toggle Tabs */}
            <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm inline-flex">
                <button
                    onClick={() => setActiveTab('report')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2
                    ${activeTab === 'report'
                            ? 'bg-[#2FA4A9] text-white shadow-md transform scale-105'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    <HelpCircle size={18} />
                    Report / Inquiry
                </button>
                <div className="w-px bg-slate-100 my-2 mx-1"></div>
                <button
                    onClick={() => setActiveTab('appeal')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2
                    ${activeTab === 'appeal'
                            ? 'bg-[#2FA4A9] text-white shadow-md transform scale-105'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    <ShieldAlert size={18} />
                    Appeal Submission (APS)
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 animate-in fade-in zoom-in duration-300">

                {activeTab === 'report' ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                            <div className="p-3 bg-[#e0f2f1] text-[#2FA4A9] rounded-2xl">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Submit a Report / Inquiry</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Admin Support Channel</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Type */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Type</label>
                                <div className="relative">
                                    <select
                                        name="type"
                                        value={reportForm.type}
                                        onChange={handleReportChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-[#2FA4A9] outline-none appearance-none"
                                    >
                                        <option value="INQUIRY">Inquiry</option>
                                        <option value="REPORT">Report</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Issue Category</label>
                                <div className="relative">
                                    <select
                                        name="issueCategory"
                                        value={reportForm.issueCategory}
                                        onChange={handleReportChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-[#2FA4A9] outline-none appearance-none"
                                    >
                                        <option value="TECHNICAL">Technical Issue</option>
                                        <option value="INVENTORY">Inventory / Product</option>
                                        <option value="RESERVATION">Reservation Issue</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Priority */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Priority</label>
                                <div className="relative">
                                    <select
                                        name="priority"
                                        value={reportForm.priority}
                                        onChange={handleReportChange}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-[#2FA4A9] outline-none appearance-none"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Title / Subject</label>
                            <input
                                type="text"
                                name="title"
                                value={reportForm.title}
                                onChange={handleReportChange}
                                placeholder="Brief summary of the issue..."
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#2FA4A9] outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                            <textarea
                                name="description"
                                value={reportForm.description}
                                onChange={handleReportChange}
                                rows="5"
                                placeholder="Explain the issue in detail..."
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#2FA4A9] outline-none transition-all placeholder:text-slate-400 resize-none"
                            ></textarea>
                        </div>

                        {/* Attachment */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Attachment (Optional)</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, 'report')}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl group-hover:bg-slate-100 transition-colors">
                                    <Paperclip className="text-slate-400" size={18} />
                                    <span className="text-sm text-slate-500 font-medium">
                                        {reportForm.attachment ? reportForm.attachment.split('/').pop() : 'Click to upload screenshot or document'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex justify-end">
                            <button
                                onClick={() => { if (validateForm()) setShowModal(true); }}
                                className="px-8 py-3 bg-[#2FA4A9] text-white font-bold rounded-xl hover:bg-[#268e93] transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                                <Send size={18} />
                                Submit {reportForm.type === 'INQUIRY' ? 'Inquiry' : 'Report'}
                            </button>
                        </div>

                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                            <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Submit an Appeal (APS)</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Account Resolution</p>
                            </div>
                        </div>

                        {/* Warning / Info Banner */}
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                            <div className="flex gap-3">
                                <ShieldAlert className="text-blue-600 flex-shrink-0" size={20} />
                                <div className="text-sm text-blue-800">
                                    <p className="font-bold mb-1">Important Note:</p>
                                    <p>Appeals are only applicable if your account has been temporarily banned. Submitting false appeals may result in permanent suspension.</p>
                                </div>
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Reason for Appeal</label>
                            <textarea
                                name="reason"
                                value={appealForm.reason}
                                onChange={handleAppealChange}
                                rows="6"
                                placeholder="Explain why your account should be unbanned. Provide as much detail as possible..."
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#2FA4A9] outline-none transition-all placeholder:text-slate-400 resize-none"
                            ></textarea>
                        </div>

                        {/* Attachment */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Proof / Attachment (Optional)</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, 'appeal')}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl group-hover:bg-slate-100 transition-colors">
                                    <Paperclip className="text-slate-400" size={18} />
                                    <span className="text-sm text-slate-500 font-medium">
                                        {appealForm.attachment ? appealForm.attachment.split('/').pop() : 'Upload supporting documents (PDF, JPG, PNG)'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex justify-end">
                            <button
                                onClick={() => { if (validateForm()) setShowModal(true); }}
                                className="px-8 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                                <Send size={18} />
                                Submit Appeal
                            </button>
                        </div>

                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 transform transition-all scale-100">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e0f2f1] mb-4">
                            <CheckCircle className="h-6 w-6 text-[#2FA4A9]" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 text-center mb-2">Confirm Submission</h3>
                        <p className="text-center text-sm text-slate-500 mb-6">
                            Are you sure you want to submit this {activeTab === 'report' ? 'Report/Inquiry' : 'Appeal'} to the Admin?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
                            >
                                No, Go Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 bg-[#2FA4A9] text-white font-bold rounded-xl hover:bg-[#268e93] transition-colors shadow-sm text-sm disabled:opacity-70"
                            >
                                {loading ? 'Sending...' : 'Yes, Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AppealsAndReports;
