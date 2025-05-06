<template>
  <section class="bg-white">
    <div
      class="container grid grid-cols-1 mx-auto md:p-8 font-thai text-gray-700"
    >
      <h1 class="text-4xl font-bold text-black text-center">Donor Form</h1>
      <div class="divider divider-info w-1/2 mx-auto"></div>

      <!-- Loading indicator when checking for pending donations -->
      <div v-if="checkingPendingDonations" class="text-center mb-4">
        <div
          class="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"
        ></div>
        Checking for previous donations...
      </div>

      <div class="grid grid-cols-1 gradient-background-donate py-4 md:p-12">
        <div class="text-background-blue p-2 md:p-6 md:w-[80%] mx-auto">
          <form class="px-2 md:px-8 pt-6 pb-8">
            <div class="flex items-center mb-4">
              <label for="name" class="w-1/4">Name:</label>
              <input
                class="w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
                id="name"
                type="text"
                placeholder="Donor Name"
                v-model="formData.name"
              />
            </div>

            <div class="flex items-center mb-4">
              <label class="w-1/4" for="address">Address:</label>
              <input
                class="w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
                id="address"
                type="text"
                placeholder="Donor Address (Optional)"
                v-model="formData.address"
              />
            </div>

            <div class="flex items-center mb-4">
              <label class="w-1/4" for="telephone">Telephone:</label>
              <input
                class="w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
                id="telephone"
                type="text"
                placeholder="Telephone"
                v-model="formData.telephone"
                aria-label="Telephone"
              />
            </div>

            <div class="flex items-center mb-4">
              <label class="w-1/4" for="email">Email:</label>
              <input
                class="w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
                id="email"
                type="email"
                placeholder="Email (Require)"
                v-model="formData.email"
                required
              />
            </div>

            <div class="flex items-center mb-4">
              <label class="w-1/4" for="quantity">Amount:</label>
              <input
                class="w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
                id="quantity"
                type="number"
                min="1"
                placeholder="Amount"
                v-model="formData.quantity"
                @input="onQuantityChange"
                aria-label="Quantity"
              />
            </div>
            <p class="text-sm text-gray-600 mb-4 ml-4">
              You can select
              <span v-text="formData.quantity || 0"></span> different
              recipients.
            </p>

            <div class="mb-4">
              <label class="sr-only" for="total"> Total </label>
              <input
                class="w-full py-4 px-3 bg-gray-100 text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
                id="total"
                type="text"
                placeholder="TOTAL (THB)"
                v-model="formData.total"
                readonly
                aria-label="Total"
              />
            </div>

            <!-- Donation Type Selection -->
            <div class="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 class="font-semibold text-md mb-3">Recipient</h3>
              <p class="sr-only text-sm text-gray-600 mb-4">
                Please specify how you would like to distribute your donation of
                {{ formData.quantity }} sets.
              </p>

              <div class="flex items-center space-x-4 mb-3">
                <input
                  type="checkbox"
                  id="specified-checkbox"
                  v-model="formData.isSpecified"
                  class="w-5 h-5 text-blue-600"
                />
                <label for="specified-checkbox" class="font-medium"
                  >Specified</label
                >
                <input
                  type="number"
                  min="0"
                  :max="formData.quantity"
                  v-model="formData.specifiedAmount"
                  :disabled="!formData.isSpecified"
                  class="w-20 py-2 px-3 bg-white border border-gray-300 rounded-md"
                />
                <span class="text-gray-700">SETS</span>
              </div>

              <div class="flex items-center space-x-4">
                <input
                  type="checkbox"
                  id="unspecified-checkbox"
                  v-model="formData.isUnspecified"
                  class="w-5 h-5 text-blue-600"
                />
                <label for="unspecified-checkbox" class="font-medium"
                  >Unspecified</label
                >
                <input
                  type="number"
                  min="0"
                  :max="formData.quantity"
                  v-model="formData.unspecifiedAmount"
                  :disabled="!formData.isUnspecified"
                  class="w-20 py-2 px-3 bg-white border border-gray-300 rounded-md"
                />
                <span class="text-gray-700">SETS</span>
              </div>

              <div
                class="mt-3"
                v-if="
                  parseInt(formData.specifiedAmount || 0) +
                    parseInt(formData.unspecifiedAmount || 0) !==
                  parseInt(formData.quantity)
                "
              >
                <p class="text-sm text-red-500">
                  Total sets must equal {{ formData.quantity }}. Currently
                  allocated:
                  {{
                    parseInt(formData.specifiedAmount || 0) +
                    parseInt(formData.unspecifiedAmount || 0)
                  }}
                  sets.
                </p>
              </div>
            </div>

            <!-- Unspecified Donation Categories Selection -->
            <div
              v-if="
                formData.isUnspecified &&
                parseInt(formData.unspecifiedAmount) > 0
              "
              class="mb-6 p-4 bg-blue-50 rounded-lg"
            >
              <h3 class="sr-only font-semibold text-md mb-3">
                Categories for Unspecified Donations
              </h3>
              <p class="sr-only text-sm text-gray-600 mb-3">
                Please select which categories you would like your unspecified
                donations to be distributed to:
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div
                  v-for="(value, category) in unspecifiedCategories"
                  :key="category"
                  class="flex items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    :id="`category-${category}`"
                    v-model="unspecifiedCategories[category].selected"
                    class="w-5 h-5 text-blue-600"
                  />
                  <label
                    :for="`category-${category}`"
                    class="text-gray-700 font-medium flex-1"
                  >
                    {{ categoryNames[category] }}
                  </label>
                  <div
                    v-if="unspecifiedCategories[category].selected"
                    class="flex items-center"
                  >
                    <span class="text-sm text-gray-600 mr-2">Sets:</span>
                    <input
                      type="number"
                      v-model="unspecifiedCategories[category].amount"
                      min="1"
                      :max="formData.unspecifiedAmount"
                      class="w-16 py-1 px-2 bg-white border border-gray-300 rounded-md text-center"
                      @input="validateCategoryAmounts()"
                    />
                  </div>
                </div>
              </div>

              <div
                v-if="
                  !Object.values(unspecifiedCategories).some((v) => v.selected)
                "
                class="mt-2 text-sm text-red-500"
              >
                Please select at least one category for your unspecified
                donations.
              </div>

              <div
                v-if="
                  totalCategoryAmount < parseInt(formData.unspecifiedAmount)
                "
                class="mt-2 text-sm text-amber-600"
              >
                You have allocated {{ totalCategoryAmount }} of
                {{ formData.unspecifiedAmount }} sets. The remaining
                {{ parseInt(formData.unspecifiedAmount) - totalCategoryAmount }}
                sets will be distributed according to your selected categories.
              </div>

              <div
                v-if="
                  totalCategoryAmount > parseInt(formData.unspecifiedAmount)
                "
                class="mt-2 text-sm text-red-500"
              >
                You have allocated too many sets ({{ totalCategoryAmount }} of
                {{ formData.unspecifiedAmount }}). Please reduce your
                allocations to match your unspecified donation amount.
              </div>
            </div>

            <!-- Recipient Selection Section -->
            <div
              v-if="
                formData.isSpecified && parseInt(formData.specifiedAmount) > 0
              "
              class="mt-4"
            >
              <h3 class="font-semibold text-lg mb-3">Specified Recipients</h3>
              <p class="sr-only text-sm text-gray-600 mb-4">
                Please provide details for each of your
                {{ formData.specifiedAmount }} specified recipients.
              </p>

              <div
                v-for="(recipient, index) in recipients"
                :key="index"
                class="mb-8 p-4 bg-gray-50 rounded-lg"
              >
                <h3 class="font-semibold text-lg mb-4">
                  Recipient Details #{{ index + 1 }}
                </h3>

                <!-- Recipient Type Selection - Always visible -->
                <div class="mb-4">
                  <label for="category" class="block mb-2 font-medium"
                    >Recipient Type</label
                  >
                  <select
                    id="category"
                    v-model="recipient.category"
                    @change="onCategoryChange(index)"
                    required
                    class="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                <!-- Custom Recipient Form - Only visible when custom category is selected -->
                <div v-if="recipient.category === 'custom'">
                  <div class="mb-4">
                    <label
                      for="custom-recipient-name"
                      class="block mb-2 font-medium"
                      >Custom Recipient Name</label
                    >
                    <input
                      id="custom-recipient-name"
                      v-model="recipient.institutionName"
                      type="text"
                      required
                      class="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter recipient name"
                    />
                  </div>

                  <div class="mb-4">
                    <label for="custom-region" class="block mb-2 font-medium"
                      >Region</label
                    >
                    <select
                      id="custom-region"
                      v-model="recipient.region"
                      required
                      class="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                  <div class="mb-4">
                    <label for="custom-country" class="block mb-2 font-medium"
                      >Country</label
                    >
                    <input
                      id="custom-country"
                      v-model="recipient.country"
                      type="text"
                      required
                      class="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter country"
                    />
                  </div>

                  <div class="mb-4">
                    <label for="custom-address" class="block mb-2 font-medium"
                      >Address</label
                    >
                    <textarea
                      id="custom-address"
                      v-model="recipient.address"
                      required
                      class="w-full p-3 bg-white border border-gray-300 rounded-md min-h-[80px] resize-y"
                      placeholder="Enter complete address"
                    ></textarea>
                  </div>
                </div>

                <!-- Admin Selection Message - Only visible when admin-select is chosen -->
                <div
                  v-if="recipient.category === 'admin-select'"
                  class="mb-4 p-4 bg-blue-50 rounded-md"
                >
                  <p class="text-blue-700">
                    <span class="font-medium">Note:</span> Our team will select
                    an appropriate recipient for your donation. If you have any
                    preferences or requests, please mention them below.
                  </p>
                  <div class="mt-4">
                    <label
                      for="admin-select-notes"
                      class="block mb-2 font-medium"
                      >Notes for Selection (Optional)</label
                    >
                    <textarea
                      id="admin-select-notes"
                      v-model="recipient.adminNotes"
                      class="w-full p-3 bg-white border border-gray-300 rounded-md min-h-[80px] resize-y"
                      placeholder="Any preferences for your donation? (e.g., 'Please select a school in rural areas')"
                    ></textarea>
                  </div>
                </div>

                <!-- Region Selection - Only visible after category is selected and not for admin-select -->
                <div
                  class="mb-4"
                  v-if="
                    recipient.category &&
                    recipient.category !== 'custom' &&
                    recipient.category !== 'admin-select'
                  "
                >
                  <label for="region" class="block mb-2 font-medium"
                    >Region</label
                  >
                  <select
                    id="region"
                    v-model="recipient.region"
                    @change="onRegionChange(index)"
                    required
                    class="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <div
                    v-if="loadingRegions"
                    class="mt-2 text-sm text-gray-600 flex items-center"
                  >
                    <div
                      class="mr-2 h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"
                    ></div>
                    Loading...
                  </div>
                </div>

                <!-- Country Selection - Only visible after region is selected -->
                <div class="mb-4" v-if="recipient.region">
                  <label for="country" class="block mb-2 font-medium"
                    >Country</label
                  >
                  <select
                    id="country"
                    v-model="recipient.country"
                    @change="onCountryChange(index)"
                    required
                    class="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Country</option>
                    <option
                      v-for="country in getCountriesForRegion(recipient.region)"
                      :key="country"
                      :value="country"
                    >
                      {{ country }}
                    </option>
                  </select>
                  <div
                    v-if="loadingCountries"
                    class="mt-2 text-sm text-gray-600 flex items-center"
                  >
                    <div
                      class="mr-2 h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"
                    ></div>
                    Loading...
                  </div>
                </div>

                <!-- Institution Selection - Only visible after country is selected -->
                <div
                  class="mb-4 institution-dropdown-container"
                  v-if="recipient.country"
                  @click.stop
                >
                  <label for="institution" class="block mb-2 font-medium"
                    >Institution</label
                  >

                  <!-- Show count of available institutions -->
                  <div
                    v-if="!recipient.institutionId"
                    class="mb-2 text-sm text-gray-600"
                  >
                    {{
                      displayInstitutions(
                        recipient.category,
                        recipient.region,
                        recipient.country,
                        "",
                        index
                      ).length
                    }}
                    institutions available in {{ recipient.country }}
                  </div>

                  <!-- Improved search input for institutions with autocomplete -->
                  <div class="mb-2 relative">
                    <input
                      type="text"
                      v-model="recipient.institutionSearch"
                      class="w-full p-3 pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Search and select institution..."
                      autocomplete="off"
                      @focus="
                        $event.target.select();
                        showInstitutionsList(index);
                      "
                      @input="
                        handleInstitutionSearchInput(index, $event.target.value)
                      "
                      @blur="
                        setTimeout(() => handleClickOutside($event, index), 200)
                      "
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
                      v-if="recipient.institutionSearch"
                      @click="clearInstitutionSearch(index)"
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
                        recipient.dropdownVisible &&
                        displayInstitutions(
                          recipient.category,
                          recipient.region,
                          recipient.country,
                          recipient.institutionSearch || '',
                          index
                        ).length > 0
                      "
                      class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    >
                      <ul class="py-1">
                        <li
                          v-for="institution in displayInstitutions(
                            recipient.category,
                            recipient.region,
                            recipient.country,
                            recipient.institutionSearch || '',
                            index
                          ).slice(0, 250)"
                          :key="institution.id"
                          @click="selectInstitution(index, institution)"
                          class="px-3 py-2 cursor-pointer hover:bg-blue-50"
                        >
                          {{ institution.name }}
                        </li>
                        <li
                          v-if="
                            displayInstitutions(
                              recipient.category,
                              recipient.region,
                              recipient.country,
                              recipient.institutionSearch || '',
                              index
                            ).length > 250
                          "
                          class="px-3 py-2 text-center text-sm text-gray-500"
                        >
                          Type more to narrow down results
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div
                    v-if="recipient.institutionSearch"
                    class="text-sm text-gray-600 mt-1 ml-1"
                  >
                    {{
                      getSearchResultsMessage(
                        recipient.category,
                        recipient.region,
                        recipient.country,
                        recipient.institutionSearch
                      )
                    }}
                  </div>

                  <!-- Selected institution display -->
                  <div
                    v-if="recipient.institutionId"
                    class="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200"
                  >
                    <div class="flex justify-between items-center">
                      <div>
                        <h4 class="font-medium">
                          {{ recipient.institutionName }}
                        </h4>
                      </div>
                      <button
                        @click="clearSelectedInstitution(index)"
                        class="text-gray-500 hover:text-gray-700"
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

                <!-- Institution Address - Only visible after institution is selected -->
                <div class="mb-4" v-if="recipient.institutionId">
                  <label
                    for="institution-address"
                    class="block mb-2 font-medium"
                    >Institution Address</label
                  >
                  <textarea
                    id="institution-address"
                    v-model="recipient.address"
                    readonly
                    class="w-full p-3 bg-gray-100 border border-gray-300 rounded-md min-h-[80px] resize-y"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-4 mb-4">
              <div class="flex items-center justify-end gap-4">
                <button
                  class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-8 rounded focus:outline-2 outline-gray-500 focus:shadow-outline w-[30%]"
                  type="button"
                  @click="clearForm"
                >
                  Clear Form
                </button>
                <button
                  :class="[
                    'font-bold py-2 px-8 rounded focus:outline-2 focus:shadow-outline w-[30%] relative',
                    isFormValid
                      ? 'bg-button-blue hover:bg-button-blue-hover text-white outline-button-blue'
                      : 'bg-gray-400 cursor-not-allowed text-gray-200 outline-gray-300',
                  ]"
                  type="button"
                  @click="handleSubmit"
                  :disabled="!isFormValid || submitting"
                >
                  <span
                    v-if="submitting"
                    class="absolute inset-0 flex items-center justify-center"
                  >
                    <div
                      class="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"
                    ></div>
                  </span>
                  <span :class="{ invisible: submitting }">Donate</span>
                </button>
              </div>

              <!-- Validation Message -->
              <div v-if="!isFormValid" class="text-center text-red-500 text-sm">
                <p>Please complete all required fields before donating</p>
                <p
                  v-if="
                    formData.isSpecified &&
                    parseInt(formData.specifiedAmount) > 0
                  "
                >
                  Don't forget to complete all recipient details
                </p>
              </div>
            </div>

            <!-- Debug Panel -->
            <div
              v-if="showDebug"
              class="mt-8 p-4 bg-gray-100 rounded-lg border border-gray-300"
            >
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-semibold text-md">Debug Information</h3>
                <button
                  @click="toggleDebug"
                  class="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Hide Debug
                </button>
              </div>

              <!-- Form Data -->
              <div class="mb-4">
                <h4 class="font-medium mb-1">Form Data:</h4>
                <pre
                  class="text-xs bg-white p-2 rounded overflow-auto max-h-40"
                  >{{ formData }}</pre
                >
              </div>

              <!-- Unspecified Categories -->
              <div class="mb-4">
                <h4 class="font-medium mb-1">Unspecified Categories:</h4>
                <pre
                  class="text-xs bg-white p-2 rounded overflow-auto max-h-40"
                  >{{ unspecifiedCategories }}</pre
                >
              </div>

              <!-- Recipients Data -->
              <div class="mb-4" v-if="formData.isSpecified">
                <h4 class="font-medium mb-1">Recipients Data:</h4>
                <pre
                  class="text-xs bg-white p-2 rounded overflow-auto max-h-40"
                  >{{ recipients }}</pre
                >
              </div>

              <!-- Validation Status -->
              <div class="mb-4">
                <h4 class="font-medium mb-1">Validation:</h4>
                <div
                  class="grid grid-cols-2 gap-2 text-xs bg-white p-2 rounded"
                >
                  <div>
                    Form Valid:
                    <span
                      :class="isFormValid ? 'text-green-600' : 'text-red-600'"
                      >{{ isFormValid }}</span
                    >
                  </div>
                  <div>Total Category Amount: {{ totalCategoryAmount }}</div>
                  <div>Total Sets: {{ formData.quantity }}</div>
                  <div>Specified: {{ formData.specifiedAmount }}</div>
                  <div>Unspecified: {{ formData.unspecifiedAmount }}</div>
                </div>
              </div>

              <!-- Preview what will be submitted -->
              <div>
                <h4 class="font-medium mb-1">Data to be submitted:</h4>
                <pre
                  class="text-xs bg-white p-2 rounded overflow-auto max-h-40"
                  >{{ getSubmitPreview() }}</pre
                >
              </div>
            </div>
            <!-- Debug Info Toggle -->
            <div class="hidden mt-4 text-center">
              <button
                type="button"
                @click="toggleDebug"
                class="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                {{ showDebug ? "Hide Debug Info" : "Show Debug Info" }}
              </button>
            </div>

            <div class="hidden mt-6 text-center">
              <button
                type="button"
                @click="clearAllData"
                class="text-sm text-gray-500 hover:text-red-500 underline"
              >
                Reset Cached Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from "vue";
