<template>
  <div class="shipments-admin text-black">
    <div class="page-header">
      <h1>Manage Shipments</h1>
      <div class="filters">
        <div class="filter-group">
          <label for="status-filter">Status:</label>
          <select
            id="status-filter"
            v-model="statusFilter"
            class="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="search">Search:</label>
          <input
            id="search"
            type="text"
            v-model="searchQuery"
            placeholder="Search by ID or Donation ID"
            class="search-input"
          />
        </div>
        <div class="filter-group">
          <button @click="showNewShipmentModal = true" class="create-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Shipment
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading shipments...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchShipments" class="retry-button">Retry</button>
    </div>

    <div v-else-if="filteredShipments.length === 0" class="no-results">
      <p>No shipments found matching your criteria.</p>
    </div>

    <div v-else class="shipments-table-container">
      <table class="shipments-table">
        <thead>
          <tr>
            <th @click="sortBy('createdAt')" class="sortable">
              Date
              <span v-if="sortField === 'createdAt'" class="sort-indicator">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th @click="sortBy('id')" class="sortable">
              Shipment ID
              <span v-if="sortField === 'id'" class="sort-indicator">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th @click="sortBy('donationId')" class="sortable">
              Donation ID
              <span v-if="sortField === 'donationId'" class="sort-indicator">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th @click="sortBy('status')" class="sortable">
              Status
              <span v-if="sortField === 'status'" class="sort-indicator">
                {{ sortDirection === "asc" ? "↑" : "↓" }}
              </span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="shipment in filteredShipments"
            :key="shipment.id"
            :class="{ 'pending-row': shipment.status === 'pending' }"
          >
            <td>{{ formatDate(shipment.createdAt) }}</td>
            <td>{{ shipment.id }}</td>
            <td>{{ shipment.donationId }}</td>
            <td>
              <span :class="getStatusColor(shipment.status)">
                {{ formatStatus(shipment.status) }}
              </span>
            </td>
            <td class="actions-cell">
              <button
                @click="viewShipmentDetails(shipment)"
                class="action-button view-button"
              >
                View
              </button>
              <button
                v-if="shipment.status === 'pending'"
                @click="updateStatus(shipment.id, 'processing')"
                class="action-button approve-button"
              >
                Process
              </button>
              <button
                v-if="shipment.status === 'processing'"
                @click="updateStatus(shipment.id, 'shipped')"
                class="action-button approve-button"
              >
                Ship
              </button>
              <button
                v-if="shipment.status === 'shipped'"
                @click="updateStatus(shipment.id, 'delivered')"
                class="action-button approve-button"
              >
                Deliver
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Shipment Details Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Shipment Details</h2>
          <button @click="showModal = false" class="close-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="modal-body" v-if="selectedShipment">
          <div class="shipment-info">
            <div class="info-row">
              <span class="info-label">Shipment ID:</span>
              <span class="info-value">{{ selectedShipment.id }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Donation ID:</span>
              <span class="info-value">{{ selectedShipment.donationId }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span
                class="info-value status-badge"
                :class="selectedShipment.status"
              >
                {{ selectedShipment.status }}
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Created At:</span>
              <span class="info-value">
                {{
                  selectedShipment.createdAt?.toDate
                    ? new Date(
                        selectedShipment.createdAt.toDate()
                      ).toLocaleString()
                    : selectedShipment.createdAt instanceof Date
                    ? selectedShipment.createdAt.toLocaleString()
                    : "N/A"
                }}
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Updated At:</span>
              <span class="info-value">
                {{
                  selectedShipment.updatedAt?.toDate
                    ? new Date(
                        selectedShipment.updatedAt.toDate()
                      ).toLocaleString()
                    : selectedShipment.updatedAt instanceof Date
                    ? selectedShipment.updatedAt.toLocaleString()
                    : "N/A"
                }}
              </span>
            </div>
          </div>

          <!-- Tracking Number Section -->
          <div class="tracking-section">
            <h3>Tracking Information</h3>
            <div v-if="selectedShipment.trackingNumber" class="info-row">
              <span class="info-label">Tracking Number:</span>
              <span class="info-value tracking-number">{{
                selectedShipment.trackingNumber
              }}</span>
            </div>
            <div class="tracking-input-group">
              <input
                type="text"
                v-model="trackingNumber"
                placeholder="Enter tracking number"
                class="tracking-input"
              />
              <button @click="updateTrackingNumber" class="tracking-button">
                {{
                  selectedShipment.trackingNumber
                    ? "Update Tracking Number"
                    : "Add Tracking Number"
                }}
              </button>
            </div>
          </div>

          <!-- Recipient Information Section -->
          <div class="recipient-section">
            <div class="section-header">
              <h3>Recipient Information</h3>
              <div class="flex gap-2">
                <button @click="printShippingLabel" class="print-button">
                  Print Shipping Label
                </button>
                <button
                  @click="toggleAddressEdit"
                  class="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  {{ isEditingAddress ? "Cancel Edit" : "Edit Address" }}
                </button>
              </div>
            </div>

            <!-- Recipient Display -->
            <div v-if="!isEditingAddress">
              <div class="info-row">
                <span class="info-label">Name:</span>
                <span class="info-value">{{
                  selectedShipment.recipientName ||
                  (selectedShipment.recipients &&
                  selectedShipment.recipients.length > 0
                    ? selectedShipment.recipients[0].name ||
                      selectedShipment.recipients[0].recipientName ||
                      selectedShipment.recipients[0].institutionName
                    : "N/A")
                }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Address:</span>
                <span class="info-value">{{
                  selectedShipment.recipientAddress ||
                  (selectedShipment.recipients &&
                  selectedShipment.recipients.length > 0
                    ? selectedShipment.recipients[0].address ||
                      selectedShipment.recipients[0].recipientAddress
                    : "N/A")
                }}</span>
              </div>
            </div>

            <!-- Address Edit Form -->
            <div v-else class="address-edit-form mt-4">
              <!-- Recipient Type Selection -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Type
                </label>
                <select
                  v-model="editedRecipient.category"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  @change="onCategoryChange"
                >
                  <option value="">Select Recipient Type</option>
                  <option value="university">Universities</option>
                  <option value="library">Libraries</option>
                  <option value="religious">Religious Organizations</option>
                  <option value="church">Churches</option>
                  <option value="wat">Wat</option>
                  <option value="culturecenter">Cultural Centers</option>
                  <option value="custom">Custom Recipient</option>
                </select>
              </div>

              <!-- Region Selection -->
              <div
                class="mb-4"
                v-if="
                  editedRecipient.category &&
                  editedRecipient.category !== 'custom'
                "
              >
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <select
                  v-model="editedRecipient.region"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  @change="onRegionChange"
                >
                  <option value="">Select Region</option>
                  <option
                    v-for="region in regions"
                    :key="region.id"
                    :value="region.id"
                  >
                    {{ region.name }}
                  </option>
                </select>
              </div>

              <!-- Country Selection -->
              <div
                class="mb-4"
                v-if="
                  editedRecipient.region &&
                  editedRecipient.category !== 'custom'
                "
              >
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  v-model="editedRecipient.country"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  @change="onCountryChange"
                >
                  <option value="">Select Country</option>
                  <option
                    v-for="country in getCountriesForRegion(
                      editedRecipient.region
                    )"
                    :key="country"
                    :value="country"
                  >
                    {{ country }}
                  </option>
                </select>
              </div>

              <!-- Institution Selection -->
              <div
                class="mb-4 institution-dropdown-container"
                v-if="
                  editedRecipient.country &&
                  editedRecipient.category !== 'custom'
                "
                @click.stop
              >
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Institution
                </label>

                <!-- Show count of available institutions -->
                <div
                  v-if="!editedRecipient.institutionId"
                  class="mb-2 text-sm text-gray-600"
                >
                  {{
                    getFilteredInstitutionsForDropdown(
                      editedRecipient.category,
                      editedRecipient.region,
                      editedRecipient.country,
                      ""
                    ).length
                  }}
                  institutions available in {{ editedRecipient.country }}
                </div>

                <!-- Improved search input for institutions with autocomplete -->
                <div class="mb-2 relative">
                  <input
                    type="text"
                    v-model="editedRecipient.institutionSearch"
                    class="w-full p-3 pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search and select institution..."
                    autocomplete="off"
                    @focus="
                      $event.target.select();
                      showInstitutionsList();
                    "
                    @input="handleInstitutionSearchInput"
                    @blur="handleBlurWithDelay"
                  />
                  <div
                    class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <button
                    v-if="editedRecipient.institutionSearch"
                    @click="clearInstitutionSearch"
                    class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    style="min-height: 44px; min-width: 44px"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <!-- Autocomplete results dropdown -->
                  <div
                    v-if="
                      showDropdown &&
                      getFilteredInstitutionsForDropdown(
                        editedRecipient.category,
                        editedRecipient.region,
                        editedRecipient.country,
                        editedRecipient.institutionSearch || ''
                      ).length > 0
                    "
                    class="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                  >
                    <ul class="py-1">
                      <li
                        v-for="institution in getFilteredInstitutionsForDropdown(
                          editedRecipient.category,
                          editedRecipient.region,
                          editedRecipient.country,
                          editedRecipient.institutionSearch || ''
                        ).slice(0, 250)"
                        :key="institution.id"
                        @click="selectInstitution(institution)"
                        class="px-3 py-2 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div class="font-medium text-gray-900">
                          {{ institution.name }}
                        </div>
                        <div class="text-sm text-gray-600 truncate">
                          {{ institution.address }}
                        </div>
                      </li>
                      <li
                        v-if="
                          getFilteredInstitutionsForDropdown(
                            editedRecipient.category,
                            editedRecipient.region,
                            editedRecipient.country,
                            editedRecipient.institutionSearch || ''
                          ).length > 250
                        "
                        class="px-3 py-2 text-center text-sm text-gray-500 bg-gray-50"
                      >
                        Type more to narrow down results
                      </li>
                    </ul>
                  </div>
                </div>

                <div
                  v-if="editedRecipient.institutionSearch"
                  class="text-sm text-gray-600 mt-1 ml-1"
                >
                  {{
                    getSearchResultsMessage(
                      editedRecipient.category,
                      editedRecipient.region,
                      editedRecipient.country,
                      editedRecipient.institutionSearch
                    )
                  }}
                </div>

                <!-- Selected institution display -->
                <div
                  v-if="editedRecipient.institutionId"
                  class="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-medium text-gray-900">
                        {{ editedRecipient.name }}
                      </h4>
                      <p class="text-sm text-gray-600 mt-1">
                        {{ editedRecipient.address }}
                      </p>
                    </div>
                    <button
                      @click="clearSelectedInstitution"
                      class="text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Custom Recipient Form -->
              <div v-if="editedRecipient.category === 'custom'">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Name
                  </label>
                  <input
                    v-model="editedRecipient.name"
                    type="text"
                    class="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter recipient name"
                  />
                </div>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <textarea
                    v-model="editedRecipient.address"
                    rows="3"
                    class="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter complete address"
                  ></textarea>
                </div>
              </div>

              <div class="flex justify-end gap-2">
                <button
                  @click="cancelAddressEdit"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  @click="saveAddressEdit"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  :disabled="!isAddressValid"
                >
                  Save Changes
                </button>
              </div>
            </div>

            <div v-if="addressHistory.length > 0" class="mt-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">
                Address History
              </h4>
              <div class="space-y-2">
                <div
                  v-for="(history, index) in addressHistory"
                  :key="index"
                  class="text-sm text-gray-600 bg-gray-50 p-2 rounded"
                >
                  <div class="flex justify-between">
                    <span>{{ formatDate(history.timestamp) }}</span>
                    <span class="text-gray-500"
                      >by {{ history.updatedBy }}</span
                    >
                  </div>
                  <div class="mt-1">{{ history.address }}</div>
                </div>
              </div>
            </div>

            <div class="text-sm text-blue-600 mt-4">
              Each shipment contains 1 book set for a single recipient.
            </div>
          </div>

          <!-- Shipment Items Section -->
          <div class="items-section">
            <h3>Shipment Items</h3>
            <div class="items-table">
              <div class="items-header">
                <div class="item-name-header">Item</div>
                <div class="item-quantity-header">Quantity</div>
              </div>
              <div
                v-for="(item, index) in selectedShipment.items"
                :key="index"
                class="item-row"
              >
                <div class="item-name">{{ item.name }}</div>
                <div class="item-quantity">{{ item.quantity }}</div>
              </div>
              <div
                v-if="
                  !selectedShipment.items || selectedShipment.items.length === 0
                "
                class="item-row"
              >
                <div class="item-name">No items in this shipment</div>
                <div class="item-quantity">-</div>
              </div>
            </div>
          </div>

          <!-- Notes Section -->
          <div class="notes-section">
            <h3>Notes</h3>
            <div v-if="selectedShipment.notes" class="shipment-notes">
              {{ selectedShipment.notes }}
            </div>
            <div class="notes-input-group">
              <textarea
                v-model="shipmentNotes"
                placeholder="Add notes about this shipment"
                class="notes-input"
                rows="3"
              ></textarea>
              <button @click="updateShipmentNotes" class="notes-button">
                {{ selectedShipment.notes ? "Update Notes" : "Add Notes" }}
              </button>
            </div>
          </div>

          <!-- Status Update Section -->
          <div class="status-section">
            <h3>Update Status</h3>
            <div class="status-buttons">
              <button
                @click="updateShipmentStatus('processing')"
                class="status-button processing-button"
                :disabled="selectedShipment.status === 'processing'"
              >
                Mark as Processing
              </button>
              <button
                @click="updateShipmentStatus('shipped')"
                class="status-button shipped-button"
                :disabled="selectedShipment.status === 'shipped'"
              >
                Mark as Shipped
              </button>
              <button
                @click="updateShipmentStatus('delivered')"
                class="status-button delivered-button"
                :disabled="selectedShipment.status === 'delivered'"
              >
                Mark as Delivered
              </button>
              <button
                @click="updateShipmentStatus('cancelled')"
                class="status-button cancel-button"
                :disabled="selectedShipment.status === 'cancelled'"
              >
                Cancel Shipment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Shipment Modal -->
    <div
      v-if="showNewShipmentModal"
      class="modal-overlay"
      @click.self="showNewShipmentModal = false"
    >
      <div class="modal-container">
        <div class="modal-header">
          <h2>Create New Shipment</h2>
          <button @click="showNewShipmentModal = false" class="close-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createNewShipment">
            <div class="form-group">
              <label for="donationId">Donation ID</label>
              <input
                id="donationId"
                v-model="newShipment.donationId"
                type="text"
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label for="recipientName">Recipient Name</label>
              <input
                id="recipientName"
                v-model="newShipment.recipientName"
                type="text"
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label for="recipientAddress">Recipient Address</label>
              <textarea
                id="recipientAddress"
                v-model="newShipment.recipientAddress"
                rows="3"
                required
                class="form-input"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="recipientPhone">Recipient Phone</label>
              <input
                id="recipientPhone"
                v-model="newShipment.recipientPhone"
                type="text"
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Items</label>
              <div
                v-for="(item, index) in newShipment.items"
                :key="index"
                class="item-row"
              >
                <input
                  v-model="item.name"
                  type="text"
                  placeholder="Item name"
                  class="form-input item-name"
                />
                <input
                  v-model.number="item.quantity"
                  type="number"
                  min="1"
                  placeholder="Qty"
                  class="form-input item-quantity"
                />
                <button
                  type="button"
                  @click="removeItem(index)"
                  class="remove-item-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
              <button type="button" @click="addItem" class="add-item-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Item
              </button>
            </div>
            <div class="form-actions">
              <button
                type="button"
                @click="showNewShipmentModal = false"
                class="cancel-button"
              >
                Cancel
              </button>
              <button type="submit" class="submit-button">
                Create Shipment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useShipmentStore } from "@/stores/shipmentStore";
