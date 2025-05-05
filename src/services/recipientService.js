import { dataService } from "@/services/dataService";

class RecipientService {
  // Get all regions
  async getRegions() {
    try {
      return dataService.getRegions();
    } catch (error) {
      console.error("Error fetching regions:", error);
      throw error;
    }
  }

  // Get all recipients
  async getRecipients() {
    try {
      return dataService.getRecipients();
    } catch (error) {
      console.error("Error fetching recipients:", error);
      throw error;
    }
  }

  // Get recipients by category
  async getRecipientsByCategory(category) {
    try {
      const recipients = await this.getRecipients();
      return recipients.filter((recipient) => recipient.category === category);
    } catch (error) {
      console.error("Error fetching recipients by category:", error);
      throw error;
    }
  }

  // Get recipients by region
  async getRecipientsByRegion(regionId) {
    try {
      const recipients = await this.getRecipients();
      return recipients.filter((recipient) => recipient.regionId === regionId);
    } catch (error) {
      console.error("Error fetching recipients by region:", error);
      throw error;
    }
  }

  // Get recipients by category and region
  async getFilteredRecipients(category, regionId) {
    try {
      const recipients = await this.getRecipients();
      return recipients.filter(
        (recipient) =>
          recipient.category === category && recipient.regionId === regionId
      );
    } catch (error) {
      console.error("Error fetching filtered recipients:", error);
      throw error;
    }
  }

  // Get recipients by category, region, and country
  async getRecipientsByCountry(
    category,
    regionId,
    country,
    pageSize = 20,
    page = 1
  ) {
    try {
      const recipients = await this.getRecipients();
      const filteredRecipients = recipients.filter(
        (recipient) =>
          recipient.category === category &&
          recipient.regionId === regionId &&
          recipient.country === country
      );

      // Simple pagination logic
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedRecipients = filteredRecipients.slice(
        startIndex,
        endIndex
      );

      return {
        items: paginatedRecipients,
        hasMore: endIndex < filteredRecipients.length,
      };
    } catch (error) {
      console.error("Error fetching recipients by country:", error);
      throw error;
    }
  }

  // Get recipient by ID
  async getRecipientById(id) {
    try {
      const recipients = await this.getRecipients();
      const recipient = recipients.find((r) => r.id === id);
      if (!recipient) {
        throw new Error("Recipient not found");
      }
      return recipient;
    } catch (error) {
      console.error("Error fetching recipient by ID:", error);
      throw error;
    }
  }

  // Get unique countries for a region
  async getCountriesByRegion(regionId) {
    try {
      const recipients = await this.getRecipientsByRegion(regionId);
      const countries = new Set();

      recipients.forEach((recipient) => {
        if (recipient.country) {
          countries.add(recipient.country);
        }
      });

      return Array.from(countries).sort();
    } catch (error) {
      console.error("Error fetching countries by region:", error);
      throw error;
    }
  }

  // Add a new recipient
  async addRecipient(recipient) {
    try {
      return dataService.addRecipient(recipient);
    } catch (error) {
      console.error("Error adding recipient:", error);
      throw error;
    }
  }

  // Update an existing recipient
  async updateRecipient(id, data) {
    try {
      return dataService.updateRecipient(id, data);
    } catch (error) {
      console.error("Error updating recipient:", error);
      throw error;
    }
  }

  // Delete a recipient
  async deleteRecipient(id) {
    try {
      return dataService.deleteRecipient(id);
    } catch (error) {
      console.error("Error deleting recipient:", error);
      throw error;
    }
  }

  // Import recipients from CSV
  async importRecipientsFromCSV(csvData) {
    try {
      const recipientsToAdd = csvData.map((row) => ({
        name: row.name,
        category: row.category,
        regionId: row.regionId,
        address: row.address,
        country: row.country || "",
      }));

      return dataService.importRecipients(recipientsToAdd);
    } catch (error) {
      console.error("Error importing recipients:", error);
      throw error;
    }
  }
}

export const recipientService = new RecipientService();
