import Head from "next/head";
import Map from "../components/Map";
import styles from "../../styles/Home.module.css";
import { useEffect, useState } from "react";
//pull in Asos stations
import asosData from "../data/ASOS.json";
import _ from "lodash";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
//import PdfViewer from "../components/PdfViewer";

if (typeof Highcharts === "object") {
  HighchartsMore(Highcharts);
}

const DEFAULT_CENTER = [43.04005521649368, -87.90036438958596];

export default function Home(props) {
  const [showPdf, setShowPdf] = useState(false);
  //console.log(props.finals);
  return (
    <div>
      <Head>
        <title>Wind Gust Mapping</title>
        <link rel="icon" href="/wind.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Accurate Wind Gust Calculator</h1>

        <p className={styles.description}>
          Interact with a weather station to view a max wind gust and see how it
          is calculated{" "}
        </p>

        <Map className={styles.homeMap} center={DEFAULT_CENTER} zoom={2}>
          {({ TileLayer, Marker, Popup, Tooltip }) => (
            <>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />

              {props.finals.map((station) => (
                <Marker
                  key={station.station}
                  position={[station.lat, station.lon]}
                >
                  <Tooltip>
                    {station.name}, {station.state}
                    <br />
                    Station Code: {station.station}
                    <br /> Current Wind Speed: {station.sknt} kts.
                    <br /> Current Gust Speed: {station.gustSpeed} kts.
                    <br /> Current Gust Direction: {station.drct} deg.
                  </Tooltip>
                  <Popup className={styles.popup}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={{
                        chart: {
                          polar: true,
                        },

                        title: {
                          text: station.station,
                        },

                        subtitle: {
                          text: `Calculated gust factor for ${station.name}`,
                        },

                        pane: {
                          startAngle: 0,
                          endAngle: 360,
                        },

                        xAxis: {
                          tickInterval: 30,
                          min: 0,
                          max: 360,
                          labels: {
                            format: "{value}°",
                          },
                        },

                        yAxis: {
                          min: 0,
                          max: 20,
                          tickInterval: 5,
                          title: {
                            text: "Wind Speed",
                          },
                        },

                        plotOptions: {
                          series: {
                            pointStart: 0,
                            pointInterval: 45,
                          },
                          column: {
                            pointPadding: 0,
                            groupPadding: 0,
                          },
                        },

                        series: [
                          {
                            name: `Gust Factor at ${station.station} `,
                            data: [
                              {
                                name: station.gustFactor,
                                y: station.sknt,
                                x: station.drct,
                              },
                            ],
                          },
                        ],
                      }}
                    ></HighchartsReact>
                  </Popup>
                  {
                    //To build a PDF Modal
                    /* <PdfViewer
                      pdf={"/pdf/" + station.raw.substring(0, 4) + ".pdf"}
                      onCancel={() => setShowPdf(false)}
                      visible={showPdf}
                    />
                    <Button
                      onClick={() => setShowPdf(!showPdf)}
                    >{`View Original PDF`}</Button>
                  */
                  }
                </Marker>
              ))}
            </>
          )}
        </Map>
      </main>
    </div>
  );
}

let weatherUrl =
  "https://mesonet.agron.iastate.edu/api/1/currents.json?networkclass=ASOS&country=US";

let codes = asosData.map((x) => x.code);

export async function getStaticProps() {
  // If this request throws an uncaught error, Next.js will
  // not invalidate the currently shown page and
  // retry getStaticProps on the next request.
  const weatherRes = await fetch(weatherUrl);
  const stations = await weatherRes.json();

  if (!weatherRes.ok) {
    // If there is a server error, you might want to
    // throw an error instead of returning so that the cache is not updated
    // until the next successful request.
    throw new Error(
      `Failed to fetch posts, received status ${weatherRes.status}`
    );
  }

  //Google Call
  const gRes = await fetch(`http://localhost:3000/api/googleCall`);
  const gData = await gRes.json();
  console.log(gData.data.valueRanges.length);
  //testing
  //console.log(codes.length); 178

  function isStation(x) {
    let rawCode = x.raw.substring(0, 4);
    return codes.includes(rawCode);
  }
  //Filter out stations from data

  let asosStations = stations.data.filter(isStation);
  // const gDataArr = Object.entries(gData.data.valueRanges);
  // console.log(gDataArr);
  // console.log(typeof gDataArr);

  console.log(typeof asosStations);

  const finals = await Promise.all(
    asosStations.map(async (element) => {
      if (element.station.length < 4) {
        element.station = "K" + element.station;
      }
      if (element.sknt === null) {
        element.sknt = 0;
      }
      if (element.drct === null) {
        element.drct = 0;
      }

      const ws = processWS(element.sknt, element.drct);
      //console.log(processRes);
      const row = ws.row;
      const col = ws.col;
      let gf = -1;
      await gData.data.valueRanges.forEach((point) => {
        const name = point.range.substring(0, 4);
        //console.log("name : " +name + "element.station :" + element.station);
        if (name === element.station) {
          gf = point.values[col][row];
        }
      });
      element.gustFactor = parseFloat(gf);
      element.gustSpeed = element.sknt * element.gustFactor;
      return element;
    })
  );
  //console.log(finals);

  return {
    props: {
      finals,
    },
  };
}

export function processWS(speed, degree) {
  try {
    let col;
    let row;
    if (speed <= 5) {
      col = 2;
    } else if (speed > 5 && speed <= 10) {
      col = 5;
    } else if (speed > 10 && speed <= 15) {
      col = 8;
    } else {
      col = 11;
    }
    if (degree === 0) {
      row = 0;
    } else {
      row = Math.floor((degree - 1) / 30);
    }
    const gustFactor = {
      row: row,
      col: col,
    };
    return gustFactor;
  } catch (error) {
    return error;
  }
}