import { useAuthStore } from "@/stores/authStore";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/firebase/config";
// Import JSON data
import regionsData from "@/data/regions.json";
import recipientsData from "@/data/recipients.json";

// Initialize the shipment store
const shipmentStore = useShipmentStore();
const authStore = useAuthStore();

// State variables
const showModal = ref(false);
const selectedShipment = ref(null);
const showNewShipmentModal = ref(false);
const selectedRecipientIndex = ref(0);
const loading = ref(false);
const error = ref(null);
const newShipment = ref({
  donationId: "",
  recipientName: "",
  recipientAddress: "",
  recipientPhone: "",
  status: "pending",
  items: [{ name: "", quantity: 1 }],
});

// New state variables for tracking and notes
const trackingNumber = ref("");
const shipmentNotes = ref("");

// Filter and sort state
const statusFilter = ref("all");
const searchQuery = ref("");
const sortField = ref("createdAt");
const sortDirection = ref("desc");

// New state variables for address editing
const isEditingAddress = ref(false);
const editedRecipient = ref({
  name: "",
  address: "",
  phone: "",
  category: "",
  region: "",
  country: "",
  institutionId: "",
  institutionSearch: "",
});
const addressErrors = ref({
  name: "",
  address: "",
  phone: "",
});
const addressHistory = ref([]);

