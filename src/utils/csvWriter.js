const fs = require("fs");
const path = require("path");

function writeCSV(filename, rows) {
  if (!rows || !rows.length) return;

  const headers = Object.keys(rows[0]);

  const csv = [
    headers.join(","), // header row
    ...rows.map((row) =>
      headers.map((h) => `"${(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const outputPath = path.join("output", filename);
  fs.mkdirSync("output", { recursive: true });
  fs.writeFileSync(outputPath, csv);

  console.log(`CSV saved to ${outputPath}`);
}

module.exports = { writeCSV };
