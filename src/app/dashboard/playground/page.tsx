// IMPORTANT: This must be the first line in your main file
require("dotenv").config();

// The package automatically uses the environment variables for authentication
const spotifyPreviewFinder = require("spotify-preview-finder");

async function example() {
  try {
    // Get preview URLs for a song (limit is optional, default is 5)
    const result = await spotifyPreviewFinder("yoru", 3);

    if (result.success) {
      result.results.forEach((song) => {
        console.log(`\nSong: ${song.name}`);
        console.log(`Spotify URL: ${song.spotifyUrl}`);
        console.log("Preview URLs:");
        song.previewUrls.forEach((url) => console.log(`- ${url}`));
      });
    } else {
      console.error("Error:", result.error);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

export default function page() {
  example();
  return <div>page</div>;
}
