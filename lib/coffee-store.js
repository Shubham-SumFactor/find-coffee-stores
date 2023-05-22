import { createApi } from 'unsplash-js';
//import nodeFetch from 'node-fetch';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_API_KEY,
  
});


const getUrlForCoffeeStores = (latLong, query, limit) =>{
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`
}

const getListOfCoffeeStoresPhotos = async () => {

  const photos= await unsplash.search.getPhotos({
    query: 'coffee shop',
   page: 1,
    perPage: 30,

  });
  const unsplashResults = photos.response.results;
  
  return unsplashResults.map((result) => result.urls["small"]);
}

export const fetchCoffeeStores = async (latLong="43.66648830062341%2C-79.41309107123831", limit=6) => {
  const photos = await getListOfCoffeeStoresPhotos();
  
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
        },
      };
      
      const response = await fetch(getUrlForCoffeeStores(latLong,"coffee", limit ), options);
      
      const data = await response.json();
      return data.results.map((result, idx) =>{
          return {
            id: result.fsq_id,
            name: result.name,
            address: result.location.address,
            formatted_address: result.location.formatted_address,
            imgUrl: photos.length > 0 ? photos[idx] : null,
          };
      });
     
       // .catch(err => console.error(err));
};