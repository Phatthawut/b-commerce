<template>
  <section class="bg-white">
    <div class="container grid grid-cols-1 mx-auto md:p-8 font-thai">
      <h1 class="text-4xl font-bold text-black text-center">Donor Form</h1>
      <div class="divider divider-info w-1/2 mx-auto"></div>
      <div class="grid grid-cols-1 gradient-background-donate py-4 md:p-12">
        <div class="text-background-blue p-2 md:p-6 md:w-[80%] mx-auto">
          <form class="px-2 md:px-8 pt-6 pb-8">
            <div class="mb-4">
              <label class="sr-only" for="name"> Full Name </label>
              <input
                class="w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
                id="name"
                type="text"
                placeholder="Donor Name*"
                v-model="formData.name"
              />
            </div>

            <div class="mb-4">
              <label class="sr-only" for="address">
                Donor Address (Optional)
              </label>
              <input
                class="w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
                id="address"
                type="text"
                placeholder="Donor Address (Optional)"
                v-model="formData.address"
              />
            </div>

            <div class="mb-4">
              <label class="sr-only" for="telephone"> Telephone </label>
              <input
                class="w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
                id="telephone"
                type="text"
                placeholder="Telephone*"
                v-model="formData.telephone"
                aria-label="Telephone"
              />
            </div>

            <div class="mb-4">
              <label class="sr-only" for="email"> Email </label>
              <input
                class="w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
                id="email"
                type="email"
                placeholder="Email"
                v-model="formData.email"
              />
            </div>

            <!-- Category Selection -->
            <div class="mb-4">
              <label class="sr-only" for="category">Recipient Category</label>
              <select
                id="category"
                v-model="selectedCategory"
                @change="onCategoryChange"
                class="w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
              >
                <option value="" disabled selected>
                  SELECT RECIPIENT TYPE
                </option>
                <option value="university">UNIVERSITY</option>
                <option value="library">LIBRARY</option>
                <option value="nonprofit">NON-PROFIT ORGANIZATION</option>
              </select>
            </div>

            <!-- Region Selection (shows only when category is selected) -->
            <div class="mb-4" v-if="selectedCategory">
              <label class="sr-only" for="region">Region</label>
              <select
                id="region"
                v-model="selectedRegion"
                @change="onRegionChange"
                class="w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
              >
                <option value="" disabled selected>SELECT REGION</option>
                <option
                  v-for="region in regions"
                  :key="region.id"
                  :value="region.id"
                >
                  {{ region.name }}
                </option>
              </select>
            </div>

            <!-- Institution Selection (shows only when region is selected) -->
            <div class="mb-4" v-if="selectedRegion">
              <label class="sr-only" for="institution">Institution</label>
              <select
                id="institution"
                v-model="selectedInstitution"
                @change="onInstitutionChange"
                class="w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
              >
                <option value="" disabled selected>
                  SELECT {{ selectedCategory.toUpperCase() }}
                </option>
                <option
                  v-for="institution in filteredInstitutions"
                  :key="institution.id"
                  :value="institution.id"
                >
                  {{ institution.name }}
                </option>
              </select>
            </div>

            <!-- Institution Address (auto-populated and read-only) -->
            <div class="mb-4" v-if="selectedInstitution">
              <label class="sr-only" for="institutionAddress"
                >Institution Address</label
              >
              <textarea
                id="institutionAddress"
                class="w-full py-4 px-3 bg-gray-100 text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline"
                readonly
                rows="3"
                v-model="institutionAddress"
              ></textarea>
            </div>

            <div class="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label class="sr-only" for="quantity"> Quantity </label>
                <input
                  class="w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="QUANTITY (SETS)"
                  v-model="formData.quantity"
                  @input="calculateTotal"
                  aria-label="Quantity"
                />
              </div>
              <div>
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
            </div>

            <div class="flex item-center justify-end">
              <button
                class="bg-button-blue hover:bg-button-blue-hover text-white font-bold py-2 px-8 rounded focus:outline-2 outline-button-blue focus:shadow-outline w-[30%]"
                type="button"
                @click="handleSubmit"
                :disabled="!isFormValid"
              >
                Donate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { serverTimestamp } from "firebase/firestore";
import { useDonationStore } from "@/stores/donationStore";

const router = useRouter();
const loading = ref(false);

