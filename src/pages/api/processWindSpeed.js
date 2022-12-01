import { google } from "googleapis";
import urls from "../../data/codeurls.json";

export default async function handler(req, res) {
  const { speed, degree, code } = req.query;
  const link = urls[code];
  console.log(speed, degree, code);
  console.log(link);
  let col;
  let row;
  if (speed <= 5) {
    col = "C";
  } else if (speed > 5 && speed <= 10) {
    col = "F";
  } else if (speed > 10 && speed <= 15) {
    col = "I";
  } else {
    col = "L";
  }
  if (degree == 0) {
    row = 3;
  } else {
    row = Math.floor((degree - 1) / 30) + 3;
  }
  console.log("Row", row);
  console.log("col", col);
  //auth
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const client = await auth.getClient();
    client.authorize(async function (err, tokens) {
      if (err) {
        return res.status(400).send(JSON.stringify({ error: true }));
      }
      const gsapi = google.sheets({ version: "v4", auth: client });

      //Actual Call
      const opt = {
        spreadsheetId: link,
        range: `${code}!${col}${row}`,
      };

      const data = await gsapi.spreadsheets.values.get(opt);

      return res
        .status(200)
        .send(JSON.stringify({ error: false, data: data.data.values }));
    });
  } catch (e) {
    return res
      .status(400)
      .send(JSON.stringify({ error: true, message: e.message }));
  }
}
