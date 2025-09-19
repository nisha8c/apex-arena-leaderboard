# Apex Arena Leaderboard - Fullstack app

🔧 **Tech Stack:**
- **Frontend:** Utilized React with TypeScript, Vite, TailwindCSS (featuring glassmorphism and animations), Radix UI, Lucide Icons, and Framer Motion.
- **Backend:** Employed Express with TypeScript and the Prisma ORM.
- **Database:** Integrated Neon (serverless Postgres with pooling) for robust data storage.
- **Cache/Ranking:** Leveraged Redis (specifically Upstash, ZSET) for lightning-fast leaderboard lookups.
- **Auth & Security:** Implemented JWT-based authentication with role-based access (Admin/User).
- **Validation:** Utilized Zod for data validation.
- **Infra/Tooling:** Ensured code quality with ESLint, utilized TSX for development runtime, incorporated PostCSS, and integrated Tailwind Animate for enhanced styling.

⚡ **Key Features:**
- ✅ **Global Leaderboard:** Powered by Redis for real-time ranking updates.
- ✅ **Player Profiles:** Includes detailed stats, avatars, streaks, and achievements.
- ✅ **Admin Dashboard:** Enables player management, user bans, and score editing.
- ✅ **Authentication:** Secure login/logout mechanisms, protected routes, and admin-exclusive actions.
- ✅ **Responsive UI:** Sleek and animated design catering to both desktop and mobile users.
- ✅ **Sorting & Filters:** Allows sorting by score, games, and levels.
- ✅ **Stats Overview:** Dynamic cards showcasing totals and trends.

🏗️ **Architecture Highlights:**
- Utilized Neon Postgres for structured relational data management.
- Leveraged Redis for efficient leaderboard queries with O(log N) ranking.
- Employed React Router for seamless navigation through Leaderboard, Players, and Admin pages.
- Integrated Prisma for strict typing


<img width="1025" height="913" alt="iGame" src="https://github.com/user-attachments/assets/9d05e675-d955-4361-87bf-09344641fc4e" />


<img width="1025" height="913" alt="leaderboard" src="https://github.com/user-attachments/assets/7a24af86-c12a-4805-9bd2-a0cfc6d8e54a" />


<img width="1025" height="913" alt="player1" src="https://github.com/user-attachments/assets/dc155477-20f8-4166-8c87-c25ea13cc8a8" />


<img width="1025" height="913" alt="player2" src="https://github.com/user-attachments/assets/c29f4244-08bc-411b-a6d1-fae545c24ee0" />

<img width="1025" height="913" alt="addPlayer" src="https://github.com/user-attachments/assets/874ef9d5-4cd8-4f6d-8846-a9e5613a1154" />





# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