// Import JSON data
import regionsData from "@/data/regions.json";
import recipientsData from "@/data/recipients.json";
// Import stores and router
import { useDonationStore } from "@/stores/donationStore";
import { useRouter } from "vue-router";

// Initialize stores and router
const donationStore = useDonationStore();
const router = useRouter();

// Form data object
const formData = ref({
  name: "",
  address: "",
  telephone: "",
  email: "",
  quantity: 1,
  total: "",
  // Added donation type data
  specifiedAmount: 0,
  unspecifiedAmount: 1,
  isSpecified: false,
  isUnspecified: true,
});

// For unspecified donations - selected categories with amounts
const unspecifiedCategories = ref({
  university: { selected: true, amount: 1 },
  library: { selected: false, amount: 0 },
  church: { selected: false, amount: 0 },
  wat: { selected: false, amount: 0 },
  religious: { selected: false, amount: 0 },
  culturecenter: { selected: false, amount: 0 },
  other: { selected: false, amount: 0 },
});

// Category display names for UI
const categoryNames = {
  university: "Universities",
  library: "Libraries",
  religious: "Religious Organizations",
  church: "Churches",
  wat: "Wat",
  culturecenter: "Cultural Centers",
  other: "Please Select One For Me",
};

// Loading state for form submission
const submitting = ref(false);

