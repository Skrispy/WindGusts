import Head from "next/head";
import Map from "../components/Map";
import styles from "../../styles/Home.module.css";
//pull in Asos stations
import asosData from "../data/ASOS.json";

const DEFAULT_CENTER = [43.04005521649368, -87.90036438958596];

export default function Home(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Wind Gust Mapping</title>
        <link rel="icon" href="/wind.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Wind Gust Mapping</h1>

        <p className={styles.description}>
          Interact with a location to explore the wind gusts{" "}
        </p>

        <Map className={styles.homeMap} center={DEFAULT_CENTER} zoom={2}>
          {({ TileLayer, Marker, Popup, Tooltip }) => (
            <>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {props.asosStations.map((station) => (
                <Marker
                  key={station.station}
                  position={[station.lat, station.lon]}
                >
                  <Tooltip>
                    [{station.lat}, {station.lon}] {station.name},
                    {station.station} <br /> Current Wind Speed: {station.sknt}{" "}
                    kts.
                    <br /> Current Gust Speed: {station.gustFactor} kts.
                  </Tooltip>
                  <Popup>
                    <embed
                      src={"/pdf/" + station.raw.substring(0, 4) + ".pdf"}
                      type="application/pdf"
                    />
                  </Popup>
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

  //testing
  //console.log(codes);

  function isStation(x) {
    let rawCode = x.raw.substring(0, 4);
    return codes.includes(rawCode);
  }
  //Filter out stations from data
  let asosStations = stations.data.filter(isStation);
  (async function () {
    for (const element of asosStations) {
      if (element.station.length < 4) {
        element.station = "K" + element.station;
      }
      console.log(element.sknt);
      if (element.sknt === null) {
        element.sknt = 0;
      }
      if (element.drct === null) {
        element.drct = 0;
      }
      const sheetRes = await fetch(
        `http://localhost:3000/api/processWindSpeed?speed=${element.sknt}&degree=${element.drct}&code=${element.station}`
      );
      const gustFactor = await sheetRes.json();
      const [[gf]] = gustFactor.data;
      console.log(gf);
      element.gustFactor = gf;
      console.log(element.gustFactor);
    }
  })();

  return {
    props: {
      asosStations,
    },
    //revalidate every hour
    revalidate: 3600,
  };
}