// New state variables for recipient selection
const regions = ref([]);
const showDropdown = ref(false);
const filteredInstitutions = ref([]);
const countryCache = ref({});
const recipientCache = ref({});

// Get regions from recipientStore
const fetchRegions = async () => {
  try {
    regions.value = regionsData;
  } catch (error) {
    console.error("Error loading regions:", error);
  }
};

// Load data into localStorage
const loadDataIntoStorage = () => {
  // Check if data is already in localStorage
  if (!localStorage.getItem("regions")) {
    console.log("Loading regions into localStorage...");
    localStorage.setItem("regions", JSON.stringify(regionsData));
  }

  // Check if recipients data is already in localStorage
  if (!localStorage.getItem("recipients_categories")) {
    console.log("Processing recipients data...");

    // Extract unique categories
    const categories = [...new Set(recipientsData.map((r) => r.category))];
    localStorage.setItem("recipients_categories", JSON.stringify(categories));

    // Store each category separately
    categories.forEach((category) => {
      const categoryRecipients = recipientsData.filter(
        (r) => r.category === category
      );
      localStorage.setItem(
        `recipients_${category}`,
        JSON.stringify(categoryRecipients)
      );
    });

    console.log("All data loaded into localStorage");
  }
};

// Extract unique countries by region from localStorage or JSON data
const extractUniqueCountriesByRegion = () => {
  try {
    // First try to get from localStorage
    const storedRegionCountries = localStorage.getItem("region_countries");

    if (storedRegionCountries) {
      countryCache.value = JSON.parse(storedRegionCountries);
      console.log("Loaded countries from localStorage");
    } else {
      // Fallback to processing from imported recipientsData
      const regionCountries = {};

      // Loop through all recipients from the imported JSON data and collect unique countries by region
      for (const recipient of recipientsData) {
        const regionId = recipient.regionId;
        const country = recipient.country;

        if (!regionId || !country) continue;

        if (!regionCountries[regionId]) {
          regionCountries[regionId] = new Set();
        }

        regionCountries[regionId].add(country);
      }

      // Convert Sets to arrays
      for (const regionId of Object.keys(regionCountries)) {
        countryCache.value[regionId] = Array.from(
          regionCountries[regionId]
        ).sort();
      }

      // Cache in localStorage for future
      localStorage.setItem(
        "region_countries",
        JSON.stringify(countryCache.value)
      );
    }
  } catch (error) {
    console.error("Error extracting countries:", error);
  }
};