// Constants
const PRICE_PER_SET = 1500; // 1500 THB per set

// Form data
const formData = ref({
  name: "",
  address: "",
  telephone: "",
  email: "",
  message: "",
  recipientId: null,
  quantity: "",
  total: "",
});

// Category, region and institution selection
const selectedCategory = ref("");
const selectedRegion = ref("");
const selectedInstitution = ref("");
const institutionAddress = ref("");

// Sample data - replace with actual data from your database
const regions = ref([
  { id: "northamerica", name: "North America" },
  { id: "europe", name: "Europe" },
  { id: "asia", name: "Asia" },
  { id: "africa", name: "Africa" },
  { id: "oceania", name: "Oceania" },
  { id: "southamerica", name: "South America" },
  { id: "middleeast", name: "Middle East" },
]);

// Universities data
const universities = ref([
  // North America
  {
    id: "harvard",
    name: "Harvard University",
    category: "university",
    regionId: "northamerica",
    address: "Massachusetts Hall, Cambridge, MA 02138, United States",
  },
  {
    id: "stanford",
    name: "Stanford University",
    category: "university",
    regionId: "northamerica",
    address: "450 Serra Mall, Stanford, CA 94305, United States",
  },
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    category: "university",
    regionId: "northamerica",
    address: "77 Massachusetts Ave, Cambridge, MA 02139, United States",
  },
  {
    id: "toronto",
    name: "University of Toronto",
    category: "university",
    regionId: "northamerica",
    address: "27 King's College Circle, Toronto, Ontario M5S 1A1, Canada",
  },
  {
    id: "berkeley",
    name: "University of California, Berkeley",
    category: "university",
    regionId: "northamerica",
    address: "Berkeley, CA 94720, United States",
  },
  // Europe
  {
    id: "oxford",
    name: "University of Oxford",
    category: "university",
    regionId: "europe",
    address:
      "University Offices, Wellington Square, Oxford OX1 2JD, United Kingdom",
  },
  {
    id: "cambridge",
    name: "University of Cambridge",
    category: "university",
    regionId: "europe",
    address: "The Old Schools, Trinity Lane, Cambridge CB2 1TN, United Kingdom",
  },
  {
    id: "eth",
    name: "ETH Zurich",
    category: "university",
    regionId: "europe",
    address: "Rämistrasse 101, 8092 Zürich, Switzerland",
  },
  {
    id: "sorbonne",
    name: "Sorbonne University",
    category: "university",
    regionId: "europe",
    address: "21 Rue de l'École de Médecine, 75006 Paris, France",
  },
  {
    id: "heidelberg",
    name: "Heidelberg University",
    category: "university",
    regionId: "europe",
    address: "Grabengasse 1, 69117 Heidelberg, Germany",
  },
  // Asia
  {
    id: "tsinghua",
    name: "Tsinghua University",
    category: "university",
    regionId: "asia",
    address: "30 Shuangqing Rd, Haidian District, Beijing, China",
  },
  {
    id: "tokyo",
    name: "University of Tokyo",
    category: "university",
    regionId: "asia",
    address: "7 Chome-3-1 Hongo, Bunkyo City, Tokyo 113-8654, Japan",
  },
  {
    id: "nus",
    name: "National University of Singapore",
    category: "university",
    regionId: "asia",
    address: "21 Lower Kent Ridge Rd, Singapore 119077",
  },
  {
    id: "cmu",
    name: "Chiang Mai University",
    category: "university",
    regionId: "asia",
    address: "239 Huay Kaew Road, Muang District, Chiang Mai 50200, Thailand",
  },
  {
    id: "iitd",
    name: "Indian Institute of Technology Delhi",
    category: "university",
    regionId: "asia",
    address: "Hauz Khas, New Delhi, Delhi 110016, India",
  },
  // Africa
  {
    id: "capetown",
    name: "University of Cape Town",
    category: "university",
    regionId: "africa",
    address: "Rondebosch, Cape Town, 7700, South Africa",
  },
  {
    id: "cairo",
    name: "Cairo University",
    category: "university",
    regionId: "africa",
    address:
      "Cairo University Rd, Oula, Giza District, Giza Governorate, Egypt",
  },
  {
    id: "makerere",
    name: "Makerere University",
    category: "university",
    regionId: "africa",
    address: "University Rd, Kampala, Uganda",
  },
  // Oceania
  {
    id: "melbourne",
    name: "University of Melbourne",
    category: "university",
    regionId: "oceania",
    address: "Parkville VIC 3010, Australia",
  },
  {
    id: "auckland",
    name: "University of Auckland",
    category: "university",
    regionId: "oceania",
    address: "22 Princes Street, Auckland CBD, Auckland 1010, New Zealand",
  },
  {
    id: "sydney",
    name: "University of Sydney",
    category: "university",
    regionId: "oceania",
    address: "Camperdown NSW 2006, Australia",
  },
  // South America
  {
    id: "usp",
    name: "University of São Paulo",
    category: "university",
    regionId: "southamerica",
    address:
      "R. da Reitoria, 374 - Cidade Universitária, São Paulo - SP, 05508-220, Brazil",
  },
  {
    id: "uba",
    name: "University of Buenos Aires",
    category: "university",
    regionId: "southamerica",
    address: "Viamonte 430, C1053 CABA, Argentina",
  },
  {
    id: "unal",
    name: "National University of Colombia",
    category: "university",
    regionId: "southamerica",
    address: "Carrera 45 # 26-85, Bogotá, Colombia",
  },
  // Middle East
  {
    id: "technion",
    name: "Technion - Israel Institute of Technology",
    category: "university",
    regionId: "middleeast",
    address: "Technion City, Haifa 3200003, Israel",
  },
  {
    id: "kaust",
    name: "King Abdullah University of Science and Technology",
    category: "university",
    regionId: "middleeast",
    address: "Thuwal 23955, Saudi Arabia",
  },
  {
    id: "aub",
    name: "American University of Beirut",
    category: "university",
    regionId: "middleeast",
    address: "Bliss Street, Beirut, Lebanon",
  },
]);