// Debug mode toggle
const showDebug = ref(false);

// Loading state for checking previous donations
const checkingPendingDonations = ref(false);

// Recipients array to store multiple recipient selections
const recipients = ref([
  {
    category: "",
    region: "",
    country: "",
    institutionId: "",
    address: "",
    institutionName: "",
    institutionSearch: "",
    adminNotes: "",
    dropdownVisible: false, // Track dropdown visibility
  },
]);

// Cache for countries by region
const countryCache = ref({});

// Regions data from localStorage or JSON file
const regions = computed(() => {
  const storedRegions = localStorage.getItem("regions");
  return storedRegions ? JSON.parse(storedRegions) : [];
});

// Price set for donation
const priceset = 2000;

// Loading states
const loadingRegions = ref(false);
const loadingCountries = ref(false);
const loadingRecipients = ref(false);

// Cache for recipients
const recipientCache = ref({});

// To trigger reactivity updates
const searchUpdated = ref(0);

// Calculate total amount allocated across categories
const totalCategoryAmount = computed(() => {
  return Object.values(unspecifiedCategories.value)
    .filter((cat) => cat.selected)
    .reduce((sum, cat) => sum + (parseInt(cat.amount) || 0), 0);
});

// Function to validate and adjust category amounts
const validateCategoryAmounts = () => {
  // Ensure all selected categories have at least 1 set
  Object.keys(unspecifiedCategories.value).forEach((key) => {
    const category = unspecifiedCategories.value[key];
    if (category.selected && (!category.amount || category.amount < 1)) {
      category.amount = 1;
    }
  });

  // If total exceeds unspecified amount, adjust to fit
  if (totalCategoryAmount.value > parseInt(formData.value.unspecifiedAmount)) {
    // We could implement auto-adjustment here, but it might be better
    // to let users manually fix it for better control
  }
};

