# Redirector - URL Shortener

## 📌 Overview
This project is a simple URL redirector built with [**Next.js**](https://nextjs.org).
It uses a [**JSON file**](/public/redirects.json) to store redirection mappings, making it lightweight and easy to maintain.

## 🚀 How It Works
1. The app reads a `redirects.json` file that contains URL mappings.
2. When a user visits `guliveer.github.io/r/example`, they are redirected to the corresponding URL (e.g., `https://example.com`).
3. If a redirection target is not found, the user is redirected to the **default** URL.
4. A fallback message is displayed with a hyperlink in case the redirect fails.

## 📝 Configuration
Modify the [`redirects.json`](/public/redirects.json) file to add new redirects.
It also supports nested paths for better organization and readability.

```json
// Example

{
  "default": "https://github.com/Guliveer/r",             // (optional) 
  "github": "https://github.com/Guliveer",                // -> website.com/github
  "linkedin": "https://linkedin.com/in/oliwer-pawelski/", // -> website.com/linkedin
  "nested-example": {
    "subpage": "https://example.com/", // -> website.com/nested-example/subpage
    "subpage2": "https://example.com/" // -> website.com/nested-example/subpage2
  }
}
```

---
Made by **Oliwer Pawelski // Guliveer** 🚀

