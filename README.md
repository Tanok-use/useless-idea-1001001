# Date Night invitation app

A mobile-first, single-page invitation app ready to host and send as a link by text or email. It supports the Yes/No confirmation path, a required decline reason, native calendar/time picker, date and food suggestion flows, specific custom plans, review, and a receipt email draft.

## Make it yours

1. Create a free form at [Formspree](https://formspree.io/), set its **Target Email** to your email address, and copy the endpoint shown in the Integration section (it looks like `https://formspree.io/f/abcdwxyz`).
2. Open `app.js` and paste that endpoint inside the quotes in `const FORMSPREE_ENDPOINT = '';` near the top. This turns on automatic receipt delivery. The endpoint is designed to appear in browser code; do not put a private API key in this app.
3. Personalize the heading text and choices in `index.html` / `app.js` if you’d like.
4. Host the three files with any static web host (Netlify Drop, GitHub Pages, Cloudflare Pages, etc.) and text/email the resulting link.

Until a Formspree endpoint is added, the app opens the sender’s default email app with a complete receipt addressed to you. Once the endpoint is added, receipts send automatically in the background and the app shows an error if delivery fails.

On phones, the browser’s native date picker and time wheel appear automatically.
