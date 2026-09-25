import adminClient from "./adminClient";

export async function fetchCivilianMetrics() {
  const res = await adminClient.get("/api/admin/civilians/metrics");
  return res.data;
}

export async function fetchCivilians({ status, search, page, size }) {
  const params = {};
  if (status) params.status = status;
  if (search) params.search = search;
  params.page = page ?? 0;
  params.size = size ?? 10;

  const res = await adminClient.get("/api/admin/civilians", { params });
  return res.data; // Spring Page object
}

export async function fetchCivilianDetails(id) {
  const res = await adminClient.get(`/api/admin/civilians/${id}`);
  return res.data;
}

export async function fetchCivilianVivo(id) {
  const res = await adminClient.get(`/api/admin/civilians/${id}/vivo`);
  return res.data;
}

export async function tempBanCivilian(id, reason, adminId) {
  await adminClient.post(`/api/admin/civilians/${id}/temp-ban?adminId=${adminId}`, { reason });
}

export async function permanentBanCivilian(id, reason, adminId) {
  await adminClient.post(`/api/admin/civilians/${id}/permanent-ban?adminId=${adminId}`, { reason });
}

export async function fetchAppealDetails({ civilianId, appealId }) {
  if (appealId) {
    const res = await adminClient.get(`/api/admin/appeals/${appealId}`);
    return res.data;
  }
  if (civilianId) {
    const res = await adminClient.get(`/api/admin/appeals/latest-by-civilian?civilianId=${civilianId}`);
    return res.data;
  }
  throw new Error("Either appealId or civilianId must be provided");
}

export async function approveAppeal(appealId, adminId) {
  await adminClient.post(`/api/admin/appeals/${appealId}/approve?adminId=${adminId}`);
}

export async function rejectAppeal(appealId, reason, adminId) {
  await adminClient.post(`/api/admin/appeals/${appealId}/reject?adminId=${adminId}`, { reason });
}

export async function fetchReportMetrics() {
  const res = await adminClient.get("/api/admin/civilian-reports/metrics");
  return res.data;
}

export async function fetchReports({ type, status, search, page, size }) {
  const params = {};
  if (type) params.type = type;
  if (status) params.status = status;
  if (search) params.search = search;
  params.page = page ?? 0;
  params.size = size ?? 10;

  const res = await adminClient.get("/api/admin/civilian-reports", { params });
  return res.data;
}

export async function fetchReportDetails(id) {
  const res = await adminClient.get(`/api/admin/civilian-reports/${id}`);
  return res.data;
}

export async function markReportInProgress(id) {
  await adminClient.post(`/api/admin/civilian-reports/${id}/in-progress`);
}

export async function resolveReport(id) {
  await adminClient.post(`/api/admin/civilian-reports/${id}/resolve`);
}

export async function rejectReport(id) {
  await adminClient.post(`/api/admin/civilian-reports/${id}/reject`);
}

export async function respondToReport(id, message, attachmentPath) {
  await adminClient.post(`/api/admin/civilian-reports/${id}/respond`, { message, attachmentPath });
}