// Libraries data
const libraries = ref([
  // North America
  {
    id: "loc",
    name: "Library of Congress",
    category: "library",
    regionId: "northamerica",
    address: "101 Independence Ave SE, Washington, DC 20540, United States",
  },
  {
    id: "nypl",
    name: "New York Public Library",
    category: "library",
    regionId: "northamerica",
    address: "476 5th Ave, New York, NY 10018, United States",
  },
  {
    id: "bostonpl",
    name: "Boston Public Library",
    category: "library",
    regionId: "northamerica",
    address: "700 Boylston St, Boston, MA 02116, United States",
  },
  {
    id: "torontpl",
    name: "Toronto Public Library",
    category: "library",
    regionId: "northamerica",
    address: "789 Yonge St, Toronto, ON M4W 2G8, Canada",
  },
  // Europe
  {
    id: "bl",
    name: "British Library",
    category: "library",
    regionId: "europe",
    address: "96 Euston Rd, London NW1 2DB, United Kingdom",
  },
  {
    id: "bnf",
    name: "Bibliothèque nationale de France",
    category: "library",
    regionId: "europe",
    address: "Quai François Mauriac, 75706 Paris, France",
  },
  {
    id: "dnb",
    name: "German National Library",
    category: "library",
    regionId: "europe",
    address: "Deutscher Pl. 1, 04103 Leipzig, Germany",
  },
  {
    id: "vat",
    name: "Vatican Library",
    category: "library",
    regionId: "europe",
    address: "00120 Vatican City",
  },
  // Asia
  {
    id: "ndl",
    name: "National Diet Library",
    category: "library",
    regionId: "asia",
    address: "1-10-1 Nagatacho, Chiyoda City, Tokyo 100-8924, Japan",
  },
  {
    id: "nlc",
    name: "National Library of China",
    category: "library",
    regionId: "asia",
    address: "33 Zhongguancun S St, Haidian District, Beijing, China",
  },
  {
    id: "nlt",
    name: "National Library of Thailand",
    category: "library",
    regionId: "asia",
    address: "Samsen Rd, Dusit, Bangkok 10300, Thailand",
  },
  {
    id: "nli",
    name: "National Library of India",
    category: "library",
    regionId: "asia",
    address: "Belvedere, Alipore, Kolkata, West Bengal 700027, India",
  },
  // Africa
  {
    id: "nle",
    name: "National Library of Egypt",
    category: "library",
    regionId: "africa",
    address: "Corniche El Nil, Cairo, Egypt",
  },
  {
    id: "nlsa",
    name: "National Library of South Africa",
    category: "library",
    regionId: "africa",
    address:
      "5 Queen Victoria St, Cape Town City Centre, Cape Town, 8001, South Africa",
  },
  {
    id: "nlk",
    name: "Kenya National Library Service",
    category: "library",
    regionId: "africa",
    address: "Maktaba Kuu, Ngong Road, Nairobi, Kenya",
  },
  // Oceania
  {
    id: "nla",
    name: "National Library of Australia",
    category: "library",
    regionId: "oceania",
    address: "Parkes Pl W, Canberra ACT 2600, Australia",
  },
  {
    id: "nlnz",
    name: "National Library of New Zealand",
    category: "library",
    regionId: "oceania",
    address: "70 Molesworth St, Thorndon, Wellington 6011, New Zealand",
  },
  {
    id: "slnsw",
    name: "State Library of New South Wales",
    category: "library",
    regionId: "oceania",
    address: "Macquarie St, Sydney NSW 2000, Australia",
  },
  // South America
  {
    id: "bnb",
    name: "National Library of Brazil",
    category: "library",
    regionId: "southamerica",
    address:
      "Av. Rio Branco, 219 - Centro, Rio de Janeiro - RJ, 20040-008, Brazil",
  },
  {
    id: "bnc",
    name: "National Library of Chile",
    category: "library",
    regionId: "southamerica",
    address: "Av. Libertador Bernardo O'Higgins 651, Santiago, Chile",
  },
  {
    id: "bnp",
    name: "National Library of Peru",
    category: "library",
    regionId: "southamerica",
    address: "Av. De La Poesía 160, San Borja, Lima, Peru",
  },
  // Middle East
  {
    id: "nli",
    name: "National Library of Israel",
    category: "library",
    regionId: "middleeast",
    address: "Edmond J. Safra Campus, Givat Ram, Jerusalem, Israel",
  },
  {
    id: "qnl",
    name: "Qatar National Library",
    category: "library",
    regionId: "middleeast",
    address: "Education City, Al Luqta St, Doha, Qatar",
  },
  {
    id: "nlk",
    name: "National Library of Kuwait",
    category: "library",
    regionId: "middleeast",
    address: "Arabian Gulf Street, Kuwait City, Kuwait",
  },
]);

