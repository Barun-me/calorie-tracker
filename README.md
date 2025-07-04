# 🍽️ Calorie Analyzer App

> A **fast**, **intuitive**, and **responsive** web application that translates food images into calorie estimates, empowering users to make informed dietary choices at a glance.

---

## 🚀 Features

* **Image Upload & Preview**: Snap a photo with your device or upload from your library.
* **Secure Proxy**: All AI requests flow through a serverless endpoint—your API keys stay hidden.
* **Real‑Time Insights**: Instant predictions via Groq Vision models for calorie counts (and macros when available).
* **Circular Progress**: Visualize each dish’s calories as a percentage of a 2,000 kcal daily budget.
* **Responsive UI**: Adapts beautifully from desktop to mobile.
* **Fallback Parsing**: Accepts both JSON arrays (`items: [...]`) and key–value maps (`{ Rice: 150, Dal: 230 }`).

---

## 🛠️ Tech Stack

| Layer           | Technology                  |
| --------------- | --------------------------- |
| Frontend        | HTML5 • CSS3 • Vanilla JS   |
| Styling         | Custom CSS Grid & Flex      |
| Hosting & Proxy | Vercel Serverless Functions |
| AI & Vision     | Groq AI (LLama Vision)      |
| Image Storage   | ImgBB API                   |

---

## 🖥️ Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/<your-username>/calorie-analyzer.git
   cd calorie-analyzer
   ```

2. **Install dependencies** (for serverless functions)

   ```bash
   npm install
   ```

3. **Configure environment variables**

   * Create a `.env` file in the project root:

     ```dotenv
     GROQ_KEY=your_groq_api_key
     IMGBB_KEY=your_imgbb_api_key
     ```

4. **Run locally**

   * **With Vercel CLI**:

     ```bash
     npm install -g vercel
     vercel dev
     ```

5. **Deploy**

   * Push to GitHub and connect your repo in the Vercel Dashboard.
   * Add `GROQ_KEY` and `IMGBB_KEY` under **Settings → Environment Variables**.
   * Vercel auto-deploys on every push to `main`.

Visit your live app at `https://<your‑project>.vercel.app`

---

## 📂 Project Structure

```
/                   # Root directory
├── api/            # Serverless functions
│   └── calories.js # Proxy endpoint for Groq AI
├── styles.css      # Global styles
├── index.html      # Frontend markup & logic
├── package.json    # Dependencies & scripts
└── README.md       # Project overview
```

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/fooBar`.
3. Commit your changes: `git commit -m 'Add some fooBar'`.
4. Push to the branch: `git push origin feature/fooBar`.
5. Open a Pull Request.

Please adhere to [Semantic Versioning](https://semver.org/) and maintain consistent code formatting.

---

> Built with ❤️ and ⚡ by Barunangshu Bhowmik (https://github.com/Barun-me)
