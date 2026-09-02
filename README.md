
# MTG Timeline
Automated data pipeline and visual timeline for Magic: The Gathering (MTG) releases and events.
## Overview
MTG Timeline is a web application built with React, TypeScript, Vite, and Tailwind CSS. It fetches data about MTG sets from the Scryfall API and recent announcements from the MTGGoldfish RSS feed, aggregating them into a single chronological timeline.
## Features
- **Automated Data Fetching**: Includes a Node.js script to pull the latest set data from Scryfall (filtering by types like core, expansion, commander) and news from MTGGoldfish.
- **Interactive Timeline**: A horizontal scrolling timeline displaying sets in chronological order, with a clear "TODAY" marker to distinguish past and future releases.
- **Search Functionality**: Quickly filter sets by name or release year.
- **Details Drawer**: Click on a set node to view more details like set code, card count, and set type.
- **Responsive Design**: Built with Tailwind CSS to ensure a great experience on different screen sizes.
## Project Structure
- `scripts/fetch-mtg.js`: Node script for data fetching and aggregation. Run via `npm run build:data`.
- `src/`: React source code containing components (`App`, `TimelineNode`, `Hero`, `Drawer`) and custom hooks.
- `public/data/`: Where the `events.json` data is generated and served from.
## Available Scripts
In the project directory, you can run:
- `npm run dev`: Runs the app in the development mode using Vite.
- `npm run build:data`: Executes the data pipeline script to fetch the latest MTG events and saves them to `public/data/events.json`.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run preview`: Locally preview the production build.
## Data Sources
- [Scryfall API](https://scryfall.com/docs/api)
- [MTGGoldfish RSS](https://www.mtggoldfish.com/feed)
## Technologies Used
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (for icons)
