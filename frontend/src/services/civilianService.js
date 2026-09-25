import api from './api';

// Submit a Report or Inquiry
export const submitReport = async (reportData) => {
    try {
        const response = await api.post('/civilian/reports', reportData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to submit report' };
    }
};

// Submit an Appeal
export const submitAppeal = async (civilianId, appealData) => {
    try {
        // appealData should contain appealReason and attachment
        const response = await api.post(`/civilian/appeals?civilianId=${civilianId}`, appealData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to submit appeal' };
    }
};

// Fetch Civilian Details (for Appeal eligibility check)
export const getCivilianProfile = async () => {
    try {
        const response = await api.get('/civilian/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch profile' };
    }
};
