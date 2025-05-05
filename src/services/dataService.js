// This service manages persistence of data that was previously stored in Firebase
// It uses localStorage as a simple persistence layer

import initialData from "@/data/recipients.json";

class DataService {
  constructor() {
    this.initialize();
    // Create an in-memory cache for frequently accessed data
    this._cache = {
      recipients: null,
      recipientsByRegion: {},
      recipientsByCategory: {},
      recipientsByCountry: {},
      regions: null,
    };
  }

  // Initialize the data store
  initialize() {
    try {
      // Check if data already exists in localStorage
      if (!localStorage.getItem("recipients_chunks")) {
        // Initialize with data from JSON files
        this.storeRecipientsInChunks(initialData.recipients);
        console.log(
          `Initialized ${initialData.recipients.length} recipients in localStorage`
        );
      }

      if (!localStorage.getItem("regions")) {
        localStorage.setItem("regions", JSON.stringify(initialData.regions));
        console.log(
          `Initialized ${initialData.regions.length} regions in localStorage`
        );
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }

  // Store recipients in chunks to avoid localStorage limits
  storeRecipientsInChunks(recipients, chunkSize = 500) {
    if (!recipients || recipients.length === 0) return;

    try {
      // Store the total count
      localStorage.setItem("recipients_count", recipients.length.toString());

      // Clear any existing chunks
      this.clearRecipientChunks();

      // Split recipients into chunks and store each chunk
      const totalChunks = Math.ceil(recipients.length / chunkSize);

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, recipients.length);
        const chunk = recipients.slice(start, end);

        localStorage.setItem(`recipients_chunk_${i}`, JSON.stringify(chunk));
      }

      // Store the number of chunks for later retrieval
      localStorage.setItem("recipients_chunks", totalChunks.toString());

      // Clear cache since data has changed
      this._clearCache();

      console.log(
        `Stored ${recipients.length} recipients in ${totalChunks} chunks`
      );
    } catch (error) {
      console.error("Error storing recipients in chunks:", error);
      throw error;
    }
  }

  // Clear all recipient chunks
  clearRecipientChunks() {
    try {
      const totalChunks = parseInt(
        localStorage.getItem("recipients_chunks") || "0"
      );

      // Remove each chunk
      for (let i = 0; i < totalChunks; i++) {
        localStorage.removeItem(`recipients_chunk_${i}`);
      }

      // Reset metadata
      localStorage.removeItem("recipients_chunks");
      localStorage.removeItem("recipients_count");

      // Clear cache
      this._clearCache();
    } catch (error) {
      console.error("Error clearing recipient chunks:", error);
    }
  }

  // Clear in-memory cache
  _clearCache() {
    this._cache = {
      recipients: null,
      recipientsByRegion: {},
      recipientsByCategory: {},
      recipientsByCountry: {},
      regions: null,
    };
  }

  // Get all recipients by combining chunks
  getRecipients() {
    try {
      // Check cache first
      if (this._cache.recipients !== null) {
        return this._cache.recipients;
      }

      const totalChunks = parseInt(
        localStorage.getItem("recipients_chunks") || "0"
      );

      // If no chunks are stored, return empty array
      if (totalChunks === 0) {
        this._cache.recipients = [];
        return [];
      }

      // Combine all chunks
      let allRecipients = [];

      for (let i = 0; i < totalChunks; i++) {
        const chunkData = localStorage.getItem(`recipients_chunk_${i}`);
        if (chunkData) {
          const chunk = JSON.parse(chunkData);
          allRecipients = allRecipients.concat(chunk);
        }
      }

      // Store in cache for future use
      this._cache.recipients = allRecipients;

      return allRecipients;
    } catch (error) {
      console.error("Error getting recipients:", error);
      return [];
    }
  }

