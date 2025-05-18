# Spotify Data Visualizer

Spotify Data Visualizer is a web application built with [Next.js](https://nextjs.org) that allows users to explore insights about their Spotify listening habits. Users can view their top artists, tracks, genres, and recently played songs in a visually appealing and interactive way.

## Features

- **Top Artists**: View your most listened-to artists in a carousel format.
- **Top Tracks**: Explore your favorite tracks with detailed information.
- **Top Genres**: Discover your top genres displayed as a graph.
- **Recently Played**: See your recently played tracks with timestamps.
- **Dark Mode**: Toggle between light and dark themes.
- **Responsive Design**: Fully responsive and optimized for all devices.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org), [React](https://reactjs.org), [Tailwind CSS](https://tailwindcss.com)
- **Authentication**: [NextAuth.js](https://next-auth.js.org) with Spotify OAuth
- **Icons**: [Lucide Icons](https://lucide.dev)

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Spotify Developer Account ([Create an app](https://developer.spotify.com/dashboard/applications))

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/spotify-data-visualizer.git
   cd spotify-data-visualizer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Sign in with your Spotify account.
2. Explore your top artists, tracks, genres, and recently played songs.
3. Toggle between light and dark themes using the mode toggle.

## Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth configuration
│   ├── dashboard/                       # Dashboard page
│   ├── layout.tsx                       # Root layout
│   ├── globals.css                      # Global styles
├── components/                          # Reusable UI components
├── lib/                                 # Utility and helper functions
├── hooks/                               # Custom React hooks
```

## Deployment

The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com). Follow the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [NextAuth.js](https://next-auth.js.org)
