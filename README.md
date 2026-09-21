# Vulnerable & Secure Login Page Lab 🛡️

A purpose-built, dual-mode web application designed for security education. This project demonstrates common web vulnerabilities alongside their secure, hardened counterparts. It allows developers and security enthusiasts to toggle between "Unhardened" and "Secure" modes to understand both how attacks are executed and how to effectively mitigate them in modern codebases.

Built with **Next.js**, **React**, **Tailwind CSS**, and **PostgreSQL**.

---

## 🚀 Features

The application simulates a realistic authentication and user profile system containing the following vulnerability labs:

* **SQL Injection (SQLi)**: Bypassing authentication using malicious SQL payloads.
* **Insecure Direct Object Reference (IDOR)**: Modifying another user's profile data by manipulating request parameters.
* **Race Conditions (TOCTOU)**: Exploiting asynchronous processes to redeem a single coupon multiple times.
* **Blind OS Command Injection**: Triggering arbitrary system commands via un-sanitized input.
* **Verbose Error Handling**: Leaking sensitive stack traces and runtime information via type confusion.
* **Rate Limiting / Brute Force Mitigation**: Observing the effects of unthrottled endpoints versus strictly rate-limited secure routes.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS & shadcn/ui
* **Database:** PostgreSQL (Designed for Vercel Postgres or Neon)
* **Authentication:** Custom implementation using `bcryptjs`

---

## ⚙️ Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en/) (v18 or higher)
* A Postgres Database (We recommend the free tier of [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or [Neon](https://neon.tech/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/4li466as/Vulnerable-And-Secure-Login-Page.git
   cd Vulnerable-And-Secure-Login-Page
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Postgres connection string:
   ```env
   POSTGRES_URL="postgresql://postgres:password@host/dbname"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   *Note: The application will automatically seed the database with test users (`admin@admin.com` and `242293@gmail.com`) on the first connection.*

5. **Open the App:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚠️ Disclaimer

**This project is for educational purposes only.** The vulnerable endpoints are intentionally left insecure. Do not use the "Unhardened" code patterns in a production environment. Always follow secure coding practices.

---
*Created for security research and developer training.*
