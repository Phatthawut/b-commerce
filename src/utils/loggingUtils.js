/**
 * Secure logging utilities for masking sensitive information
 */

/**
 * Mask sensitive data in logs
 * @param {Object} data - The data object to mask
 * @param {Array} sensitiveFields - Array of field names to mask
 * @returns {Object} - Masked data object
 */
export const maskSensitiveData = (data, sensitiveFields = []) => {
  if (!data || typeof data !== "object") return data;

  const masked = { ...data };
  sensitiveFields.forEach((field) => {
    if (masked[field]) {
      masked[field] = "***";
    }
  });

  return masked;
};

/**
 * Log donation data securely
 * @param {Object} donationData - The donation data to log
 * @param {string} action - The action being performed
 */
export const logDonationData = (donationData, action = "donation") => {
  console.log(`${action} data:`, {
    donorName: donationData.donorName ? "***" : "Not provided",
    amount: donationData.amount,
    recipientCount: donationData.recipients?.length || 0,
    donationId: donationData.donationId,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log user data securely
 * @param {Object} userData - The user data to log
 * @param {string} action - The action being performed
 */
export const logUserData = (userData, action = "user") => {
  console.log(`${action} data:`, {
    userId: userData.uid || userData.id,
    email: userData.email ? "***" : "Not provided",
    hasName: !!userData.name,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log form submission securely
 * @param {Object} formData - The form data to log
 * @param {string} formType - The type of form
 */
export const logFormSubmission = (formData, formType = "form") => {
  console.log(`${formType} submitted:`, {
    formType: formType,
    hasEmail: !!formData.email,
    hasName: !!formData.name,
    hasPhone: !!formData.telephone,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log payment data securely
 * @param {Object} paymentData - The payment data to log
 * @param {string} action - The action being performed
 */
export const logPaymentData = (paymentData, action = "payment") => {
  console.log(`${action} data:`, {
    amount: paymentData.amount,
    currency: paymentData.currency,
    paymentMethod: paymentData.paymentMethod,
    status: paymentData.status,
    timestamp: new Date().toISOString(),
  });
};
