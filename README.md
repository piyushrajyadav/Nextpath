# CareerGuide - AI-Powered Career Guidance Platform

CareerGuide is a modern web application that helps users find the best career options based on their qualifications, marks, interests, skills, and financial condition. The platform uses Google's Gemini AI to provide personalized career recommendations.

## Features

- **Modern UI with Tailwind CSS**
  - Clean, responsive design
  - Dark mode & light mode
  - Smooth animations with Framer Motion

- **Multi-step Assessment Form**
  - Collect comprehensive user information
  - Interactive UI elements
  - Progress tracking

- **AI-Powered Recommendations**
  - Personalized career suggestions based on user data
  - Detailed career path information
  - Alternative careers and learning resources

- **Dashboard Experience**
  - View, filter, and bookmark career recommendations
  - Dynamic visualizations
  - Career comparison

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **AI Integration**: Google Gemini API
- **Styling**: Tailwind CSS with custom theme

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/career-guidance.git
   cd career-guidance
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Gemini API key (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
career-guidance/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   ├── components/         # Reusable UI components
│   ├── context/            # React context (theme, etc.)
│   ├── store/              # Zustand state management
│   ├── utils/              # Utility functions
│   ├── user/               # User-related pages
│   │   └── assessment/     # Multi-step assessment form
│   ├── careers/            # Career exploration pages
│   └── dashboard/          # User dashboard
├── public/                 # Static assets
└── tailwind.config.js      # Tailwind CSS configuration
```

## Deployment

The app can be easily deployed to Vercel, Netlify, or any other platform that supports Next.js.

```bash
# Build for production
npm run build
# or
yarn build
```

## Customization

- **Theme**: Modify `tailwind.config.js` to change colors, fonts, etc.
- **Career Categories**: Add or modify career suggestions in the AI prompts.
- **Form Fields**: Update the form components and state to collect different user information.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Google Generative AI](https://ai.google.dev/)