// When a category is deselected, set its amount to 0
watch(
  unspecifiedCategories,
  (newVal) => {
    Object.keys(newVal).forEach((key) => {
      if (!newVal[key].selected) {
        newVal[key].amount = 0;
      } else if (
        newVal[key].selected &&
        (!newVal[key].amount || newVal[key].amount < 1)
      ) {
        newVal[key].amount = 1;
      }
    });
  },
  { deep: true }
);

// Watch for changes in quantity to update specified/unspecified amounts
watch(
  () => formData.value.quantity,
  (newQuantity) => {
    newQuantity = parseInt(newQuantity || 1);

    // If only specified is checked
    if (formData.value.isSpecified && !formData.value.isUnspecified) {
      formData.value.specifiedAmount = newQuantity;
      formData.value.unspecifiedAmount = 0;
    }
    // If only unspecified is checked
    else if (!formData.value.isSpecified && formData.value.isUnspecified) {
      formData.value.unspecifiedAmount = newQuantity;
      formData.value.specifiedAmount = 0;
    }
    // If both are checked or none are checked (default to unspecified)
    else {
      const currentSpecified = parseInt(formData.value.specifiedAmount || 0);
      if (currentSpecified >= newQuantity) {
        formData.value.specifiedAmount = newQuantity;
        formData.value.unspecifiedAmount = 0;
      } else {
        formData.value.unspecifiedAmount = newQuantity - currentSpecified;
      }
    }

    calculateTotal();
  }
);

// Watch for changes in isSpecified to update recipients when donation type changes
watch(
  () => formData.value.isSpecified,
  (isSpecified) => {
    if (isSpecified) {
      // If specified is checked, update recipient count based on specified amount
      updateRecipientsCount(parseInt(formData.value.specifiedAmount || 0));
    } else {
      // If specified is unchecked, reset to 0 recipients
      updateRecipientsCount(0);
    }
  }
);