// Function to get countries for a region
const getCountriesForRegion = (regionId) => {
  if (!regionId) return [];
  return countryCache.value[regionId] || [];
};

// Update onMounted to include extractUniqueCountriesByRegion
onMounted(() => {
  loadDataIntoStorage();
  fetchRegions();
  extractUniqueCountriesByRegion();
  fetchShipments();
});

// Handle category change
const onCategoryChange = () => {
  editedRecipient.value.region = "";
  editedRecipient.value.country = "";
  editedRecipient.value.institutionId = "";
  editedRecipient.value.institutionSearch = "";
  showDropdown.value = false;
};

// Handle country change
const onCountryChange = () => {
  editedRecipient.value.institutionId = "";
  editedRecipient.value.institutionSearch = "";
  showDropdown.value = false;
};

// Update onRegionChange to use the new country handling
const onRegionChange = async () => {
  editedRecipient.value.country = "";
  editedRecipient.value.institutionId = "";
  editedRecipient.value.institutionSearch = "";
  showDropdown.value = false;
};

// Show institutions list
const showInstitutionsList = () => {
  showDropdown.value = true;
  // Pre-populate the search if not already done
  if (!editedRecipient.value.institutionSearch) {
    editedRecipient.value.institutionSearch = "";
  }
};

// Handle institution search input
const handleInstitutionSearchInput = async () => {
  showDropdown.value = true;
  // The filtering is now handled by getFilteredInstitutionsForDropdown
};

// Select institution
const selectInstitution = (institution) => {
  editedRecipient.value.institutionId = institution.id;
  editedRecipient.value.name = institution.name;
  editedRecipient.value.address = institution.address;
  editedRecipient.value.institutionSearch = "";
  showDropdown.value = false;

  // Update the selected shipment immediately to reflect changes in the UI
  selectedShipment.value = {
    ...selectedShipment.value,
    recipientName: institution.name,
    recipientAddress: institution.address,
  };

  console.log("Selected institution:", institution);
};

// Clear selected institution
const clearSelectedInstitution = () => {
  editedRecipient.value.institutionId = "";
  editedRecipient.value.name = "";
  editedRecipient.value.address = "";
  editedRecipient.value.institutionSearch = "";

  // Also clear the selected shipment's recipient info
  selectedShipment.value = {
    ...selectedShipment.value,
    recipientName: "",
    recipientAddress: "",
  };
};

