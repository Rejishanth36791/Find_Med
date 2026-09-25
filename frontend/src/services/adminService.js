import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Helper to get the JWT token from storage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const adminService = {
    // 1. Get All Admins (List)
    getAllAdmins: async () => {
        const response = await axios.get(`${API_URL}/admins`, getAuthHeader());
        return response.data;
    },

    // 2. Get Single Admin (Details)
    getAdminById: async (id) => {
        const response = await axios.get(`${API_URL}/admins/${id}`, getAuthHeader());
        return response.data;
    },

    // 3. Get Metrics (Top Cards)
    getMetrics: async () => {
        const response = await axios.get(`${API_URL}/admins/metrics`, getAuthHeader());
        return response.data;
    },

    // 4. Create New Admin (Modal)
    createAdmin: async (data) => {
        const response = await axios.post(`${API_URL}/admins`, data, getAuthHeader());
        return response.data;
    },

    // 5. Update Email (Side Panel)
    updateAdminEmail: async (id, data) => {
        const response = await axios.patch(`${API_URL}/admins/${id}/email`, data, getAuthHeader());
        return response.data;
    },

    // 6. Update Status (Activate/Deactivate Buttons)
    updateAdminStatus: async (id, status) => {
        // Matches your Java Controller: @RequestParam AdminStatus status
        await axios.patch(`${API_URL}/admins/${id}/status?status=${status}`, {}, getAuthHeader());
    },

    // 7. Delete Admin (Remove Button)
    deleteAdmin: async (id) => {
        await axios.delete(`${API_URL}/admins/${id}`, getAuthHeader());
    },

    // 8. Get Rejected Pharmacy (Details)
    getRejectedPharmacyById: async (id) => {
        const response = await axios.get(`${API_URL}/admin/pharmacies/rejected/${id}`, getAuthHeader());
        return response.data;
    },

    // 9. Get My Profile
    getMyProfile: async () => {
        const response = await axios.get(`${API_URL}/admins/me`, getAuthHeader());
        return response.data;
    }
};