  // Get filtered recipients by category (optimized)
  getRecipientsByCategory(category) {
    try {
      // Check cache first
      if (this._cache.recipientsByCategory[category]) {
        return this._cache.recipientsByCategory[category];
      }

      // Option 1: Use full recipient list if already in memory
      if (this._cache.recipients) {
        const filtered = this._cache.recipients.filter(
          (r) => r.category === category
        );
        this._cache.recipientsByCategory[category] = filtered;
        return filtered;
      }

      // Option 2: Process chunks directly without loading all recipients
      const totalChunks = parseInt(
        localStorage.getItem("recipients_chunks") || "0"
      );
      const filtered = [];

      for (let i = 0; i < totalChunks; i++) {
        const chunkData = localStorage.getItem(`recipients_chunk_${i}`);
        if (chunkData) {
          const chunk = JSON.parse(chunkData);
          const matchingRecipients = chunk.filter(
            (r) => r.category === category
          );
          filtered.push(...matchingRecipients);
        }
      }

      // Store in cache for future use
      this._cache.recipientsByCategory[category] = filtered;

      return filtered;
    } catch (error) {
      console.error(
        `Error getting recipients by category (${category}):`,
        error
      );
      return [];
    }
  }

  // Get filtered recipients by region (optimized)
  getRecipientsByRegion(regionId) {
    try {
      // Check cache first
      if (this._cache.recipientsByRegion[regionId]) {
        return this._cache.recipientsByRegion[regionId];
      }

      // Option 1: Use full recipient list if already in memory
      if (this._cache.recipients) {
        const filtered = this._cache.recipients.filter(
          (r) => r.regionId === regionId
        );
        this._cache.recipientsByRegion[regionId] = filtered;
        return filtered;
      }

      // Option 2: Process chunks directly without loading all recipients
      const totalChunks = parseInt(
        localStorage.getItem("recipients_chunks") || "0"
      );
      const filtered = [];

      for (let i = 0; i < totalChunks; i++) {
        const chunkData = localStorage.getItem(`recipients_chunk_${i}`);
        if (chunkData) {
          const chunk = JSON.parse(chunkData);
          const matchingRecipients = chunk.filter(
            (r) => r.regionId === regionId
          );
          filtered.push(...matchingRecipients);
        }
      }

      // Store in cache for future use
      this._cache.recipientsByRegion[regionId] = filtered;

      return filtered;
    } catch (error) {
      console.error(`Error getting recipients by region (${regionId}):`, error);
      return [];
    }
  }

  // Get filtered recipients by country
  getRecipientsByCountry(country) {
    try {
      // Check cache first
      if (this._cache.recipientsByCountry[country]) {
        return this._cache.recipientsByCountry[country];
      }

      // Option 1: Use full recipient list if already in memory
      if (this._cache.recipients) {
        const filtered = this._cache.recipients.filter(
          (r) => r.country === country
        );
        this._cache.recipientsByCountry[country] = filtered;
        return filtered;
      }

      // Option 2: Process chunks directly without loading all recipients
      const totalChunks = parseInt(
        localStorage.getItem("recipients_chunks") || "0"
      );
      const filtered = [];

      for (let i = 0; i < totalChunks; i++) {
        const chunkData = localStorage.getItem(`recipients_chunk_${i}`);
        if (chunkData) {
          const chunk = JSON.parse(chunkData);
          const matchingRecipients = chunk.filter((r) => r.country === country);
          filtered.push(...matchingRecipients);
        }
      }

      // Store in cache for future use
      this._cache.recipientsByCountry[country] = filtered;

      return filtered;
    } catch (error) {
      console.error(`Error getting recipients by country (${country}):`, error);
      return [];
    }
  }

  // Get recipient by ID (optimized)
  getRecipientById(id) {
    try {
      // Option 1: Use full recipient list if already in memory
      if (this._cache.recipients) {
        return this._cache.recipients.find((r) => r.id === id) || null;
      }

      // Option 2: Search through chunks until found
      const totalChunks = parseInt(
        localStorage.getItem("recipients_chunks") || "0"
      );

      for (let i = 0; i < totalChunks; i++) {
        const chunkData = localStorage.getItem(`recipients_chunk_${i}`);
        if (chunkData) {
          const chunk = JSON.parse(chunkData);
          const recipient = chunk.find((r) => r.id === id);
          if (recipient) {
            return recipient;
          }
        }
      }

      return null;
    } catch (error) {
      console.error(`Error getting recipient by ID (${id}):`, error);
      return null;
    }
  }