// Function to get filtered institutions for dropdown
const getFilteredInstitutionsForDropdown = (
  category,
  regionId,
  country,
  searchTerm
) => {
  if (!category || !regionId || !country) return [];

  try {
    // First try to get from localStorage
    const categoryKey = `recipients_${category}`;
    const storedCategoryData = localStorage.getItem(categoryKey);

    let institutions = [];
    if (storedCategoryData) {
      const categoryRecipients = JSON.parse(storedCategoryData);
      institutions = categoryRecipients.filter(
        (r) => r.regionId === regionId && r.country === country
      );
    } else {
      // Fallback to the imported data (recipientsData should be available)
      institutions = recipientsData.filter(
        (recipient) =>
          recipient.category === category &&
          recipient.regionId === regionId &&
          recipient.country === country
      );
    }

    // If search term is provided, filter by name
    if (searchTerm && searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      institutions = institutions.filter((institution) =>
        institution.name.toLowerCase().includes(search)
      );
    }

    return institutions.map((r) => ({
      id: r.id || r.name, // Fallback to name if id is not available
      name: r.name,
      address: r.address,
      category: r.category,
      region: r.regionId,
      country: r.country,
    }));
  } catch (error) {
    console.error("Error getting filtered institutions:", error);
    return [];
  }
};

// Function to get search results message
const getSearchResultsMessage = (category, regionId, country, searchTerm) => {
  if (!searchTerm) return "";

  const results = getFilteredInstitutionsForDropdown(
    category,
    regionId,
    country,
    searchTerm
  );
  if (results.length === 0) {
    return "No matching institutions found";
  } else if (results.length === 1) {
    return "1 institution found";
  } else {
    return `${results.length} institutions found`;
  }
};

// Function to clear institution search
const clearInstitutionSearch = () => {
  editedRecipient.value.institutionSearch = "";
  showDropdown.value = false;
};

// Function to handle blur with delay
const handleBlurWithDelay = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

// Update isAddressValid computed property
const isAddressValid = computed(() => {
  if (editedRecipient.value.category === "custom") {
    return (
      editedRecipient.value.name.trim() &&
      editedRecipient.value.address.trim() &&
      editedRecipient.value.phone.trim() &&
      !addressErrors.value.name &&
      !addressErrors.value.address &&
      !addressErrors.value.phone
    );
  } else {
    return (
      editedRecipient.value.institutionId &&
      editedRecipient.value.name &&
      editedRecipient.value.address
    );
  }
});

// Save address changes
const saveAddressEdit = async () => {
  try {
    let recipientData;

    if (editedRecipient.value.category === "custom") {
      // For custom recipients
      recipientData = {
        recipientName: editedRecipient.value.name.trim(),
        recipientAddress: editedRecipient.value.address.trim(),
      };
    } else {
      // For institution recipients
      recipientData = {
        recipientName: editedRecipient.value.name,
        recipientAddress: editedRecipient.value.address,
        recipientCategory: editedRecipient.value.category,
        recipientRegion: editedRecipient.value.region,
        recipientCountry: editedRecipient.value.country,
        recipientId: editedRecipient.value.institutionId,
      };
    }

    // Add to address history
    const historyEntry = {
      timestamp: new Date(),
      address: recipientData.recipientAddress,
      updatedBy: authStore.adminFirstName,
      previousAddress: selectedShipment.value.recipientAddress,
    };

    // Update the shipment in Firestore
    const shipmentRef = doc(db, "shipments", selectedShipment.value.id);
    await updateDoc(shipmentRef, {
      ...recipientData,
      addressHistory: arrayUnion(historyEntry),
    });

    // Update local state
    selectedShipment.value = {
      ...selectedShipment.value,
      ...recipientData,
    };

    if (!selectedShipment.value.addressHistory) {
      selectedShipment.value.addressHistory = [];
    }
    selectedShipment.value.addressHistory.push(historyEntry);
    addressHistory.value = selectedShipment.value.addressHistory;

    // Close edit mode
    isEditingAddress.value = false;
    alert("Address updated successfully");

    // Refresh the shipments list to reflect the changes
    fetchShipments();
  } catch (error) {
    console.error("Error updating address:", error);
    alert(`Error updating address: ${error.message}`);
  }
};

// View shipment details
const viewShipmentDetails = async (shipment) => {
  console.log("Viewing shipment details:", shipment);

  // Reset the selected recipient index
  selectedRecipientIndex.value = 0;

  try {
    // Fetch the latest data from Firestore
    const shipmentRef = doc(db, "shipments", shipment.id);
    const shipmentDoc = await getDoc(shipmentRef);

    if (shipmentDoc.exists()) {
      const shipmentData = {
        id: shipmentDoc.id,
        ...shipmentDoc.data(),
      };

      console.log("Fetched shipment data:", shipmentData);

      // Update the selected shipment with the latest data
      selectedShipment.value = shipmentData;

      // Initialize tracking number and notes
      trackingNumber.value = shipmentData.trackingNumber || "";
      shipmentNotes.value = shipmentData.notes || "";

      // Reset address editing state
      isEditingAddress.value = false;
      addressErrors.value = { name: "", address: "" };

      // Load address history
      addressHistory.value = shipmentData.addressHistory || [];

      // Show the modal
      showModal.value = true;
    } else {
      console.error("Shipment not found");
      alert("Error: Shipment not found");
    }
  } catch (err) {
    console.error("Error fetching shipment details:", err);
    alert(`Error loading shipment details: ${err.message}`);
  }
};

