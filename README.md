# GitFlare
A visually stunning and high-performance GitHub client built entirely on the Cloudflare native stack for browsing repositories and code.
GitFlare provides an elegant and streamlined interface for browsing GitHub users, organizations, repositories, and code. The application leverages Cloudflare Workers as a backend proxy to the GitHub API, ensuring fast data retrieval from the edge, and uses Cloudflare's serverless infrastructure for hosting. The frontend is a sophisticated single-page application built with React, Vite, and shadcn/ui, focusing on an exceptional user experience, breathtaking visual design, and delightful micro-interactions.
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/aitechnexus/generated-app-20251016-050002)
## Key Features
- **GitHub Search:** Instantly find any GitHub user or organization.
- **Repository Grid:** View repositories in a visually appealing card layout with key stats like stars and primary language.
- **File Tree Navigation:** Seamlessly browse the file structure of any repository.
- **Syntax Highlighting:** Read code with professional-grade syntax highlighting for numerous languages.
- **Edge-Powered:** Built on Cloudflare Workers for a fast, globally distributed backend.
- **Modern UI/UX:** A beautiful, responsive interface built with shadcn/ui and Tailwind CSS.
- **Type-Safe:** End-to-end type safety with TypeScript across the frontend and worker.
## Technology Stack
- **Frontend:** React, Vite, React Router
- **UI Components:** shadcn/ui, Tailwind CSS
- **State Management:** Zustand
- **Animations & Icons:** Framer Motion, Lucide React
- **Backend:** Cloudflare Workers, Hono
- **Language:** TypeScript
## Project Structure
A brief overview of the key directories in this project:
```
/
├── src/          # Frontend React application source code
├── worker/       # Cloudflare Worker backend source code (Hono)
├── shared/       # Shared types between frontend and worker
├── public/       # Static assets for the frontend
└── wrangler.jsonc # Cloudflare Worker configuration
```
## Getting Started
Follow these instructions to get the project up and running on your local machine for development and testing purposes.
### Prerequisites
- [Bun](https://bun.sh/) installed on your machine.
- A [Cloudflare account](https://dash.cloudflare.com/sign-up).
- The [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) authenticated with your Cloudflare account.
### Installation & Local Development
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/gitflare.git
    cd gitflare
    ```
2.  **Install dependencies:**
    This project uses Bun as the package manager.
    ```bash
    bun install
    ```
3.  **Run the development server:**
    This command starts the Vite development server for the frontend and the Wrangler development server for the worker simultaneously.
    ```bash
    bun dev
    ```
    The application will be available at `http://localhost:3000`.
## Deployment
This project is designed for easy deployment to the Cloudflare network.
### One-Click Deploy
You can deploy this application to your own Cloudflare account with a single click.
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/aitechnexus/generated-app-20251016-050002)
### Manual Deployment via CLI
1.  **Build the application:**
    This command bundles the frontend and prepares the worker for production.
    ```bash
    bun build
    ```
2.  **Deploy to Cloudflare:**
    This command deploys your application using the Wrangler CLI.
    ```bash
    bun deploy
    ```
    Wrangler will provide you with the URL of your deployed application.
## Architecture
The application follows a simple but powerful architecture:
- **Frontend:** A React single-page application (SPA) handles all user interface rendering and interactions.
- **Backend:** A Hono application running on a Cloudflare Worker acts as a secure proxy.
- **Data Flow:** The React frontend makes API calls to its own backend endpoints (e.g., `/api/github/...`). The Hono worker receives these requests, forwards them to the official GitHub API with the necessary headers, and returns the response to the frontend. This keeps any potential API keys or tokens secure on the backend and allows for future caching strategies at the edge.