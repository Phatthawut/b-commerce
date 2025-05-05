<template>
  <div>
    <h1>Search Recipients</h1>
    <div class="search-container">
      <div class="search-panel">
        <div class="filter-section">
          <h3>Filter Options</h3>
          <div class="form-group">
            <label for="category">Category:</label>
            <select
              id="category"
              v-model="filters.category"
              class="form-control"
            >
              <option value="">All Categories</option>
              <option value="charity">Charity</option>
              <option value="education">Education</option>
              <option value="health">Health</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="region">Region:</label>
            <select id="region" v-model="filters.regionId" class="form-control">
              <option value="">All Regions</option>
              <option
                v-for="region in regions"
                :key="region.id"
                :value="region.id"
              >
                {{ region.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="country">Country:</label>
            <select id="country" v-model="filters.country" class="form-control">
              <option value="">All Countries</option>
              <option
                v-for="country in countries"
                :key="country"
                :value="country"
              >
                {{ country }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="search">Search:</label>
            <input
              id="search"
              v-model="filters.searchTerm"
              type="text"
              placeholder="Search by name or address"
              class="form-control"
            />
          </div>

          <button @click="applyFilters" class="btn btn-primary">
            Apply Filters
          </button>
          <button @click="resetFilters" class="btn btn-secondary">Reset</button>
        </div>
      </div>

      <div class="results-panel">
        <div class="results-header">
          <h3>Results ({{ filteredRecipients.length }})</h3>
          <div
            class="pagination-controls"
            v-if="filteredRecipients.length > pageSize"
          >
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button
              :disabled="currentPage === 1"
              @click="prevPage"
              class="btn-page"
            >
              Previous
            </button>
            <button
              :disabled="currentPage === totalPages"
              @click="nextPage"
              class="btn-page"
            >
              Next
            </button>
          </div>
        </div>

        <div v-if="loading" class="loading">
          <p>Loading recipients...</p>
        </div>
        <div v-else-if="filteredRecipients.length === 0" class="no-results">
          No recipients found matching your criteria.
        </div>
        <div v-else class="recipient-list">
          <RecipientCard
            v-for="recipient in paginatedRecipients"
            :key="recipient.id"
            :recipient="recipient"
            :region="getRegionById(recipient.regionId)"
            @view="viewRecipient"
          />
        </div>

        <div
          class="pagination-controls bottom"
          v-if="filteredRecipients.length > pageSize"
        >
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            :disabled="currentPage === 1"
            @click="prevPage"
            class="btn-page"
          >
            Previous
          </button>
          <button
            :disabled="currentPage === totalPages"
            @click="nextPage"
            class="btn-page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dataService } from "@/services/dataService";
import RecipientCard from "@/components/RecipientCard.vue";

export default {
  components: {
    RecipientCard,
  },
  data() {
    return {
      regions: [],
      allRecipients: [],
      filteredRecipients: [],
      countries: [],
      loading: true,
      filters: {
        category: "",
        regionId: "",
        country: "",
        searchTerm: "",
      },
      pageSize: 12,
      currentPage: 1,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredRecipients.length / this.pageSize);
    },
    paginatedRecipients() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredRecipients.slice(start, end);
    },
  },
  async created() {
    this.regions = dataService.getRegions();
    this.loading = true;

    try {
      // Get a list of unique countries from all recipients for the dropdown
      const allRecipients = dataService.getRecipients();
      const countrySet = new Set(
        allRecipients.map((r) => r.country).filter(Boolean)
      );
      this.countries = Array.from(countrySet).sort();

      // Apply initial filters
      this.applyFilters();
    } catch (error) {
      console.error("Error loading recipients:", error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    applyFilters() {
      this.loading = true;
      this.currentPage = 1; // Reset to first page when filters change

      try {
        // Use the new optimized filtering function from dataService
        this.filteredRecipients = dataService.getFilteredRecipients(
          this.filters
        );
      } catch (error) {
        console.error("Error applying filters:", error);
        this.filteredRecipients = [];
      } finally {
        this.loading = false;
      }
    },
    resetFilters() {
      this.filters = {
        category: "",
        regionId: "",
        country: "",
        searchTerm: "",
      };
      this.applyFilters();
    },
    getRegionById(regionId) {
      return (
        this.regions.find((r) => r.id === regionId) || {
          name: "Unknown Region",
        }
      );
    },
    viewRecipient(recipient) {
      this.$router.push({
        name: "recipient-detail",
        params: { id: recipient.id },
      });
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        // Scroll to top of results
        this.$el.querySelector(".results-panel").scrollIntoView({
          behavior: "smooth",
        });
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        // Scroll to top of results
        this.$el.querySelector(".results-panel").scrollIntoView({
          behavior: "smooth",
        });
      }
    },
  },
};
</script>

<style>
.search-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.search-panel {
  flex: 1;
  max-width: 300px;
}

.results-panel {
  flex: 3;
}

.filter-section {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  padding: 8px 15px;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.recipient-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  color: #007bff;
  font-weight: bold;
}

.no-results {
  text-align: center;
  margin-top: 40px;
  color: #6c757d;
  font-style: italic;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination-controls.bottom {
  margin-top: 20px;
  justify-content: center;
}

.btn-page {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-page:not(:disabled):hover {
  background-color: #e0e0e0;
}
</style>