// Sort shipments
const sortBy = (field) => {
  if (sortField.value === field) {
    // Toggle direction if clicking the same field
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    // Default to descending for date, ascending for everything else
    sortField.value = field;
    sortDirection.value = field === "createdAt" ? "desc" : "asc";
  }
};

// Update shipment status
const updateShipmentStatus = async (status) => {
  if (!selectedShipment.value) return;

  const success = await shipmentStore.updateShipment(
    selectedShipment.value.id,
    { status }
  );

  if (success) {
    // Update the selected shipment in the UI
    selectedShipment.value.status = status;

    // If the status is "shipped" and there's a tracking number, notify the donor
    if (status === "shipped" && selectedShipment.value.trackingNumber) {
      notifyDonorAboutShipment(selectedShipment.value);
    }

    alert(`Shipment status updated to ${status}`);
  } else {
    alert("Failed to update shipment status. Please try again.");
  }
};

// Filter shipments based on current filters
const filteredShipments = computed(() => {
  let result = [...shipmentStore.shipments];

  // Apply status filter
  if (statusFilter.value !== "all") {
    result = result.filter((s) => s.status === statusFilter.value);
  }

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(
      (s) =>
        (s.id && s.id.toLowerCase().includes(query)) ||
        (s.donationId && s.donationId.toLowerCase().includes(query))
    );
  }

  // Apply sorting
  result.sort((a, b) => {
    let aValue = a[sortField.value];
    let bValue = b[sortField.value];

    // Handle timestamps
    if (sortField.value === "createdAt" || sortField.value === "updatedAt") {
      aValue = aValue?.seconds
        ? aValue.seconds
        : new Date(aValue).getTime() / 1000;
      bValue = bValue?.seconds
        ? bValue.seconds
        : new Date(bValue).getTime() / 1000;
    }

    // Handle null/undefined values
    if (aValue === undefined || aValue === null)
      return sortDirection.value === "asc" ? -1 : 1;
    if (bValue === undefined || bValue === null)
      return sortDirection.value === "asc" ? 1 : -1;

    // Compare values
    if (typeof aValue === "string") {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection.value === "asc" ? comparison : -comparison;
    } else {
      return sortDirection.value === "asc" ? aValue - bValue : bValue - aValue;
    }
  });

  return result;
});

// Use the store's formatters
const formatDate = shipmentStore.formatDate;
const formatStatus = shipmentStore.formatStatus;
const getStatusColor = shipmentStore.getStatusColor;

