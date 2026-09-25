import adminClient from "./adminClient";

export async function fetchDashboardStats() {
    const res = await adminClient.get("/api/admin/dashboard/stats");
    return res.data;
}

export async function fetchPendingAlerts() {
    const res = await adminClient.get("/api/admin/dashboard/alerts");
    return res.data;
}

export async function fetchCiviliansChart() {
    const res = await adminClient.get("/api/admin/dashboard/charts/civilians");
    return res.data;
}

export async function fetchPharmaciesChart() {
    const res = await adminClient.get("/api/admin/dashboard/charts/pharmacies");
    return res.data;
}

export async function fetchAdminsChart() {
    const res = await adminClient.get("/api/admin/dashboard/charts/admins");
    return res.data;
}

export async function fetchReservationsChart(days = 30) {
    const res = await adminClient.get(`/api/admin/dashboard/charts/reservations?days=${days}`);
    return res.data;
}

export async function fetchNotificationMetrics() {
    const res = await adminClient.get("/api/admin/dashboard/notifications/metrics");
    return res.data;
}