// Watch for donation type checkbox changes to update amounts
watch(
  () => [formData.value.isSpecified, formData.value.isUnspecified],
  () => {
    const totalQuantity = parseInt(formData.value.quantity || 0);

    // Adjust amounts based on checkboxes
    if (formData.value.isSpecified && !formData.value.isUnspecified) {
      // Only specified is checked
      formData.value.specifiedAmount = totalQuantity;
      formData.value.unspecifiedAmount = 0;
    } else if (!formData.value.isSpecified && formData.value.isUnspecified) {
      // Only unspecified is checked
      formData.value.unspecifiedAmount = totalQuantity;
      formData.value.specifiedAmount = 0;
    } else if (formData.value.isSpecified && formData.value.isUnspecified) {
      // Both are checked, maintain current distribution if possible
      const currentSpecified = parseInt(formData.value.specifiedAmount || 0);
      const currentUnspecified = parseInt(
        formData.value.unspecifiedAmount || 0
      );

      // Ensure the total matches quantity
      if (currentSpecified + currentUnspecified !== totalQuantity) {
        // Default distribution: half and half, or all to specified if quantity is 1
        if (totalQuantity === 1) {
          formData.value.specifiedAmount = 1;
          formData.value.unspecifiedAmount = 0;
        } else {
          formData.value.specifiedAmount = Math.floor(totalQuantity / 2);
          formData.value.unspecifiedAmount =
            totalQuantity - formData.value.specifiedAmount;
        }
      }
    } else {
      // None are checked, default to unspecified
      formData.value.isUnspecified = true;
      formData.value.unspecifiedAmount = totalQuantity;
      formData.value.specifiedAmount = 0;
    }

    // Update recipient forms
    updateRecipientsCount(parseInt(formData.value.specifiedAmount || 0));
  },
  { deep: true }
);

// Watch for changes in specifiedAmount to update the recipients count
watch(
  () => formData.value.specifiedAmount,
  (newAmount) => {
    // Update the number of recipient forms based on the specified amount
    updateRecipientsCount(parseInt(newAmount || 0));
  }
);

// Function to refresh search results
const refreshSearchResults = () => {
  searchUpdated.value++;
};

// Load data into localStorage
const loadDataIntoStorage = () => {
  // Check if data is already in localStorage
  if (!localStorage.getItem("regions")) {
    console.log("Loading regions into localStorage...");
    localStorage.setItem("regions", JSON.stringify(regionsData));
  }

  // Check if recipients data is already in localStorage
  // For large data, we'll split into categories
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

    // Store regions and countries mapping
    const regionCountriesMap = {};
    recipientsData.forEach((recipient) => {
      if (recipient.regionId && recipient.country) {
        if (!regionCountriesMap[recipient.regionId]) {
          regionCountriesMap[recipient.regionId] = new Set();
        }
        regionCountriesMap[recipient.regionId].add(recipient.country);
      }
    });

    // Convert Sets to arrays and store
    Object.keys(regionCountriesMap).forEach((regionId) => {
      regionCountriesMap[regionId] = Array.from(
        regionCountriesMap[regionId]
      ).sort();
    });
    localStorage.setItem(
      "region_countries",
      JSON.stringify(regionCountriesMap)
    );

    console.log("All data loaded into localStorage");
  }
};

onMounted(async () => {
  document.addEventListener("click", () => {
    closeAllDropdowns();
  });

  // Set checking pending donations flag
  checkingPendingDonations.value = true;

  try {
    // Check if there's a completed donation in localStorage
    const completedDonationId = localStorage.getItem("donationId");

    if (completedDonationId) {
      // Ask user if they want to view their completed donation or start a new one
      const viewCompleted = confirm(
        "You have a completed donation. Would you like to view it? Click 'OK' to view your completed donation or 'Cancel' to start a new one."
      );

      if (viewCompleted) {
        router.push("/thank-you");
        return;
      } else {
        // User wants to start a new donation, clear the completed donation ID
        localStorage.removeItem("donationId");
      }
    }

    // Check for pending donation
    const pendingDonationId = localStorage.getItem("pendingDonationId");
    const pendingDonationData = localStorage.getItem("pendingDonation");

    if (pendingDonationId && pendingDonationData) {
      try {
        // Try to fetch the donation from Firestore to check its status
        await donationStore.fetchDonationById(pendingDonationId);

        if (donationStore.currentDonation) {
          const paymentStatus = donationStore.currentDonation.paymentStatus;

          // If payment is not completed, ask user if they want to resume
          if (paymentStatus !== "completed") {
            const resumeDonation = confirm(
              "You have a pending donation. Would you like to resume it? Click 'OK' to resume or 'Cancel' to start a new one."
            );

            if (resumeDonation) {
              router.push(`/payment?donationId=${pendingDonationId}`);
              return;
            } else {
              // User wants to start a new donation, clear the pending donation
              localStorage.removeItem("pendingDonationId");
              localStorage.removeItem("pendingDonation");
            }
          } else {
            // Payment is completed but we're still on the donation page
            // This shouldn't happen normally, but just in case
            localStorage.setItem("donationId", pendingDonationId);
            localStorage.removeItem("pendingDonationId");
            localStorage.removeItem("pendingDonation");

            const viewCompleted = confirm(
              "Your donation has been completed. Would you like to view it? Click 'OK' to view your completed donation or 'Cancel' to start a new one."
            );

            if (viewCompleted) {
              router.push("/thank-you");
              return;
            }
          }
        }
      } catch (error) {
        console.error("Error checking pending donation:", error);
        // Clear invalid pending donation data
        localStorage.removeItem("pendingDonationId");
        localStorage.removeItem("pendingDonation");
      }
    }
  } catch (error) {
    console.error("Error checking previous donations:", error);
  } finally {
    checkingPendingDonations.value = false;
  }

  calculateTotal();
  // Load data into localStorage
  loadDataIntoStorage();
  // Extract and cache unique countries by region
  extractUniqueCountriesByRegion();
  // Initialize the specified and unspecified amounts
  formData.value.unspecifiedAmount = formData.value.quantity;
  // Initialize recipient forms based on current specified amount
  updateRecipientsCount(parseInt(formData.value.specifiedAmount || 0));
});

// Extract unique countries by region from localStorage or JSON data
const extractUniqueCountriesByRegion = () => {
  loadingRegions.value = true;

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
  } finally {
    loadingRegions.value = false;
  }
};

// Function to get countries for a region
const getCountriesForRegion = (regionId) => {
  if (!regionId) return [];
  return countryCache.value[regionId] || [];
};

// Update the recipients array size based on specified amount
const updateRecipientsCount = (count) => {
  // If count is less than current recipients, remove excess recipients
  if (count < recipients.value.length) {
    recipients.value = recipients.value.slice(0, count);
  }
  // If count is more than current recipients, add new recipients
  else if (count > recipients.value.length) {
    const newRecipients = [];
    for (let i = recipients.value.length; i < count; i++) {
      newRecipients.push({
        category: "",
        region: "",
        country: "",
        institutionId: "",
        address: "",
        institutionName: "",
        institutionSearch: "",
        adminNotes: "",
        dropdownVisible: false, // Track dropdown visibility
      });
    }
    recipients.value = [...recipients.value, ...newRecipients];
  }
};

