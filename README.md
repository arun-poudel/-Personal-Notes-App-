# - Personal-Notes-App-

# 📝 Personal Notes API (Project #2)

An advanced Note-Taking Backend built with **Node.js**, **Express**, and **PostgreSQL**. This project builds upon basic CRUD by introducing complex query logic, pattern matching, and pagination.

---

## 🛠 New Features (Level 2)
- **Advanced Search**: Search for keywords within titles or content using SQL `ILIKE` and wildcards.
- **Category Filtering**: Organize and retrieve notes based on specific categories (e.g., Work, Personal, Education).
- **Pagination**: Optimized data fetching using `LIMIT` and `OFFSET` to handle large datasets efficiently.
- **Smart Timestamps**: Tracks both `created_at` and `updated_at` for every note.
- **Dynamic Query Building**: SQL queries are constructed dynamically based on user input.

---

## 🏗 Database Schema

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY |
| `title` | TEXT | NOT NULL |
| `content` | TEXT | NOT NULL |
| `category` | TEXT | DEFAULT 'General' |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

## 🚦 Getting Started

### 1️⃣ Environment Setup
Ensure your `.env` file includes the following:
```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=note
DB_PASSWORD=your_password
DB_PORT=5433