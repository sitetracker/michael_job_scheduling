// import axios from 'axios';
//
// const GEOAPIFY_API_KEY = 'ff9c233e5bd04c43877288681d51331f';
//
// // Function to calculate the route between two locations
// async function calculateRoute(start: { lat: number; lon: number }, end: { lat: number; lon: number }) {
//     try {
//         const response = await axios.get('https://api.geoapify.com/v1/routing', {
//             params: {
//                 waypoints: `${start.lat},${start.lon}|${end.lat},${end.lon}`, // Coordinates for start and end points
//                 mode: 'drive', // Mode of transportation: 'drive', 'walk', 'bicycle', etc.
//                 apiKey: GEOAPIFY_API_KEY,
//             },
//         });
//
//         const route = response.data;
//         console.log('Route details:', route);
//         return route;
//     } catch (error) {
//         console.error('Error fetching route:', error);
//     }
// }
//
// // Example usage
// const startLocation = { lat: 40.730610, lon: -73.935242 }; // New York City
// const endLocation = { lat: 40.712776, lon: -74.005974 }; // Lower Manhattan
//
// calculateRoute(startLocation, endLocation);