// Handler for quantity changes
const onQuantityChange = () => {
  calculateTotal();

  // The recipients count is now managed by the watch function for specified/unspecified amounts
};

// Calculate total based on quantity
const calculateTotal = () => {
  if (formData.value.quantity && !isNaN(formData.value.quantity)) {
    const quantity = parseInt(formData.value.quantity);
    if (quantity > 0) {
      formData.value.total = (quantity * priceset).toLocaleString() + " THB";
    } else {
      formData.value.total = "";
    }
  } else {
    formData.value.total = "";
  }
};

// Handler for category change
const onCategoryChange = (index) => {
  const recipient = recipients.value[index];
  recipient.region = "";
  recipient.country = "";
  recipient.institutionId = "";
  recipient.institutionName = "";
  recipient.address = "";
  recipient.institutionSearch = "";
};

// Handler for region change
const onRegionChange = (index) => {
  const recipient = recipients.value[index];
  recipient.country = "";
  recipient.institutionId = "";
  recipient.institutionName = "";
  recipient.address = "";
  recipient.institutionSearch = "";
};

// Handler for country change
const onCountryChange = async (index) => {
  const recipient = recipients.value[index];
  recipient.institutionId = "";
  recipient.institutionName = "";
  recipient.address = "";
  recipient.institutionSearch = "";

  // Show loading indicator
  loadingRecipients.value = true;

  try {
    console.log(
      `Fetching institutions for category: ${recipient.category}, region: ${recipient.region}, country: ${recipient.country}`
    );

    // Get filtered institutions for this category, region, and country
    const institutions = await getFilteredInstitutions(
      recipient.category,
      recipient.region,
      recipient.country
    );

    console.log(
      `Found ${institutions.length} institutions for ${recipient.country}`
    );

    // Cache these institutions for faster access
    const cacheKey = `${recipient.category}-${recipient.region}-${recipient.country}`;
    recipientCache.value[cacheKey] = institutions;

    // Preload institution names for display
    if (institutions.length === 1) {
      // If there's only one institution, auto-select it
      selectInstitution(index, institutions[0]);
    } else if (institutions.length > 0) {
      // If there are multiple institutions, show them in the dropdown
      // We'll just set the search field to show the dropdown
      recipient.institutionSearch = "";
      refreshSearchResults();
    }
  } catch (error) {
    console.error("Error fetching institutions for country:", error);
  } finally {
    loadingRecipients.value = false;
  }
};

// Get filtered institutions based on criteria
const getFilteredInstitutions = (category, regionId, country) => {
  if (!category || !regionId || !country) return [];

  try {
    // First try to get from localStorage
    const categoryKey = `recipients_${category}`;
    const storedCategoryData = localStorage.getItem(categoryKey);

    if (storedCategoryData) {
      const categoryRecipients = JSON.parse(storedCategoryData);
      return categoryRecipients.filter(
        (r) => r.regionId === regionId && r.country === country
      );
    } else {
      // Fallback to the imported data
      return recipientsData.filter(
        (recipient) =>
          recipient.category === category &&
          recipient.regionId === regionId &&
          recipient.country === country
      );
    }
  } catch (error) {
    console.error("Error getting filtered institutions:", error);
    return [];
  }
};

// Function to handle institution search input
const handleInstitutionSearchInput = (index, searchValue) => {
  const recipient = recipients.value[index];
  recipient.institutionSearch = searchValue;
  recipient.dropdownVisible = true; // Show dropdown when typing
  refreshSearchResults();
};

// Function to clear institution search
const clearInstitutionSearch = (index) => {
  const recipient = recipients.value[index];
  recipient.institutionSearch = "";
  recipient.dropdownVisible = false; // Close dropdown when clearing
  refreshSearchResults();
};

// Function to select an institution
const selectInstitution = (index, institution) => {
  const recipient = recipients.value[index];
  recipient.institutionId = institution.id;
  recipient.institutionName = institution.name;
  recipient.address = institution.address || "";
  recipient.institutionSearch = "";
  recipient.dropdownVisible = false; // Close dropdown after selection
  refreshSearchResults();
};

// Function to clear selected institution
const clearSelectedInstitution = (index) => {
  const recipient = recipients.value[index];
  recipient.institutionId = "";
  recipient.institutionName = "";
  recipient.address = "";
  recipient.institutionSearch = "";
  refreshSearchResults();
};

// Function to show all institutions for a country
const showInstitutionsList = (index) => {
  const recipient = recipients.value[index];

  // Just set search to empty to trigger showing all results
  recipient.institutionSearch = "";
  recipient.dropdownVisible = true; // Show dropdown

  // Pre-fetch institutions if they're not already in cache
  if (recipient.category && recipient.region && recipient.country) {
    const cacheKey = `${recipient.category}-${recipient.region}-${recipient.country}`;

    if (!recipientCache.value[cacheKey]) {
      // Trigger a fetch of all institutions for this category, region, and country
      getFilteredInstitutions(
        recipient.category,
        recipient.region,
        recipient.country
      )
        .then((institutions) => {
          recipientCache.value[cacheKey] = institutions;
          refreshSearchResults();
        })
        .catch((error) => {
          console.error("Error pre-fetching institutions:", error);
        });
    }
  }

  // Force a refresh of the UI
  refreshSearchResults();
};

// Function to display institutions for dropdown (with filtering by search term)
const displayInstitutions = (
  category,
  regionId,
  country,
  searchTerm,
  index
) => {
  if (!category || !regionId || !country) return [];

  // Check the cache first
  const cacheKey = `${category}-${regionId}-${country}`;
  let institutions = recipientCache.value[cacheKey];

  // If not in cache, get them directly (this shouldn't happen often)
  if (!institutions) {
    institutions = getFilteredInstitutions(category, regionId, country);
  }

  // If search term is provided, filter by name
  if (searchTerm && searchTerm.trim() !== "") {
    const search = searchTerm.toLowerCase();
    return institutions.filter((institution) =>
      institution.name.toLowerCase().includes(search)
    );
  }

  return institutions || [];
};