  // Get filtered recipients with complex criteria
  getFilteredRecipients(filters = {}) {
    const { category, regionId, country, searchTerm } = filters;

    // Start with all recipients
    let results = this.getRecipients();

    // Apply category filter if specified
    if (category) {
      results = results.filter((recipient) => recipient.category === category);
    }

    // Apply region filter if specified
    if (regionId) {
      results = results.filter((recipient) => recipient.regionId === regionId);
    }

    // Apply country filter if specified
    if (country) {
      results = results.filter((recipient) => recipient.country === country);
    }

    // Apply search term filter if specified
    if (searchTerm && searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      results = results.filter((recipient) => {
        const nameMatch =
          recipient.name && recipient.name.toLowerCase().includes(term);
        const addressMatch =
          recipient.address && recipient.address.toLowerCase().includes(term);
        const emailMatch =
          recipient.email && recipient.email.toLowerCase().includes(term);
        const phoneMatch =
          recipient.phone && recipient.phone.toLowerCase().includes(term);
        return nameMatch || addressMatch || emailMatch || phoneMatch;
      });
    }

    return results;
  }

  // Get all regions
  getRegions() {
    try {
      // Check cache first
      if (this._cache.regions !== null) {
        return this._cache.regions;
      }

      const regions = JSON.parse(localStorage.getItem("regions") || "[]");

      // Store in cache
      this._cache.regions = regions;

      return regions;
    } catch (error) {
      console.error("Error getting regions:", error);
      return [];
    }
  }

  // Add a new recipient
  addRecipient(recipient) {
    try {
      const recipients = this.getRecipients();

      // Generate a unique ID if not provided
      if (!recipient.id) {
        recipient.id = this.generateId();
      }

      recipients.push(recipient);

      // Store updated recipients
      this.storeRecipientsInChunks(recipients);

      // Clear cache
      this._clearCache();

      return recipient;
    } catch (error) {
      console.error("Error adding recipient:", error);
      throw error;
    }
  }

  // Update an existing recipient
  updateRecipient(id, data) {
    try {
      const recipients = this.getRecipients();
      const index = recipients.findIndex((r) => r.id === id);

      if (index === -1) {
        throw new Error("Recipient not found");
      }

      recipients[index] = { ...recipients[index], ...data };

      // Store updated recipients
      this.storeRecipientsInChunks(recipients);

      // Clear cache
      this._clearCache();

      return recipients[index];
    } catch (error) {
      console.error("Error updating recipient:", error);
      throw error;
    }
  }

  // Delete a recipient
  deleteRecipient(id) {
    try {
      const recipients = this.getRecipients();
      const newRecipients = recipients.filter((r) => r.id !== id);

      if (newRecipients.length === recipients.length) {
        throw new Error("Recipient not found");
      }

      // Store updated recipients
      this.storeRecipientsInChunks(newRecipients);

      // Clear cache
      this._clearCache();

      return true;
    } catch (error) {
      console.error("Error deleting recipient:", error);
      throw error;
    }
  }

  // Import recipients from CSV or other source
  importRecipients(recipientsToAdd) {
    try {
      let recipients = this.getRecipients();

      // Process each recipient to add
      const added = [];
      recipientsToAdd.forEach((recipient) => {
        // Generate an ID if not provided
        if (!recipient.id) {
          recipient.id = this.generateId();
        }

        // Check if recipient already exists
        const exists = recipients.some(
          (r) =>
            r.name === recipient.name &&
            r.category === recipient.category &&
            r.regionId === recipient.regionId
        );

        if (!exists) {
          recipients.push(recipient);
          added.push(recipient);
        }
      });

      // Store updated recipients
      this.storeRecipientsInChunks(recipients);

      // Clear cache
      this._clearCache();

      return {
        success: true,
        count: added.length,
      };
    } catch (error) {
      console.error("Error importing recipients:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Reset data to initial values (for testing)
  resetData() {
    try {
      this.storeRecipientsInChunks(initialData.recipients);
      localStorage.setItem("regions", JSON.stringify(initialData.regions));

      // Clear cache
      this._clearCache();

      console.log("Data reset to initial values");
    } catch (error) {
      console.error("Error resetting data:", error);
      throw error;
    }
  }

  // Helper to generate unique IDs
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }
}

export const dataService = new DataService();
