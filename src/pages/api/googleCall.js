import { google } from "googleapis";
import urls from "../../data/codeurls.json";

export default async function handler(req, res) {
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
        spreadsheetId: "1-U5JvmFbN_zhqWRGtDTkXsHzFBoZouM_dAMFJ1Hewy0",
        ranges: [
          "KMGW!A3:N14",
          "KDAY!A3:N14",
          "KGJT!A3:N14",
          "KEYW!A3:N14",
          "KFMN!A3:N14",
          "KMDH!A3:N14",
          "KPNE!A3:N14",
          "KITR!A3:N14",
          "KAVL!A3:N14",
          "KTTD!A3:N14",
          "KROW!A3:N14",
          "KSJT!A3:N14",
          "KILM!A3:N14",
          "KJBR!A3:N14",
          "KATL!A3:N14",
          "KOMA!A3:N14",
          "PHOG!A3:N14",
          "KFAT!A3:N14",
          "KYKM!A3:N14",
          "KCNK!A3:N14",
          "KCHS!A3:N14",
          "KUGN!A3:N14",
          "KDET!A3:N14",
          "KSNY!A3:N14",
          "KGED!A3:N14",
          "KABI!A3:N14",
          "KMIA!A3:N14",
          "KBOI!A3:N14",
          "KSFO!A3:N14",
          "PAFA!A3:N14",
          "KAMA!A3:N14",
          "KRIC!A3:N14",
          "KSUX!A3:N14",
          "KLAS!A3:N14",
          "KTPH!A3:N14",
          "KSBN!A3:N14",
          "KMCN!A3:N14",
          "KBPI!A3:N14",
          "KDLH!A3:N14",
          "PANC!A3:N14",
          "KLWV!A3:N14",
          "KCEW!A3:N14",
          "KMOT!A3:N14",
          "KFSD!A3:N14",
          "KAUG!A3:N14",
          "KMCB!A3:N14",
          "PHNL!A3:N14",
          "KABQ!A3:N14",
          "KLFT!A3:N14",
          "KCVG!A3:N14",
          "KSAC!A3:N14",
          "KFAR!A3:N14",
          "KTOP!A3:N14",
          "KMHT!A3:N14",
          "KIMT!A3:N14",
          "KLLQ!A3:N14",
          "KORF!A3:N14",
          "KGMU!A3:N14",
          "KILG!A3:N14",
          "KRDU!A3:N14",
          "KJEF!A3:N14",
          "KCDC!A3:N14",
          "KOSU!A3:N14",
          "KTTN!A3:N14",
          "KMDW!A3:N14",
          "KCLT!A3:N14",
          "KMKG!A3:N14",
          "KBTV!A3:N14",
          "KVGT!A3:N14",
          "KLGU!A3:N14",
          "KFWN!A3:N14",
          "KEUG!A3:N14",
          "KHGR!A3:N14",
          "KBWI!A3:N14",
          "KLND!A3:N14",
          "KDHN!A3:N14",
          "KHLN!A3:N14",
          "KTYS!A3:N14",
          "KLAX!A3:N14",
          "KPUB!A3:N14",
          "KLBF!A3:N14",
          "KSIY!A3:N14",
          "KBLH!A3:N14",
          "KDXR!A3:N14",
          "KPLN!A3:N14",
          "KRDM!A3:N14",
          "KPIE!A3:N14",
          "KGSF!A3:N14",
          "KBIV!A3:N14",
          "KLOZ!A3:N14",
          "KGLR!A3:N14",
          "KCPR!A3:N14",
          "KBFF!A3:N14",
          "KVPZ!A3:N14",
          "KCHA!A3:N14",
          "KPVD!A3:N14",
          "KRNO!A3:N14",
          "KPQL!A3:N14",
          "KFST!A3:N14",
          "KSAT!A3:N14",
          "KRAP!A3:N14",
          "KTOL!A3:N14",
          "KALB!A3:N14",
          "KEAU!A3:N14",
          "KBKL!A3:N14",
          "KGON!A3:N14",
          "KELP!A3:N14",
          "KORD!A3:N14",
          "KRST!A3:N14",
          "KBWG!A3:N14",
          "KDDC!A3:N14",
          "KTWF!A3:N14",
          "KLIT!A3:N14",
          "KBFI!A3:N14",
          "KEVV!A3:N14",
          "PADQ!A3:N14",
          "KTUS!A3:N14",
          "KGEY!A3:N14",
          "KGLH!A3:N14",
          "KBIL!A3:N14",
          "KSFF!A3:N14",
          "KMKE!A3:N14",
          "KSYR!A3:N14",
          "PHTO!A3:N14",
          "KHKS!A3:N14",
          "PAOM!A3:N14",
          "KBML!A3:N14",
          "KGRB!A3:N14",
          "KDFW!A3:N14",
          "KMSN!A3:N14",
          "KBUF!A3:N14",
          "KDSM!A3:N14",
          "KICT!A3:N14",
          "KLUK!A3:N14",
          "KEKO!A3:N14",
          "KFWA!A3:N14",
          "KGFK!A3:N14",
          "KCYS!A3:N14",
          "KFOK!A3:N14",
          "KABY!A3:N14",
          "KSLE!A3:N14",
          "KPWK!A3:N14",
          "KBNA!A3:N14",
          "KSBA!A3:N14",
          "KMLC!A3:N14",
          "KMOB!A3:N14",
          "KSJC!A3:N14",
          "KWAL!A3:N14",
          "KRAC!A3:N14",
          "KBIS!A3:N14",
          "KMKC!A3:N14",
          "KIDA!A3:N14",
          "KMSP!A3:N14",
          "KSBM!A3:N14",
          "KTUL!A3:N14",
          "KDEC!A3:N14",
          "KMIV!A3:N14",
          "KGRD!A3:N14",
          "KPIT!A3:N14",
          "KOWD!A3:N14",
          "KSBY!A3:N14",
          "KSLC!A3:N14",
          "KSHV!A3:N14",
          "KFLG!A3:N14",
          "KLCH!A3:N14",
          "KASD!A3:N14",
          "KLWM!A3:N14",
          "KDEN!A3:N14",
          "KROA!A3:N14",
          "KBHM!A3:N14",
          "KMRB!A3:N14",
          "KERI!A3:N14",
          "KBCE!A3:N14",
          "KXNA!A3:N14",
          "KGNV!A3:N14",
          "KBEH!A3:N14",
        ],
        majorDimension: "COLUMNS",
      };

      const data = await gsapi.spreadsheets.values.batchGet(opt);
      //console.log(data.data);
      return res
        .status(200)
        .send(JSON.stringify({ error: false, data: data.data }));
    });
  } catch (e) {
    return res
      .status(400)
      .send(JSON.stringify({ error: true, message: e.message }));
  }
}