// Fetch shipments
const fetchShipments = async () => {
  loading.value = true;
  error.value = null;

  try {
    await shipmentStore.fetchShipments();
  } catch (err) {
    console.error("Error fetching shipments:", err);
    error.value = "Failed to load shipments. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Add item to new shipment
const addItem = () => {
  newShipment.value.items.push({ name: "", quantity: 1 });
};

// Remove item from new shipment
const removeItem = (index) => {
  newShipment.value.items.splice(index, 1);
  // Ensure there's always at least one item
  if (newShipment.value.items.length === 0) {
    addItem();
  }
};

// Create new shipment
const createNewShipment = async () => {
  try {
    // Validate form
    if (
      !newShipment.value.donationId ||
      !newShipment.value.recipientName ||
      !newShipment.value.recipientAddress ||
      !newShipment.value.recipientPhone
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate items
    const validItems = newShipment.value.items.filter(
      (item) => item.name.trim() !== "" && item.quantity > 0
    );
    if (validItems.length === 0) {
      alert("Please add at least one valid item");
      return;
    }

    // Update items to only include valid ones
    newShipment.value.items = validItems;

    // Create shipment
    const shipmentId = await shipmentStore.createShipment(newShipment.value);

    if (shipmentId) {
      alert(`Shipment created successfully with ID: ${shipmentId}`);
      showNewShipmentModal.value = false;

      // Reset form
      newShipment.value = {
        donationId: "",
        recipientName: "",
        recipientAddress: "",
        recipientPhone: "",
        status: "pending",
        items: [{ name: "", quantity: 1 }],
      };

      // Refresh shipments list
      fetchShipments();
    } else {
      alert("Failed to create shipment. Please try again.");
    }
  } catch (err) {
    console.error("Error creating shipment:", err);
    alert(`Error: ${err.message}`);
  }
};

// Update tracking number
const updateTrackingNumber = async () => {
  if (!trackingNumber.value.trim()) {
    alert("Please enter a valid tracking number");
    return;
  }

  const success = await shipmentStore.updateShipment(
    selectedShipment.value.id,
    { trackingNumber: trackingNumber.value.trim() }
  );

  if (success) {
    // Update the selected shipment in the UI
    selectedShipment.value.trackingNumber = trackingNumber.value.trim();

    // Clear the input
    trackingNumber.value = "";

    alert("Tracking number updated successfully");

    // Notify the donor if the shipment is in shipped status
    if (selectedShipment.value.status === "shipped") {
      notifyDonorAboutShipment(selectedShipment.value);
    }
  } else {
    alert("Failed to update tracking number. Please try again.");
  }
};

// Update shipment notes
const updateShipmentNotes = async () => {
  if (!shipmentNotes.value.trim()) {
    alert("Please enter valid notes");
    return;
  }

  const success = await shipmentStore.updateShipment(
    selectedShipment.value.id,
    { notes: shipmentNotes.value.trim() }
  );

  if (success) {
    // Update the selected shipment in the UI
    selectedShipment.value.notes = shipmentNotes.value.trim();

    // Clear the input
    shipmentNotes.value = "";

    alert("Notes updated successfully");
  } else {
    alert("Failed to update notes. Please try again.");
  }
};

// Print shipping label
const printShippingLabel = () => {
  if (!selectedShipment.value) return;

  // Get recipient information from the shipment
  const recipientName =
    selectedShipment.value.recipientName ||
    (selectedShipment.value.recipients &&
    selectedShipment.value.recipients.length > 0
      ? selectedShipment.value.recipients[0].recipientName ||
        selectedShipment.value.recipients[0].institutionName
      : "N/A");

  const recipientAddress =
    selectedShipment.value.recipientAddress ||
    (selectedShipment.value.recipients &&
    selectedShipment.value.recipients.length > 0
      ? selectedShipment.value.recipients[0].address ||
        selectedShipment.value.recipients[0].recipientAddress
      : "No address provided");

  const recipientPhone =
    selectedShipment.value.recipientPhone ||
    (selectedShipment.value.recipients &&
    selectedShipment.value.recipients.length > 0
      ? selectedShipment.value.recipients[0].phone ||
        selectedShipment.value.recipients[0].recipientPhone
      : "N/A");

  // Create a new window for printing
  const printWindow = window.open("", "_blank");

  // Generate items HTML - always 1 book set
  const itemsHTML = `
    <div class="section">
      <div class="section-title">ITEMS:</div>
      <table class="items-table">
        <tr>
          <th>Item</th>
          <th>Quantity</th>
        </tr>
        <tr>
          <td>Book Donation</td>
          <td>1</td>
        </tr>
      </table>
    </div>
  `;

  // Generate the shipping label HTML
  const labelHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Shipping Label - ${selectedShipment.value.id}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
        }
        .shipping-label {
          border: 2px solid #000;
          padding: 20px;
          max-width: 400px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #000;
          padding-bottom: 10px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
        }
        .section {
          margin-bottom: 15px;
        }
        .section-title {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .address {
          white-space: pre-line;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          text-align: center;
        }
        .barcode {
          text-align: center;
          margin: 15px 0;
          font-family: monospace;
          font-size: 14px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 5px;
        }
        .items-table th, .items-table td {
          border: 1px solid #ddd;
          padding: 4px;
          text-align: left;
        }
        .items-table th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="text-align: center; margin-bottom: 20px;">
        <button onclick="window.print()">Print Label</button>
        <button onclick="window.close()">Close</button>
      </div>
      
      <div class="shipping-label">
        <div class="header">
          <div class="logo">Woody Prieb Knowledge Square</div>
          <div>Shipping Label</div>
        </div>
        
        <div class="section">
          <div class="section-title">SHIP TO:</div>
          <div class="address">
            <strong>${recipientName}</strong>
            ${recipientAddress}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">SHIPMENT DETAILS:</div>
          <div>Shipment ID: ${selectedShipment.value.id}</div>
          <div>Donation ID: ${selectedShipment.value.donationId}</div>
          ${
            selectedShipment.value.trackingNumber
              ? `<div>Tracking #: ${selectedShipment.value.trackingNumber}</div>`
              : ""
          }
        </div>
        
        ${itemsHTML}
        
        <div class="barcode">
          *${selectedShipment.value.id}*
        </div>
        
        <div class="footer">
          Thank you for your donation to Woody Prieb Knowledge Square!
        </div>
      </div>
    </body>
    </html>
  `;

  // Write the HTML to the new window and print
  printWindow.document.write(labelHTML);
  printWindow.document.close();
};

// Notify donor about shipment (placeholder function)
const notifyDonorAboutShipment = async (shipment) => {
  // In a real application, this would send an email or SMS to the donor
  console.log(
    `Notifying donor about shipment ${shipment.id} with tracking number ${shipment.trackingNumber}`
  );

  // For now, we'll just show a message
  alert(
    `A notification would be sent to the donor with tracking number: ${shipment.trackingNumber}`
  );

  // In a real implementation, you would:
  // 1. Get the donor information from the donation
  // 2. Send an email or SMS with the tracking information
  // 3. Update the shipment with a notification sent flag
};

// Toggle address edit mode
const toggleAddressEdit = () => {
  if (!isEditingAddress.value) {
    // Start editing - populate form with current values
    editedRecipient.value = {
      name: selectedShipment.value?.recipientName || "",
      address: selectedShipment.value?.recipientAddress || "",
      category: selectedShipment.value?.recipientCategory || "",
      region: selectedShipment.value?.recipientRegion || "",
      country: selectedShipment.value?.recipientCountry || "",
      institutionId: selectedShipment.value?.recipientId || "",
      institutionSearch: "",
    };
  }
  isEditingAddress.value = !isEditingAddress.value;
  addressErrors.value = { name: "", address: "" };
  showDropdown.value = false;
};

// Cancel address edit
const cancelAddressEdit = () => {
  isEditingAddress.value = false;
  addressErrors.value = { name: "", address: "" };
};

// Validate address fields
const validateAddress = () => {
  const errors = {
    name: "",
    address: "",
    phone: "",
  };

  if (!editedRecipient.value.name.trim()) {
    errors.name = "Recipient name is required";
  }

  if (!editedRecipient.value.address.trim()) {
    errors.address = "Address is required";
  } else if (editedRecipient.value.address.trim().length < 10) {
    errors.address = "Please enter a complete address";
  }

  if (!editedRecipient.value.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^\+?[\d\s-]{10,}$/.test(editedRecipient.value.phone.trim())) {
    errors.phone = "Please enter a valid phone number";
  }

  addressErrors.value = errors;
  return !errors.name && !errors.address && !errors.phone;
};

// Update selected recipient
const updateSelectedRecipient = () => {
  if (!selectedShipment.value?.recipients) return;

  const recipient =
    selectedShipment.value.recipients[selectedRecipientIndex.value];
  if (recipient) {
    // Update the recipient information in the UI
    selectedShipment.value.recipientName =
      recipient.recipientName || recipient.institutionName || "";
    selectedShipment.value.recipientAddress =
      recipient.address || recipient.recipientAddress || "";
    selectedShipment.value.recipientPhone =
      recipient.phone || recipient.recipientPhone || "";

    console.log(`Updated to recipient ${selectedRecipientIndex.value + 1}:`, {
      name: selectedShipment.value.recipientName,
      address: selectedShipment.value.recipientAddress,
      phone: selectedShipment.value.recipientPhone,
    });
  }
};
</script>

<style scoped>
.shipments-admin {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  color: #4b5563;
}

.filter-select,
.search-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background-color: white;
}

.search-input {
  min-width: 250px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #4caf50;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  text-align: center;
  color: #dc3545;
  padding: 2rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 0.25rem;
  margin: 1rem 0;
}

.error-message p {
  margin-bottom: 1rem;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  cursor: pointer;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  background-color: #f8f9fa;
  border-radius: 0.25rem;
}

.shipments-table-container {
  overflow-x: auto;
}

.shipments-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
}

.shipments-table th,
.shipments-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.shipments-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sort-indicator {
  margin-left: 0.25rem;
}

.pending-row {
  background-color: #fff8e1;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.view-button {
  background-color: #e9ecef;
  color: #495057;
}

.approve-button {
  background-color: #d4edda;
  color: #155724;
}

.reject-button {
  background-color: #f8d7da;
  color: #721c24;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
}

.modal-body {
  padding: 1.5rem;
}

.shipment-info {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.shipment-info:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.info-row {
  display: flex;
  margin-bottom: 0.5rem;
}

.info-label {
  flex: 0 0 120px;
  font-weight: 500;
  color: #6c757d;
}

.info-value {
  flex: 1;
  color: #2c3e50;
}

.tracking-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #e9ecef;
}

.tracking-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tracking-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  width: 100%;
}

.tracking-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #4b5563;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.tracking-button:hover {
  background-color: #374151;
}

.recipient-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed #e9ecef;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.print-button {
  background-color: #6366f1;
}

.print-button:hover {
  background-color: #4f46e5;
}

.tracking-number {
  font-weight: 600;
  color: #4f46e5;
}

.items-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed #e9ecef;
}

.items-table {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  overflow: hidden;
}

.items-header {
  display: flex;
  background-color: #f9fafb;
  padding: 0.75rem 1rem;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
}

.item-row {
  display: flex;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.item-row:last-child {
  border-bottom: none;
}

.item-name-header,
.item-name {
  flex: 1;
}

.item-quantity-header,
.item-quantity {
  width: 100px;
  text-align: center;
}

.notes-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed #e9ecef;
}

.notes-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.notes-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  width: 100%;
}

.notes-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #4b5563;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notes-button:hover {
  background-color: #374151;
}

.status-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed #e9ecef;
}

.status-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.status-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.processing-button {
  background-color: #60a5fa;
  color: white;
}

.processing-button:hover {
  background-color: #3b82f6;
}

.shipped-button {
  background-color: #a78bfa;
  color: white;
}

.shipped-button:hover {
  background-color: #8b5cf6;
}

.delivered-button {
  background-color: #34d399;
  color: white;
}

.delivered-button:hover {
  background-color: #10b981;
}

.cancel-button {
  background-color: #f87171;
  color: white;
}

.cancel-button:hover {
  background-color: #ef4444;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-select,
  .search-input {
    width: 100%;
  }

  .info-row {
    flex-direction: column;
  }

  .info-label {
    margin-bottom: 0.25rem;
  }

  .modal-actions {
    flex-direction: column;
  }
}

.filter-section {
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

@media (max-width: 640px) {
  .tracking-input-group,
  .notes-input-group {
    flex-direction: column;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .status-buttons {
    flex-direction: column;
  }
}

/* Institution dropdown styling */
.institution-dropdown-container {
  position: relative;
}

.institution-dropdown-container .relative {
  position: relative;
}

/* Improved dropdown styling */
.institution-dropdown-container .absolute.z-50 {
  position: absolute;
  z-index: 50;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Search input styling */
.institution-dropdown-container input {
  transition: border-color 0.2s, box-shadow 0.2s;
}

.institution-dropdown-container input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Dropdown items styling */
.institution-dropdown-container ul li {
  transition: background-color 0.15s ease-in-out;
}

.institution-dropdown-container ul li:hover {
  background-color: #eff6ff;
}

/* Selected institution display */
.institution-dropdown-container .bg-blue-50 {
  background-color: #eff6ff;
  border-color: #93c5fd;
}

/* Clear button styling */
.institution-dropdown-container button[style*="min-height"] {
  transition: color 0.15s ease-in-out;
}

.institution-dropdown-container button[style*="min-height"]:hover {
  color: #374151;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .institution-dropdown-container .absolute.z-50 {
    left: 0;
    right: 0;
    width: 100%;
  }
}

.recipient-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background-color: white;
  width: 100%;
  max-width: 300px;
  font-size: 0.875rem;
}

.text-sm {
  font-size: 0.875rem;
}

.text-blue-600 {
  color: #2563eb;
}

.mt-1 {
  margin-top: 0.25rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}

.bg-gray-500 {
  background-color: #6b7280;
}

.text-white {
  color: white;
}

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.rounded {
  border-radius: 0.25rem;
}

.text-xs {
  font-size: 0.75rem;
}
</style>