// Function to get search results message
const getSearchResultsMessage = (category, regionId, country, searchTerm) => {
  if (!searchTerm) return "";

  const results = displayInstitutions(category, regionId, country, searchTerm);
  if (results.length === 0) {
    return "No matching institutions found";
  } else if (results.length === 1) {
    return "1 institution found";
  } else {
    return `${results.length} institutions found`;
  }
};

// Form validation
const isFormValid = computed(() => {
  // Basic form validation for donor info
  const basicInfoValid =
    formData.value.name &&
    formData.value.telephone &&
    formData.value.email &&
    formData.value.quantity &&
    parseInt(formData.value.quantity) > 0;

  if (!basicInfoValid) return false;

  // Validate that donation distribution is correct
  const totalSpecified = parseInt(formData.value.specifiedAmount || 0);
  const totalUnspecified = parseInt(formData.value.unspecifiedAmount || 0);
  const totalQuantity = parseInt(formData.value.quantity);

  // Check if at least one donation type is selected
  const donationTypeValid =
    formData.value.isSpecified || formData.value.isUnspecified;

  // Check if total allocations match the total quantity
  const allocationValid = totalSpecified + totalUnspecified === totalQuantity;

  if (!donationTypeValid || !allocationValid) return false;

  // Check if at least one category is selected for unspecified donations
  if (formData.value.isUnspecified && totalUnspecified > 0) {
    const atLeastOneCategorySelected = Object.values(
      unspecifiedCategories.value
    ).some((v) => v.selected);

    if (!atLeastOneCategorySelected) return false;

    // Make sure category allocations don't exceed unspecified amount
    if (totalCategoryAmount.value > totalUnspecified) return false;
  }

  // Only validate recipients if there are specified donations
  if (!formData.value.isSpecified || totalSpecified <= 0) {
    return true; // No recipients to validate
  }

  // Check if we have the correct number of recipients
  if (recipients.value.length !== totalSpecified) return false;

  // Check if all recipients have been selected properly for specified donations
  const allRecipientsValid = recipients.value.every((recipient) => {
    // First check if a category is selected
    if (!recipient.category) return false;

    // For custom recipients, check custom fields
    if (recipient.category === "custom") {
      return (
        recipient.institutionName &&
        recipient.region &&
        recipient.country &&
        recipient.address
      );
    }

    // For admin selection, we only need the category
    if (recipient.category === "admin-select") {
      return true;
    }

    // For standard selections, check all fields
    return (
      recipient.institutionId &&
      recipient.category &&
      recipient.region &&
      recipient.country
    );
  });

  return allRecipientsValid;
});

// Function to clear form values and localStorage (for testing)
const clearForm = () => {
  // Reset form data
  formData.value = {
    name: "",
    address: "",
    telephone: "",
    email: "",
    quantity: 1,
    total: "",
    specifiedAmount: 0,
    unspecifiedAmount: 1,
    isSpecified: false,
    isUnspecified: true,
  };

  // Reset recipients to a single empty recipient
  recipients.value = [
    {
      category: "",
      region: "",
      country: "",
      institutionId: "",
      address: "",
      institutionName: "",
      institutionSearch: "",
      adminNotes: "",
      dropdownVisible: false, // Track dropdown visibility
    },
  ];

  calculateTotal();
};

// Function to clear all localStorage data (for testing)
const clearAllData = () => {
  localStorage.removeItem("regions");
  localStorage.removeItem("recipients_categories");
  localStorage.removeItem("region_countries");

  // Clear all category data
  const categories = JSON.parse(
    localStorage.getItem("recipients_categories") || "[]"
  );
  categories.forEach((category) => {
    localStorage.removeItem(`recipients_${category}`);
  });

  console.log("All stored data cleared");
  // Reload page to refresh data
  window.location.reload();
};

// Handle form submission
const handleSubmit = async () => {
  if (!isFormValid.value || submitting.value) return;

  submitting.value = true;

  try {
    // Prepare donor data
    const donorData = {
      name: formData.value.name,
      email: formData.value.email,
      telephone: formData.value.telephone,
      address: formData.value.address || "",
    };

    // Calculate total amount in THB
    const rawTotal = parseInt(formData.value.quantity) * priceset;

    // Prepare recipient data
    let recipientsData = [];

    // If there are specified recipients, format their data
    if (
      formData.value.isSpecified &&
      parseInt(formData.value.specifiedAmount) > 0
    ) {
      recipientsData = recipients.value.map((recipient) => {
        // For custom recipients
        if (recipient.category === "custom") {
          return {
            recipientCategory: "custom",
            recipientName: recipient.institutionName,
            recipientRegion: recipient.region,
            recipientAddress: recipient.address,
            recipientCountry: recipient.country || "",
          };
        }

        // For admin-selection
        if (recipient.category === "admin-select") {
          return {
            recipientCategory: "admin-select",
            adminNotes: recipient.adminNotes || "No specific preferences",
          };
        }

        // Standard recipient selection
        return {
          recipientCategory: recipient.category,
          recipientName: recipient.institutionName,
          recipientRegion: recipient.region,
          recipientAddress: recipient.address,
          recipientId: recipient.institutionId,
          recipientCountry: recipient.country || "",
        };
      });
    }

    // If there are unspecified recipients, add them
    if (
      formData.value.isUnspecified &&
      parseInt(formData.value.unspecifiedAmount) > 0
    ) {
      // Get selected categories with amounts
      const selectedCategories = Object.entries(unspecifiedCategories.value)
        .filter(([_, data]) => data.selected)
        .map(([category, data]) => ({
          category,
          amount: parseInt(data.amount) || 0,
        }));

      // Determine remaining unallocated amount
      const allocatedAmount = selectedCategories.reduce(
        (sum, cat) => sum + cat.amount,
        0
      );
      const remainingAmount =
        parseInt(formData.value.unspecifiedAmount) - allocatedAmount;

      // Add entries for each explicitly allocated set
      selectedCategories.forEach((cat) => {
        for (let i = 0; i < cat.amount; i++) {
          recipientsData.push({
            recipientCategory: "unspecified",
            recipientName: `To be determined by admin (${
              categoryNames[cat.category]
            })`,
            preferredCategories: [cat.category],
            specificCategory: true,
          });
        }
      });

      // Add entries for remaining unallocated sets (if any)
      if (remainingAmount > 0) {
        const preferredCategories = selectedCategories.map(
          (cat) => cat.category
        );
        for (let i = 0; i < remainingAmount; i++) {
          recipientsData.push({
            recipientCategory: "unspecified",
            recipientName: "To be determined by admin",
            preferredCategories: preferredCategories,
            specificCategory: false,
          });
        }
      }
    }

    // Create donation data object
    const donationData = {
      amount: rawTotal,
      formattedTotal: `${rawTotal.toLocaleString()} THB`,
      quantity: parseInt(formData.value.quantity),
      recipients: recipientsData,
      specifiedAmount: parseInt(formData.value.specifiedAmount) || 0,
      unspecifiedAmount: parseInt(formData.value.unspecifiedAmount) || 0,
      pricePerSet: priceset,
      status: "initiated",
      paymentStatus: "initiated",
      message: "", // Optional message field
    };

    console.log("Submitting donation data:", donationData);

    // Use the donation store to create donor and donation
    const result = await donationStore.createDonorAndDonation(
      donorData,
      donationData
    );

    if (result && result.donationId) {
      // Store donation data in localStorage for persistence
      const localStorageData = {
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.telephone,
        quantity: formData.value.quantity,
        formattedTotal: donationData.formattedTotal,
        recipients: recipientsData,
      };

      // Store donation ID in localStorage
      localStorage.setItem("pendingDonationId", result.donationId);
      localStorage.setItem("pendingDonation", JSON.stringify(localStorageData));

      // Reset form
      clearForm();

      // Redirect to payment page
      router.push("/payment");
    } else {
      throw new Error("Failed to create donation - result was null");
    }
  } catch (error) {
    console.error("Error submitting donation:", error);
    alert("There was an error processing your donation. Please try again.");
  } finally {
    submitting.value = false;
  }
};

