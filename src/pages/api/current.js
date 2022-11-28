// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { get } from "request";
import asosData from "../../data/ASOS.json";

let getUrl =
  "https://mesonet.agron.iastate.edu/api/1/currents.json?networkclass=ASOS&country=US";

export async function getStaticProps() {
  // If this request throws an uncaught error, Next.js will
  // not invalidate the currently shown page and
  // retry getStaticProps on the next request.
  const res = await fetch(getUrl);
  const stations = await res.json();

  if (!res.ok) {
    // If there is a server error, you might want to
    // throw an error instead of returning so that the cache is not updated
    // until the next successful request.
    throw new Error(`Failed to fetch posts, received status ${res.status}`);
  }

  // If the request was successful, return the posts
  // and revalidate every 10 seconds.
  return {
    props: {
      stations,
    },
    //revalidate every hour
    revalidate: 3600,
  };
}
console.log(props);
