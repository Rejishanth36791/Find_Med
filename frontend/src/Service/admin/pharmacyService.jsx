// src/Service/Admin/PharmacyService.jsx

const API_BASE = "http://localhost:8080/api/admin/pharmacies";

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "API request failed");
  }
  return response.json();
}

/* ================================
   PHARMACY CRUD
================================ */

export async function getPharmacies(status = null, type = null) {
  let url = `${API_BASE}`;
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (type) params.append("type", type);
  if ([...params].length) url += `?${params.toString()}`;

  const response = await fetch(url, { method: "GET" });
  return handleResponse(response);
}

export async function getPharmacyDetails(pharmacyId) {
  const response = await fetch(`${API_BASE}/${pharmacyId}`, { method: "GET" });
  return handleResponse(response);
}

export async function createPharmacy(pharmacy) {
  const response = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pharmacy),
  });
  return handleResponse(response);
}

export async function updatePharmacy(pharmacyId, pharmacy) {
  const response = await fetch(`${API_BASE}/${pharmacyId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pharmacy),
  });
  return handleResponse(response);
}

/* ================================
   PHARMACY ACTIONS (Fixed for 400 Errors)
================================ */

export async function approvePharmacy(pharmacyId) {
  const response = await fetch(`${API_BASE}/${pharmacyId}/approve`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  return handleResponse(response);
}

export async function activatePharmacy(pharmacyId) {
  // Added headers and empty body to satisfy server-side validation
  const response = await fetch(`${API_BASE}/${pharmacyId}/activate`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  return handleResponse(response);
}

export async function suspendPharmacy(pharmacyId) {
  const response = await fetch(`${API_BASE}/${pharmacyId}/suspend`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  return handleResponse(response);
}

export async function removePharmacy(pharmacyId) {
  const response = await fetch(`${API_BASE}/${pharmacyId}/remove`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  return handleResponse(response);
}

export async function rejectPharmacy(pharmacyId, reason) {
  const response = await fetch(`${API_BASE}/${pharmacyId}/reject`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  return handleResponse(response);
}

/* ================================
   PHARMACY LINKED DATA
================================ */

export const getPharmacyInventory = async (pharmacyId) => {
  const response = await fetch(`${API_BASE}/${pharmacyId}/inventory`, { method: "GET" });
  return handleResponse(response);
};

export const getPharmacyReservations = async (pharmacyId) => {
  const response = await fetch(`${API_BASE}/${pharmacyId}/reservations`, { method: "GET" });
  return handleResponse(response);
};

/* ================================
   REPORTS
================================ */

export async function getReports(pharmacyId) {
  const response = await fetch(`${API_BASE}/${pharmacyId}/reports`, { method: "GET" });
  return handleResponse(response);
}

export async function updateReportStatus(reportId, status) {
  const response = await fetch(`${API_BASE}/reports/${reportId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
}

/* ================================
   NOTIFICATIONS
================================ */

export async function getNotifications() {
  const response = await fetch(`${API_BASE.replace("/pharmacies", "/notifications")}`, { method: "GET" });
  return handleResponse(response);
}

export async function markNotificationRead(notificationId) {
  const response = await fetch(`${API_BASE.replace("/pharmacies", "/notifications")}/${notificationId}/read`, { method: "PUT" });
  return handleResponse(response);
}