// Service/Admin/ReportService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8081/admin/pharmacy-reports";

const normalizeReport = (report) => ({
    id: report?.id,
    pharmacy_id: report?.pharmacy?.id ?? report?.pharmacy_id,
    pharmacy_name: report?.pharmacy?.name ?? report?.pharmacy_name,
    category: report?.issueCategory ?? report?.category,
    type: report?.type,
    priority: report?.priority,
    title: report?.title ?? report?.subject,
    subject: report?.title ?? report?.subject,
    description: report?.description,
    attachment: report?.attachment,
    attachments: report?.attachments ?? (report?.attachment ? [report.attachment] : []),
    status: report?.status,
    date_submitted: report?.createdAt ?? report?.date_submitted,
    created_at: report?.createdAt ?? report?.created_at,
    status_changed_at: report?.statusChangedAt ?? report?.status_changed_at,
});

export const getReportsByStatus = async (status) => {
    const response = await axios.get(`${API_BASE_URL}/status/${status}`);
    return (response.data || []).map(normalizeReport);
};

export const getReportsByPharmacy = async (pharmacyId) => {
    const response = await axios.get(`${API_BASE_URL}/pharmacy/${pharmacyId}`);
    return (response.data || []).map(normalizeReport);
};

export const getAllReports = async () => {
    const statuses = ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"];
    const results = await Promise.all(
        statuses.map((status) => getReportsByStatus(status).catch(() => []))
    );

    const merged = results.flat();
    const unique = new Map();
    merged.forEach((report) => {
        if (report?.id != null) {
            unique.set(report.id, report);
        }
    });

    return Array.from(unique.values());
};

export const getReportDetails = async (id) => {
    const reports = await getAllReports();
    return reports.find((report) => `${report.id}` === `${id}`) || null;
};

export const updateReportStatus = async (id, status, reason) => {
    const response = await axios.patch(`${API_BASE_URL}/${id}/status`, null, {
        params: { status, reason },
    });
    return normalizeReport(response.data);
};

export const sendAdminResponse = async () => {
    throw new Error("Admin responses are not supported by the current backend endpoint");
};