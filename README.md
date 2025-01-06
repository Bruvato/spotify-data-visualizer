![alt text](https://github.com/Bruvato/spotify-data-visualizer/blob/master/src/images/test.png)

---

# Spotify Data Visualizer

Spotify Data Visualizer is a web app that lets you explore your Spotify stats. Generate insights about your top artists, tracks, and genres.

---

## Features

- **View Your Spotify Stats:**  
  Discover your top artists, favorite tracks, and most-played genres.

- **Interactive Visualizations:**  
  Graphs and charts to represent your listening habits.

---

## Tools Used

- **Frontend:** React, TailwindCSS  
- **Spotify API:** Fetching user data  
- **Authentication:** OAuth 2.0 with PKCE Flow  
- **Data Visualization:** D3.js  

---

## Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/spotify-data-visualizer.git
   ```
2. Navigate to the project directory:  
   ```bash
   cd spotify-data-visualizer
   ```
3. Install dependencies:  
   ```bash
   npm install
   ```
4. Set up environment variables:  
   Create a `.env` file in the root directory and add the following:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   ```
5. Start the development server:  
   ```bash
   npm run dev
   ```

---

## Usage

1. Visit the app in your browser at `http://localhost:5173`.  
2. Log in with your Spotify account to authorize the app.  

---

## API Reference

- **Spotify Web API:**  
  - [Authorization Code Flow](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/)  
  - [Get Top Artists and Tracks](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks)  

---
