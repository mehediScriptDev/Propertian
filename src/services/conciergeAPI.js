import api from "@/lib/api";

/**
 * Concierge Partner API
 * Minimal wrapper to submit partner applications from the client
 */
export const applyAsPartner = async (data) => {
  try {
    const response = await api.post("/concierge/partners/apply", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const conciergePartnerAPI = {
  applyAsPartner,
};

export default conciergePartnerAPI;

/**
 * Get partner applications (supports server-side pagination and filters)
 * @param {object} params - Query params: page, limit, status, search
 */
export const getApplications = async (params = {}, config = {}) => {
  try {
    const response = await api.get("/concierge/partners/applications", {
      params,
      ...config,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update application status
 * @param {string} applicationId
 * @param {object} body - e.g. { status: 'APPROVED', adminNotes: '...', createUserAccount: true }
 */
export const updateApplicationStatus = async (applicationId, body = {}) => {
  try {
    const response = await api.put(
      `/concierge/partners/applications/${applicationId}/status`,
      body,
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// add to default export
conciergePartnerAPI.getApplications = getApplications;
conciergePartnerAPI.updateApplicationStatus = updateApplicationStatus;
