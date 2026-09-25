import adminClient from "./adminClient";

export async function searchPharmacies(query) {
    const params = {};
    if (query) params.query = query;

    const res = await adminClient.get("/api/pharmacies", { params });
    return res.data;
}

export async function getNearbyPharmacies(lat, lng, radius = 10) {
    const params = { lat, lng, radius };
    const res = await adminClient.get("/api/pharmacies/nearby", { params });
    return res.data;
}

export async function searchMedicines(query) {
    const params = { name: query };
    const res = await adminClient.get("/api/reservations/medicines/search", { params });
    return res.data;
}

export async function recommendPharmacies(medicineId, quantity, lat, lng) {
    const payload = { medicineId, requiredQuantity: quantity, lat, lng };
    const res = await adminClient.post("/api/reservations/recommend-pharmacies", payload);
    return res.data;
}

export async function confirmReservation(data) {
    const res = await adminClient.post("/api/reservations/confirm", data);
    return res.data;
}

export async function getActivity() {
    const res = await adminClient.get("/api/reservations/activity");
    return res.data;
}
