import { google } from "googleapis";
import { readFileSync, writeFileSync } from "fs";
import { csvFormat } from "d3-dsv";

const config = JSON.parse(readFileSync("./config.json"));
const spreadsheetId = config.fetch.sheets.id;
const sheetId = config.fetch.sheets.sheetId;
const output = config.fetch.sheets.output;
const keyFile = config.fetch.sheets.auth;

const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheet = google.sheets({ version: "v4", auth });

const parse = res => {
  const csv = Array();

  const data = res.data.values;
  const headers = data.shift().map(h => h.trim());

  const headerToValue = (d, i) => [headers[i], d];

  data.forEach(row => {
    csv.push(Object.fromEntries(row.map(headerToValue)));
  });

  return csvFormat(csv, headers);
};

async function main() {
  const gidQ = await sheet.spreadsheets.getByDataFilter({
    spreadsheetId: spreadsheetId,
    fields: "sheets(properties(title))",
    requestBody: { dataFilters: [{ gridRange: { sheetId: sheetId } }] }
  });

  const nameQ = await sheet.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: `'${gidQ.data.sheets.pop().properties.title}'`
  });

  const csv = parse(nameQ);
  writeFileSync(output, csv);
}

main();