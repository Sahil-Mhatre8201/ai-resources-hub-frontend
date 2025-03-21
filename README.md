

```md
# Spartan AI Hub - Frontend

This is the frontend for AI Resources Hub, a platform that helps users discover and bookmark AI-related resources such as GitHub repositories, research papers, and blogs.

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 📌 Prerequisites

- Install **Node.js** (latest LTS version recommended)
- Ensure **npm** or **yarn** is installed

### 📥 Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/YOUR_GITHUB_USERNAME/ai-resources-hub-frontend.git
   ```

2. Navigate into the project directory:
   ```sh
   cd ai-resources-hub-frontend
   ```

3. Install dependencies:
   ```sh
   npm install
   ```

### ▶️ Running the Development Server

Start the Next.js development server:

```sh
npm run dev
```

The app will be available at **[http://localhost:3000](http://localhost:3000)**.

### ⚙️ Environment Variables

Create a `.env.local` file in the root directory and add the necessary environment variables. Example:

```sh
NEXT_PUBLIC_API_BASE_URL=https://ai-resources-hub-backend.onrender.com
```


### 🛠️ Troubleshooting

- **CORS Errors:** Ensure your backend allows requests from the deployed frontend URL.
- **.env Variables Not Loading?** Restart the server after modifying `.env.local`.

