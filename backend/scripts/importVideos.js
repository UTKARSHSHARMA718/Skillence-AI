const path = require("path");
const xlsx = require("xlsx");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function parseSubtopics(subtopicRaw) {
  if (!subtopicRaw) return [];

  // If already array (rare case)
  if (Array.isArray(subtopicRaw)) {
    return subtopicRaw;
  }

  if (typeof subtopicRaw === "string") {
    try {
      // Convert single quotes to double quotes to make valid JSON
      const cleaned = subtopicRaw.replace(/'/g, '"');
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn("Could not parse subtopics, storing as single string.");
      return [subtopicRaw.trim()];
    }
  }

  return [];
}

async function importVideos(filePath) {
  try {
    const workbook = xlsx.readFile(path.resolve(filePath));
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = xlsx.utils.sheet_to_json(sheet);

    for (const row of rows) {
      const title = row["Title"];
      const url = row["URL"];
      const min = Number(row["Min"]) || 0;
      const subtopicRaw = row["subtopic"];

      if (!title || !url) {
        console.log("Skipping row due to missing title/url");
        continue;
      }

      const durationInSeconds = min * 60;

      const topics = parseSubtopics(subtopicRaw);

      await prisma.videosMetadata.create({
        data: {
          title,
          url,
          duration: durationInSeconds,
          topics,
        },
      });

      console.log(`Inserted: ${title}`);
    }

    console.log("✅ Import completed successfully");
  } catch (error) {
    console.error("❌ Error importing file:", error);
  } finally {
    await prisma.$disconnect();
  }
}

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage:");
  console.error("node importVideos.js ./yourfile.xlsx");
  process.exit(1);
}

importVideos(filePath);

/**
 * 
 * Command to run the script: node scripts/importVideos.js <File_PATH>
 * 
 * Update following title in database:
 * title: "Key Terms" to svelte
 */