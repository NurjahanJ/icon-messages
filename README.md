# Icon Messages - ChatGPT Interface

A modern, responsive ChatGPT interface built with React and Tailwind CSS. This project provides a sleek, user-friendly interface for interacting with AI models like ChatGPT.

## Features

- **Modern UI** with sidebar navigation and clean chat interface
- **Dynamic Layout**: centered initially, bottom-aligned after first message
- **Responsive Design**: works on desktop, tablet, and mobile devices
- **Customized Styling**: rounded corners, proper spacing, and visual hierarchy
- **Message Styling**: blue user bubbles, gray AI responses with proper formatting
- **Interactive Components**: file upload, tools dropdown menu, settings panel
- **Scrollable Chat History** with proper spacing and visual cues
- **Markdown Support** for rich text formatting in AI responses
- **Code Highlighting** for code snippets in responses

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/icon-messages.git
   cd icon-messages
   ```

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
   npm start
   # or
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Technologies Used

- **React.js**: Frontend library with hooks for state management
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Icons**: Icon library for UI elements
- **OpenAI API**: For AI model integration
- **Local Storage**: For persisting chat history
- **Click-outside Detection**: For improved menu interactions

## Customization

### Changing Theme Colors

You can customize the theme colors by modifying the `tailwind.config.js` file:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Change this to your preferred primary color
        secondary: '#10B981', // Change this to your preferred secondary color
      }
    }
  }
}
```

### Adding New Features

The codebase is modular and well-organized. To add new features:

1. Create new components in the `components` directory
2. Import and use them in the appropriate parent components
3. Add any necessary state management in the relevant context providers

## Deployment

This project can be deployed on platforms like Vercel, Netlify, or GitHub Pages.

1. Connect your repository to your preferred deployment platform
2. Configure any required environment variables
3. Deploy and verify the UI functions as expected

### Vercel Deployment

```bash
npm install -g vercel
vercel login
vercel
```

### Netlify Deployment

```bash
npm install -g netlify-cli
netlify login
netlify deploy
```

## Data Export

This project includes functionality to export data from the Convex database to CSV files for analysis, backup, or reporting.

### Exporting Data to CSV

Run the following command to export all data to CSV files:

```bash
npm run export-csv
```

This will generate three files in the project root directory:
- `users.csv` - Contains user data
- `conversations.csv` - Contains conversation history
- `sustainability_interactions.csv` - Contains sustainability interaction tracking data

### CSV File Format

Each CSV file includes:
- A header row with field names
- Data rows with properly escaped values
- Timestamps in standard format

## Troubleshooting

### Common Issues

- **API Key Issues**: Ensure your API key is correctly set in the `.env` file
- **CORS Errors**: If experiencing CORS issues, consider using a proxy server
- **Styling Problems**: Clear your browser cache if styles aren't updating

### Browser Compatibility

The interface has been tested on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for the ChatGPT API
- The React and Tailwind CSS communities for excellent documentation
- All contributors who have helped improve this project
