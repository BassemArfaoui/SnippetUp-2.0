# SnippetUp – Frontend

This is the **frontend** of SnippetUp.  
The backend is available at: [SnippetUp Backend](https://github.com/BassemArfaoui/SnippetUp-2.0_Server)

SnippetUp is a social platform for developers to share, organize, and discover code snippets.  
It provides a collaborative environment where developers can contribute, engage with the community, and grow their professional presence.

## Features

### Developer Feed
- Publish code snippets with descriptions, language tags, and repository links.
- React to and comment on posts.
- Explore new and trending snippets shared by the community.

### Snippet Management
- Save public snippets to personal collections.
- Create private snippets to manage reusable code (e.g., functions, UI components, configuration files).
- Publish private snippets at any time to share them publicly.

### Snippet Requests
- Post requests for specific code snippets.
- Respond to requests by:
  - Creating a new snippet
  - Linking an existing snippet
  - Providing relevant external resources

### Developer Profiles and Contribution Scoring
- Each user has a customizable profile highlighting their activity.
- Users earn contribution points by publishing snippets and responding to requests.
- Profile themes adapt as contribution levels increase.

### Advanced Search
- Search across snippets, users, and technologies using Algolia-powered indexing.

## Technology Stack

| Layer       | Technology                            |
|-------------|----------------------------------------|
| Frontend    | React.js, Bootstrap (custom utilities) |
| Backend     | Express.js (Node.js)                   |
| Database    | PostgreSQL                             |
| Cloud       | Cloudinary (media storage)             |
| Search      | Algolia                                |

## Getting Started

To run the frontend locally:

```bash
# Clone the repository
git clone https://github.com/BassemArfaoui/SnippetUp-2.0.git

# Navigate into the project folder
cd SnippetUp-2.0

# Install dependencies
npm install

# Start the development server
npm start
