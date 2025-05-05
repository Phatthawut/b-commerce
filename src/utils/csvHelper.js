/**
 * CSV Helper functions for recipient import/export
 */

/**
 * Format CSV data for recipient import
 * @param {string} csvString - The raw CSV data as a string
 * @returns {string} - The formatted CSV data ready for import
 */
export const formatCsvForImport = (csvString) => {
  // Split into lines
  const lines = csvString.trim().split("\n");

  // Process header line
  const header = lines[0];

  // Process data lines
  const dataLines = lines.slice(1).map((line) => {
    // Split the line by comma, respecting quoted values
    const values = parseCSVLine(line);

    // Check if we're using an old format with "northamerica" instead of "north-america"
    if (values[2] === "northamerica") {
      values[2] = "north-america";
    }

    // Return the formatted line
    return formatCSVLine(values);
  });

  // Combine header and data
  return [header, ...dataLines].join("\n");
};

/**
 * Parse a CSV line, respecting quoted values
 * @param {string} line - A line from a CSV file
 * @returns {string[]} - Array of values
 */
function parseCSVLine(line) {
  const values = [];
  let currentValue = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' && (i === 0 || line[i - 1] !== "\\")) {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(currentValue);
      currentValue = "";
    } else {
      currentValue += char;
    }
  }

  // Add the last value
  values.push(currentValue);

  // Clean up quoted values
  return values.map((value) => {
    // Remove surrounding quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.substring(1, value.length - 1);
    }
    return value;
  });
}

/**
 * Format an array of values into a CSV line
 * @param {string[]} values - Array of values
 * @returns {string} - Formatted CSV line
 */
function formatCSVLine(values) {
  return values
    .map((value) => {
      // Quote values that contain commas or quotes
      if (value.includes(",") || value.includes('"')) {
        // Escape quotes within the value
        const escapedValue = value.replace(/"/g, '""');
        return `"${escapedValue}"`;
      }
      return value;
    })
    .join(",");
}

/**
 * Create a downloadable CSV file from data
 * @param {string} csvData - CSV data as a string
 * @param {string} filename - Name for the downloaded file
 */
export const downloadCsv = (csvData, filename = "recipients.csv") => {
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