// Non-profit organizations data
const nonprofits = ref([
  // North America
  {
    id: "roomtoread",
    name: "Room to Read",
    category: "nonprofit",
    regionId: "northamerica",
    address:
      "465 California St, Suite 1000, San Francisco, CA 94104, United States",
  },
  {
    id: "firstbook",
    name: "First Book",
    category: "nonprofit",
    regionId: "northamerica",
    address: "1319 F St NW, Suite 1000, Washington, DC 20004, United States",
  },
  {
    id: "worldreader",
    name: "Worldreader",
    category: "nonprofit",
    regionId: "northamerica",
    address: "214 Grant Ave, Suite 325, San Francisco, CA 94108, United States",
  },
  {
    id: "litworld",
    name: "LitWorld",
    category: "nonprofit",
    regionId: "northamerica",
    address: "222 Broadway, 19th Floor, New York, NY 10038, United States",
  },
  // Europe
  {
    id: "bookaid",
    name: "Book Aid International",
    category: "nonprofit",
    regionId: "europe",
    address: "39-41 Coldharbour Lane, London SE5 9NR, United Kingdom",
  },
  {
    id: "bookstrust",
    name: "BookTrust",
    category: "nonprofit",
    regionId: "europe",
    address:
      "G8 Battersea Studios, 80 Silverthorne Road, London SW8 3HE, United Kingdom",
  },
  {
    id: "readingagency",
    name: "The Reading Agency",
    category: "nonprofit",
    regionId: "europe",
    address:
      "Free Word Centre, 60 Farringdon Road, London EC1R 3GA, United Kingdom",
  },
  {
    id: "federleggio",
    name: "Federation of European Publishers",
    category: "nonprofit",
    regionId: "europe",
    address: "Rue Montoyer 31, 1000 Brussels, Belgium",
  },
  // Asia
  {
    id: "pratham",
    name: "Pratham Books",
    category: "nonprofit",
    regionId: "asia",
    address:
      "No. 621, 2nd Floor, 5th Main, OMBR Layout, Banaswadi, Bangalore 560043, India",
  },
  {
    id: "asianfoundation",
    name: "The Asia Foundation - Books for Asia",
    category: "nonprofit",
    regionId: "asia",
    address:
      "465 California St, 9th Floor, San Francisco, CA 94104, United States",
  },
  {
    id: "letsread",
    name: "Let's Read Asia",
    category: "nonprofit",
    regionId: "asia",
    address:
      "465 California Street, 9th Floor, San Francisco, CA 94104, United States",
  },
  {
    id: "readingnepal",
    name: "Room to Read Nepal",
    category: "nonprofit",
    regionId: "asia",
    address: "Kathmandu, Nepal",
  },
  // Africa
  {
    id: "bookdash",
    name: "Book Dash",
    category: "nonprofit",
    regionId: "africa",
    address:
      "Unit B1, Roodehek House, 2 Roodehek Street, Gardens, Cape Town, 8001, South Africa",
  },
  {
    id: "codeafrica",
    name: "CODE - Reading Africa",
    category: "nonprofit",
    regionId: "africa",
    address: "321 Chapel Street, Ottawa, Ontario K1N 7Z2, Canada",
  },
  {
    id: "africanlibraries",
    name: "African Library Project",
    category: "nonprofit",
    regionId: "africa",
    address: "5 Thistle Street, Portola Valley, CA 94028, United States",
  },
  // Oceania
  {
    id: "indigenousliteracy",
    name: "Indigenous Literacy Foundation",
    category: "nonprofit",
    regionId: "oceania",
    address: "2/40 Yurong Street, Darlinghurst NSW 2010, Australia",
  },
  {
    id: "booksinhouses",
    name: "Books in Homes Australia",
    category: "nonprofit",
    regionId: "oceania",
    address: "1/10 Gibbens Road, West Gosford NSW 2250, Australia",
  },
  {
    id: "duffy",
    name: "Duffy Books in Homes",
    category: "nonprofit",
    regionId: "oceania",
    address:
      "Level 3, 101 Carlton Gore Road, Newmarket, Auckland 1023, New Zealand",
  },
  // South America
  {
    id: "vivaleitura",
    name: "Viva Leitura",
    category: "nonprofit",
    regionId: "southamerica",
    address:
      "Rua Minas Gerais, 228 - Higienópolis, São Paulo - SP, 01244-010, Brazil",
  },
  {
    id: "biblored",
    name: "BibloRed",
    category: "nonprofit",
    regionId: "southamerica",
    address: "Avenida Carrera 60 No. 57-60, Bogotá, Colombia",
  },
  {
    id: "fundlectura",
    name: "Fundación Leer",
    category: "nonprofit",
    regionId: "southamerica",
    address: "Av. Cerviño 4407, 1425 Buenos Aires, Argentina",
  },
  // Middle East
  {
    id: "welovereading",
    name: "We Love Reading",
    category: "nonprofit",
    regionId: "middleeast",
    address: "Amman, Jordan",
  },
  {
    id: "arablit",
    name: "Arab Literacy Initiative",
    category: "nonprofit",
    regionId: "middleeast",
    address: "Dubai, United Arab Emirates",
  },
  {
    id: "kalimat",
    name: "Kalimat Foundation",
    category: "nonprofit",
    regionId: "middleeast",
    address: "P.O. Box 1421, Sharjah, United Arab Emirates",
  },
]);

