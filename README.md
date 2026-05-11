BidSpirit - Fine Art & Antiques Marketplace

BidSpirit is a high-end online marketplace designed for collectors and enthusiasts of fine art, antiques, and rare collectibles. This project demonstrates a modern, responsive front-end implementation with dynamic data handling and personalized user interactions.

Features

*   Personalized Onboarding: Collects user names on first visit to customize the browsing experience.
*   Dynamic Product Catalog: Loads auction items dynamically from a JSON database.
*   Interactive Bidding System: A detailed modal system that allows users to place bids and track their activity via `localStorage`.
*   Live Status Ticker: Features a real-time clock and geolocation tracking using the Nominatim OpenStreetMap API.
*   Responsive Design: Fully optimized for desktop, tablet, and mobile devices.
*   Smooth Navigation: Integrated smooth-scrolling and scroll-triggered animations for a premium feel.

Tech Stack

*   HTML5: Semantic structure.
*   CSS3: Custom properties (variables), Flexbox, Grid, and keyframe animations.
*   JavaScript (ES6+): Vanilla JS for DOM manipulation, Fetch API, and Geolocation.
*   Data Source: Local `data.json` for product persistence.

Getting Started

Prerequisites
Because this project uses the JavaScript `fetch` API to load product data, you must run it through a local web server to avoid CORS (Cross-Origin Resource Sharing) issues.

Running Locally
1.  Clone the repository:**
    ```bash
    git clone https://github.com/Kingjazz011/BidSpirit.git
    ```
2.  Navigate to the directory:**
    ```bash
    cd BidSpirit
    ```
3.  Start a local server:
    *   If using VS Code, install the **Live Server** extension and click "Go Live".
    *   Alternatively, using Python: `python -m http.server 8000`.
    *   Using Node.js: `npx serve`.

Project Structure

*   `index.html` - The main entry point.
*   `style.css` - Comprehensive styling and animations.
*   `script.js` - Application logic and API integrations.
*   `data.json` - Product database.

License

This project is licensed under the MIT License - see the LICENSE file for details.

Contributing

Feedback and contributions are welcome! Please feel free to submit a Pull Request.#
