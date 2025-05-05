import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read existing data
const combinedDataPath = path.join(__dirname, "../data/combined-data.json");
const combinedData = JSON.parse(fs.readFileSync(combinedDataPath, "utf8"));

// Configuration for generating recipients
const TOTAL_RECIPIENTS = 3000; // Total recipients to have in dataset
const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

// Categories, regions, and countries for random assignment
const categories = [
  "university",
  "library",
  "nonprofit",
  "templechurch",
  "culturecenter",
  "other",
];
const regionCountries = {
  africa: [
    "South Africa",
    "Kenya",
    "Nigeria",
    "Egypt",
    "Morocco",
    "Ghana",
    "Ethiopia",
  ],
  asia: [
    "China",
    "Japan",
    "India",
    "Thailand",
    "Vietnam",
    "Singapore",
    "South Korea",
    "Indonesia",
  ],
  europe: [
    "United Kingdom",
    "France",
    "Germany",
    "Italy",
    "Spain",
    "Sweden",
    "Netherlands",
    "Switzerland",
  ],
  northamerica: ["United States", "Canada", "Mexico"],
  southamerica: ["Brazil", "Argentina", "Chile", "Peru", "Colombia"],
  oceania: ["Australia", "New Zealand", "Fiji"],
};

// Get regions and existing recipients
const { regions, recipients } = combinedData;
const existingCount = recipients.length;
const neededCount = Math.max(0, TOTAL_RECIPIENTS - existingCount);

console.log(`Existing recipients: ${existingCount}`);
console.log(`Generating ${neededCount} additional recipients...`);

// Generate a random string for IDs
function generateRandomId(length = 8) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
}

// Generate a new batch of recipients
const newRecipients = [];

for (let i = 0; i < neededCount; i++) {
  // Select random region and country
  const regionId = regions[Math.floor(Math.random() * regions.length)].id;
  const countries = regionCountries[regionId];
  const country = countries[Math.floor(Math.random() * countries.length)];

  // Select random category
  const category = categories[Math.floor(Math.random() * categories.length)];

  // Create a name based on the category and region
  const categoryNames = {
    university: ["University", "College", "Institute", "Academy"],
    library: ["Library", "Archive", "Collection", "Repository"],
    nonprofit: ["Foundation", "Trust", "Association", "Society"],
    templechurch: ["Temple", "Church", "Cathedral", "Shrine", "Monastery"],
    culturecenter: ["Cultural Center", "Museum", "Gallery", "Arts Center"],
    other: ["Organization", "Center", "Institution", "Group"],
  };

  const nameType =
    categoryNames[category][
      Math.floor(Math.random() * categoryNames[category].length)
    ];
  const cityNames = {
    africa: [
      "Cairo",
      "Cape Town",
      "Nairobi",
      "Lagos",
      "Accra",
      "Johannesburg",
      "Addis Ababa",
    ],
    asia: [
      "Tokyo",
      "Beijing",
      "Mumbai",
      "Bangkok",
      "Hanoi",
      "Singapore",
      "Seoul",
      "Jakarta",
    ],
    europe: [
      "London",
      "Paris",
      "Berlin",
      "Rome",
      "Madrid",
      "Stockholm",
      "Amsterdam",
      "Zurich",
    ],
    northamerica: [
      "New York",
      "Los Angeles",
      "Chicago",
      "Toronto",
      "Mexico City",
      "Boston",
      "San Francisco",
    ],
    southamerica: ["Sao Paulo", "Buenos Aires", "Santiago", "Lima", "Bogota"],
    oceania: ["Sydney", "Melbourne", "Auckland", "Brisbane", "Perth"],
  };

  const city =
    cityNames[regionId][Math.floor(Math.random() * cityNames[regionId].length)];
  const adjectives = [
    "National",
    "Central",
    "International",
    "Metropolitan",
    "Regional",
    "Global",
    "Local",
    "Community",
  ];
  const adj =
    Math.random() > 0.5
      ? `${adjectives[Math.floor(Math.random() * adjectives.length)]} `
      : "";

  const name = `${city} ${adj}${nameType}`;

  // Create address
  const streetNumber = Math.floor(Math.random() * 1000) + 1;
  const streetNames = [
    "Main St",
    "Park Ave",
    "Oak Road",
    "Maple Lane",
    "Center Blvd",
    "University Drive",
    "High Street",
  ];
  const street = streetNames[Math.floor(Math.random() * streetNames.length)];
  const postalCode = `${Math.floor(Math.random() * 90000) + 10000}`;

  const address = `${streetNumber} ${street}, ${city}, ${country}, ${postalCode}`;

  // Create new recipient
  const newRecipient = {
    id: `generated-${generateRandomId()}`,
    name,
    category,
    regionId,
    address,
    country,
  };

  newRecipients.push(newRecipient);

  // Log progress for every 500 recipients
  if ((i + 1) % 500 === 0) {
    console.log(`Generated ${i + 1} of ${neededCount} recipients`);
  }
}

// Add new recipients to the existing ones
combinedData.recipients = [...recipients, ...newRecipients];

// Write the updated data back to the file
fs.writeFileSync(combinedDataPath, JSON.stringify(combinedData, null, 2));

console.log(
  `Done! Total recipients in dataset: ${combinedData.recipients.length}`
);
console.log(`Updated file: ${combinedDataPath}`);
