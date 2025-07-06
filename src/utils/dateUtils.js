/**
 * Date formatting utilities for internationalization
 */

/**
 * Format a date based on the current locale
 * @param {Date|Object} date - The date to format (can be Date object or Firestore timestamp)
 * @param {string} currentLocale - Current locale ('en' or 'th')
 * @param {Object} options - Additional formatting options
 * @returns {string} - Formatted date string
 */
export const formatDateByLocale = (
  date,
  currentLocale = "en",
  options = {}
) => {
  try {
    // Handle both Firestore Timestamp and regular Date
    let dateObj;
    if (date && date.toDate) {
      dateObj = date.toDate();
    } else {
      dateObj = new Date(date);
    }

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return currentLocale === "th" ? "ไม่ระบุ" : "Not specified";
    }

    // Dynamic locale mapping
    const localeMap = {
      th: "th-TH",
      en: "en-US",
    };

    // Default formatting options
    const defaultOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      ...options,
    };

    const targetLocale = localeMap[currentLocale] || "en-US";

    return dateObj.toLocaleDateString(targetLocale, defaultOptions);
  } catch (error) {
    console.error("Error formatting date:", error);
    return currentLocale === "th" ? "ไม่ระบุ" : "Not specified";
  }
};

/**
 * Format a date for display in tables/lists (shorter format)
 * @param {Date|Object} date - The date to format
 * @param {string} currentLocale - Current locale ('en' or 'th')
 * @returns {string} - Formatted date string
 */
export const formatShortDate = (date, currentLocale = "en") => {
  return formatDateByLocale(date, currentLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format a date with time for detailed views
 * @param {Date|Object} date - The date to format
 * @param {string} currentLocale - Current locale ('en' or 'th')
 * @returns {string} - Formatted date string with time
 */
export const formatDateTime = (date, currentLocale = "en") => {
  return formatDateByLocale(date, currentLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * Format a date for admin panels (standard format)
 * @param {Date|Object} date - The date to format
 * @param {string} currentLocale - Current locale ('en' or 'th')
 * @returns {string} - Formatted date string
 */
export const formatAdminDate = (date, currentLocale = "en") => {
  return formatDateByLocale(date, currentLocale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format a date for stores (works with or without locale)
 * @param {Date|Object} timestamp - The date to format
 * @param {string} currentLocale - Current locale ('en' or 'th'), defaults to 'en'
 * @returns {string} - Formatted date string
 */
export const formatStoreDate = (timestamp, currentLocale = "en") => {
  if (!timestamp) return currentLocale === "th" ? "ไม่ระบุ" : "N/A";

  try {
    // Handle Firestore Timestamp objects
    if (timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return formatDateByLocale(date, currentLocale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Handle Date objects or ISO strings
    return formatDateByLocale(new Date(timestamp), currentLocale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return currentLocale === "th" ? "วันที่ไม่ถูกต้อง" : "Invalid date";
  }
};
