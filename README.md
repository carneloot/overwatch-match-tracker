# Overwatch Match Tracker

Welcome to the Overwatch Match Tracker! This project is designed to help players track their ranked Overwatch matches, when it still had a version of ranked that didn't update your rank after every match. I mainly made this for myself, and also to learn SvelteKit. It is not ready and I will not be developing it further since the ranking system of game has been updated.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Match Tracking**: Record information for each match, including heroes played, rank,  time and which friends played the game with you.
- **Track multiple accounts**: Keep track of multiple accounts and their performance.

## Technologies Used

- **SvelteKit**: the framework used for building the application.
- **TypeScript**: for type safety and better development experience.
- **Vite**: for fast builds and hot-reloading capabilities.
- **Skeleton UI**: for a sleek and modern design.
- **Turso**: for the database.
- **Drizzle**: for connecting to the database.
- **Zod**: for data validation.

## Installation

To run the Overwatch Match Tracker locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/carneloot/overwatch-match-tracker.git
   cd overwatch-match-tracker
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` to see the app in action.

## Usage

Once the application is up and running, you can:

1. Log in using your email. In dev mode your browser will automatically redirect you using the magic link.
2. Create a new account in the accounts page. This account will be used to track your matches.
3. Start tracking your matches in the matches page, clicking on the "New Match" button.
4. Once you reach a rank update, hover over the options button on a specific game and select "Rank update"

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