// Computed properties
const allInstitutions = computed(() => {
  if (selectedCategory.value === "university") return universities.value;
  if (selectedCategory.value === "library") return libraries.value;
  if (selectedCategory.value === "nonprofit") return nonprofits.value;
  return [];
});

const filteredInstitutions = computed(() => {
  if (!selectedRegion.value || !selectedCategory.value) return [];
  return allInstitutions.value.filter(
    (inst) => inst.regionId === selectedRegion.value
  );
});

const calculateTotal = () => {
  if (formData.value.quantity && !isNaN(formData.value.quantity)) {
    const quantity = parseInt(formData.value.quantity);
    if (quantity > 0) {
      formData.value.total =
        (quantity * PRICE_PER_SET).toLocaleString() + " THB";
    } else {
      formData.value.total = "";
    }
  } else {
    formData.value.total = "";
  }
};

const watchQuantity = watch(
  () => formData.value.quantity,
  (newValue) => {
    calculateTotal();
  }
);

const isFormValid = computed(() => {
  return (
    formData.value.name &&
    formData.value.telephone &&
    selectedInstitution.value &&
    formData.value.quantity &&
    parseInt(formData.value.quantity) > 0
  );
});

// Event handlers
const onCategoryChange = () => {
  selectedRegion.value = "";
  selectedInstitution.value = "";
  institutionAddress.value = "";
  formData.value.recipientId = null;
};

