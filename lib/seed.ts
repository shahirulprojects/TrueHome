import { ID } from "react-native-appwrite";
import { databases, config } from "./appwrite";
import {
  agentImages,
  galleryImages,
  propertiesImages,
  reviewImages,
} from "./data";
// defining the collection IDs for agents, reviews, galleries, and properties using the configuration
const COLLECTIONS = {
  AGENT: config.agentsCollectionId,
  REVIEWS: config.reviewsCollectionId,
  GALLERY: config.galleriesCollectionId,
  PROPERTY: config.propertiesCollectionId,
};

// listing the various property types available for seeding
const propertyTypes = [
  "House",
  "Townhouse",
  "Condo",
  "Duplex",
  "Studio",
  "Villa",
  "Apartment",
  "Other",
];

// specifying the facilities that can be associated with properties
const facilities = ["Laundry", "Parking", "Gym", "Wifi", "Pet-friendly"];

// function to get a random subset of items from an array within specified limits
function getRandomSubset<T>(
  array: T[],
  minItems: number,
  maxItems: number
): T[] {
  // validating that the minimum number of items is not greater than the maximum
  if (minItems > maxItems) {
    throw new Error("minItems cannot be greater than maxItems");
  }
  // ensuring the provided limits are within the valid range of the array
  if (minItems < 0 || maxItems > array.length) {
    throw new Error(
      "minItems or maxItems are out of valid range for the array"
    );
  }

  // generating a random size for the subset within the specified range
  const subsetSize =
    Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

  // creating a copy of the array to prevent modifications to the original
  const arrayCopy = [...array];

  // shuffling the array copy using the Fisher-Yates algorithm for randomness
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[randomIndex]] = [
      arrayCopy[randomIndex],
      arrayCopy[i],
    ];
  }

  // returning the first `subsetSize` elements from the shuffled array
  return arrayCopy.slice(0, subsetSize);
}

// main function to seed the database with initial data
async function seed() {
  try {
    // clearing existing data from all defined collections to start fresh
    for (const key in COLLECTIONS) {
      const collectionId = COLLECTIONS[key as keyof typeof COLLECTIONS];
      const documents = await databases.listDocuments(
        config.databaseId!,
        collectionId!
      );
      // deleting each document in the collection
      for (const doc of documents.documents) {
        await databases.deleteDocument(
          config.databaseId!,
          collectionId!,
          doc.$id
        );
      }
    }

    console.log("Cleared all existing data.");

    // seeding agents into the database
    const agents = [];
    for (let i = 1; i <= 5; i++) {
      const agent = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.AGENT!,
        ID.unique(),
        {
          name: `Agent ${i}`,
          email: `agent${i}@example.com`,
          avatar: agentImages[Math.floor(Math.random() * agentImages.length)],
        }
      );
      agents.push(agent);
    }
    console.log(`Seeded ${agents.length} agents.`);

    // seeding reviews into the database
    const reviews = [];
    for (let i = 1; i <= 20; i++) {
      const review = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.REVIEWS!,
        ID.unique(),
        {
          name: `Reviewer ${i}`,
          avatar: reviewImages[Math.floor(Math.random() * reviewImages.length)],
          review: `This is a review by Reviewer ${i}.`,
          rating: Math.floor(Math.random() * 5) + 1, // generating a random rating between 1 and 5
        }
      );
      reviews.push(review);
    }
    console.log(`Seeded ${reviews.length} reviews.`);

    // seeding galleries with images into the database
    const galleries = [];
    for (const image of galleryImages) {
      const gallery = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.GALLERY!,
        ID.unique(),
        { image }
      );
      galleries.push(gallery);
    }

    console.log(`Seeded ${galleries.length} galleries.`);

    // seeding properties into the database
    for (let i = 1; i <= 20; i++) {
      const assignedAgent = agents[Math.floor(Math.random() * agents.length)];

      // assigning a random subset of reviews and galleries to the property
      const assignedReviews = getRandomSubset(reviews, 5, 7); // selecting between 5 to 7 reviews
      const assignedGalleries = getRandomSubset(galleries, 3, 8); // selecting between 3 to 8 galleries

      // randomly selecting facilities for the property
      const selectedFacilities = facilities
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * facilities.length) + 1);

      // determining the image for the property based on available images
      const image =
        propertiesImages.length - 1 >= i
          ? propertiesImages[i]
          : propertiesImages[
              Math.floor(Math.random() * propertiesImages.length)
            ];

      // creating a new property document in the database
      const property = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.PROPERTY!,
        ID.unique(),
        {
          name: `Property ${i}`,
          type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
          description: `This is the description for Property ${i}.`,
          address: `123 Property Street, City ${i}`,
          geolocation: `192.168.1.${i}, 192.168.1.${i}`,
          price: Math.floor(Math.random() * 9000) + 1000,
          area: Math.floor(Math.random() * 3000) + 500,
          bedrooms: Math.floor(Math.random() * 5) + 1,
          bathrooms: Math.floor(Math.random() * 5) + 1,
          rating: Math.floor(Math.random() * 5) + 1,
          facilities: selectedFacilities,
          image: image,
          agent: assignedAgent.$id,
          reviews: assignedReviews.map((review) => review.$id),
          gallery: assignedGalleries.map((gallery) => gallery.$id),
        }
      );

      console.log(`Seeded property: ${property.name}`);
    }

    console.log("Data seeding completed.");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

export default seed;
