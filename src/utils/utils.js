// src/components/patient/utils.js

/**
 * formatDate
 * @param {string|Date} dateInput — an ISO date string or Date object
 * @returns {string} e.g. "01 apr 2025"
 */
export function formatDate(dateInput) {
    if (!dateInput) return "";
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const day = String(date.getDate()).padStart(2, "0");
    // month abbreviation, lowercase to match your styles
    const month = date
      .toLocaleString("default", { month: "short" })
      .toLowerCase();
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
  
  /**
   * formatTime
   * @param {string} timeString — e.g. "10:00:00"
   * @returns {string} e.g. "10:00"
   */
  export function formatTime(timeString) {
    if (!timeString) return "";
    // if it's an ISO string, extract the time portion
    const t = timeString.includes("T")
      ? new Date(timeString).toTimeString().slice(0, 5)
      : timeString.slice(0, 5);
    return t;
  }
  