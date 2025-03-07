# Form Builder Application

Form builder application built with Next.js 15, TypeScript, and Tailwind CSS that allows users to create, preview and submit forms

## Live Demo

[View Live Demo]()

## Application Flow

1. **Create a Form**:

   - Start at the homepage and click "Create a Form"
   - Add questions of different types using the "Add Question" dropdown
   - Each form gets a unique URL for editing at `/create/[formId]`
   - Forms can be saved as drafts or published

2. **Preview a Form**:

   - Click "Preview" to see how your form will appear to respondents
   - Review and make changes as needed
   - Return to the editor to continue editing

3. **Publish a Form**:

   - Click "Publish form" to make the form available for submissions
   - Published forms can be filled out but not edited
   - Publishing redirects to the submission page

4. **Submit a Form**:

   - Fill out the form with valid responses
   - Track completion progress with the progress indicator
   - Submit to save your responses
   - Receive a success message with a shareable link

5. **View Submissions**:
   - Access the submissions page to see all form responses
   - View submission details and timestamps

## Assumptions Made

For the sake of this assignment, the following assumptions were made:

**Data Storage**: The application uses localStorage instead of a database for simplicity.

## Features

- **Form Creation**: Create custom forms with 6 question types:

  - Short answer
  - Long answer
  - Single select (Radio buttons)
  - Number
  - URL
  - Date

- **Form Management**:

  - Save forms as drafts
  - Publish forms for submission
  - Preview forms before publishing
  - Each form has a unique URL

- **Form Submission**:

  - Form completeness indicator
  - Success message after submission

## Technical Implementation

- **State Management**: Uses React's built-in state management and local storage
- **Data Persistence**: LocalStorage for storing forms and submissions
- **Routing**: Next.js App Router for navigation between pages
- **Components**: Modular component architecture with shadcn UI components
- **Styling**: TailwindCSS for responsive design

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