// Function to close all dropdowns
const closeAllDropdowns = () => {
  recipients.value.forEach((recipient) => {
    recipient.dropdownVisible = false;
  });
  refreshSearchResults();
};

// Function to handle click outside the dropdown
const handleClickOutside = (event, index) => {
  const dropdown = event.target.closest(".institution-dropdown-container");
  if (!dropdown) {
    const recipient = recipients.value[index];
    recipient.dropdownVisible = false;
    refreshSearchResults();
  }
};

// Toggle debug mode
const toggleDebug = () => {
  showDebug.value = !showDebug.value;
};

// Preview what will be submitted
const getSubmitPreview = () => {
  // Prepare donor data
  const donorData = {
    name: formData.value.name,
    email: formData.value.email,
    telephone: formData.value.telephone,
    address: formData.value.address || "",
  };

  // Calculate total amount in THB
  const rawTotal = parseInt(formData.value.quantity) * priceset;

  // Prepare recipient data
  let recipientsData = [];

  // If there are specified recipients, format their data
  if (
    formData.value.isSpecified &&
    parseInt(formData.value.specifiedAmount) > 0
  ) {
    // Simplified version for preview
    recipientsData = recipients.value.map((recipient) => {
      return {
        category: recipient.category,
        region: recipient.region,
        country: recipient.country,
        institution: recipient.institutionName,
      };
    });
  }

  // If there are unspecified recipients, add them
  if (
    formData.value.isUnspecified &&
    parseInt(formData.value.unspecifiedAmount) > 0
  ) {
    // Get selected categories with amounts
    const selectedCategories = Object.entries(unspecifiedCategories.value)
      .filter(([_, data]) => data.selected)
      .map(([category, data]) => ({
        category,
        amount: parseInt(data.amount) || 0,
      }));

    // Add a summary for preview
    recipientsData.push({
      type: "unspecified",
      total: parseInt(formData.value.unspecifiedAmount),
      categories: selectedCategories,
    });
  }

  return {
    donor: donorData,
    amount: rawTotal,
    formattedTotal: `${rawTotal.toLocaleString()} THB`,
    quantity: parseInt(formData.value.quantity),
    specifiedAmount: parseInt(formData.value.specifiedAmount) || 0,
    unspecifiedAmount: parseInt(formData.value.unspecifiedAmount) || 0,
    recipients: recipientsData,
  };
};
</script>

<style scoped>
.gradient-background-donate {
  background: linear-gradient(to right, #d9ebec, #cbe5e5);
}
.gradient-background-blue {
  background: linear-gradient(to right, #d3e4ea, #9fcadd);
}
.text-background-blue {
  background: #e8f7f9;
}

/* Button colors defined directly */
.bg-button-blue {
  background-color: #3b82f6;
}
.bg-button-blue:hover {
  background-color: #2563eb;
}
.outline-button-blue {
  outline-color: #3b82f6;
}

/* Custom dropdown styling with triangle */
select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: white;
  border: none;
  border-radius: 0;
  color: #475569;
  font-weight: 500;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239fcadd' d='M6 9L0 3h12z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 12px;
  padding-right: 2.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

/* Add a subtle hover effect */
select:hover {
  background-color: #fff;
}

/* Style when dropdown is focused */
select:focus {
  outline: 2px solid #9fcadd;
  box-shadow: 0 0 0 3px rgba(159, 202, 221, 0.25);
}

/* Style for dropdown options */
select option {
  background-color: white;
  color: #475569;
  padding: 8px;
  white-space: normal;
  word-wrap: break-word;
  font-size: 0.9rem;
  max-width: 100%;
}

/* Style for the selected option in dropdown */
select option:checked {
  background-color: #9fcadd;
  color: white;
}

/* Add a text indicator for required fields */
.mb-4 .text-center {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

/* Responsive adjustments for mobile */
@media (max-width: 640px) {
  select {
    padding-right: 2rem;
    background-position: right 0.75rem center;
    background-size: 10px;
    font-size: 0.9rem;
  }

  select option {
    font-size: 0.85rem;
    padding: 6px;
  }
}

.institution-form {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.institution-form h3 {
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
  color: #374151;
}

.form-group select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
  background-color: #f3f4f6;
}

.loading-indicator {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
}

.loading-indicator::before {
  content: "";
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Search input styles */
.search-input-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}
</style>