const onRegionChange = () => {
  selectedInstitution.value = "";
  institutionAddress.value = "";
  formData.value.recipientId = null;
};

const onInstitutionChange = () => {
  if (selectedInstitution.value) {
    const institution = allInstitutions.value.find(
      (inst) => inst.id === selectedInstitution.value
    );
    if (institution) {
      institutionAddress.value = institution.address;
      formData.value.recipientId = institution.id;
    }
  } else {
    institutionAddress.value = "";
    formData.value.recipientId = null;
  }
};

// Import the donation store
const donationStore = useDonationStore();

// Reset form function
const resetForm = () => {
  formData.value = {
    name: "",
    address: "",
    telephone: "",
    email: "",
    message: "",
    recipientId: null,
    quantity: "",
    total: "",
  };
  selectedCategory.value = "";
  selectedRegion.value = "";
  selectedInstitution.value = "";
  institutionAddress.value = "";
};

const handleSubmit = async () => {
  // Set loading state
  loading.value = true;
  console.log("Starting donation submission process...");

  try {
    // Find selected institution
    const selectedInst = allInstitutions.value.find(
      (inst) => inst.id === selectedInstitution.value
    );
    console.log("Selected institution:", selectedInst);

    // Calculate raw total for submission
    const rawTotal = parseInt(formData.value.quantity) * PRICE_PER_SET;
    console.log("Calculated raw total:", rawTotal);

    // Create donor data object
    const donorData = {
      name: formData.value.name,
      address: formData.value.address || "",
      telephone: formData.value.telephone,
      email: formData.value.email || "",
      createdAt: serverTimestamp(),
      lastDonation: serverTimestamp(),
      totalDonations: 1, // First donation
      totalAmount: rawTotal,
    };
    console.log("Donor data prepared:", donorData);

    // Create donation data object
    const donationData = {
      name: formData.value.name,
      email: formData.value.email || "",
      telephone: formData.value.telephone,
      address: formData.value.address || "",
      recipientCategory: selectedCategory.value,
      recipientName: selectedInst?.name,
      recipientRegion: selectedRegion.value
        ? regions.value.find((r) => r.id === selectedRegion.value)?.name
        : "",
      recipientAddress: institutionAddress.value,
      recipientId: formData.value.recipientId,
      quantity: parseInt(formData.value.quantity),
      amount: rawTotal,
      formattedTotal: `${rawTotal.toLocaleString()} THB`,
      total: `${rawTotal.toLocaleString()} THB`,
      rawTotal: rawTotal,
      message: formData.value.message || "",
      pricePerSet: PRICE_PER_SET,
      status: "initiated",
      paymentStatus: "initiated",
      timestamp: serverTimestamp(),
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    };
    console.log("Donation data prepared:", donationData);

    // Use the donation store to create donor and donation
    console.log("Calling donationStore.createDonorAndDonation...");
    const result = await donationStore.createDonorAndDonation(
      donorData,
      donationData
    );
    console.log("Result from createDonorAndDonation:", result);

    if (result) {
      // Store donation data and ID in localStorage for the payment page
      localStorage.setItem("pendingDonation", JSON.stringify(donationData));
      localStorage.setItem("pendingDonationId", result.donationId);
      console.log("Donation data stored in localStorage");

      // Reset form
      resetForm();
      console.log("Form reset");

      // Redirect to payment page
      console.log("Redirecting to payment page...");
      router.push("/payment");
    } else {
      throw new Error("Failed to create donation - result was null");
    }
  } catch (error) {
    console.error("Error submitting donation:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    alert("There was an error processing your donation. Please try again.");
  } finally {
    loading.value = false;
  }
};

// ... existing code ...
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
  white-space: wrap;
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
</style>
