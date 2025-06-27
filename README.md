# ChatGPT Interface
A modern, responsive ChatGPT interface built with React and Tailwind CSS.

## Features

- Modern UI with sidebar navigation and clean chat interface
- Dynamic layout: centered initially, bottom-aligned after first message
- Customized styling with rounded corners and proper spacing
- Message styling: blue user bubbles, gray AI responses
- Interactive components: file upload, tools dropdown menu
- Scrollable chat history with proper spacing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up your API key:
   - Create a `.env` file in the root directory
   - Add your OpenAI API key to the `.env` file (see `.env.example` for format)
   - Never commit your `.env` file to version control

```
# In your .env file
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Technologies Used

- React.js with hooks for state management
- Tailwind CSS for styling
- Click-outside detection for menus

## Deployment

This project can be deployed on platforms like Vercel or Netlify.

1. Connect your repository to your preferred deployment platform
2. Configure any required environment variables
3. Deploy and verify the UI functions as expected
