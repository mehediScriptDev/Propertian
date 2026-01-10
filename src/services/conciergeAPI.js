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
