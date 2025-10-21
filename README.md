# 📂 DropIt

A modern, full-stack cloud storage application inspired by Dropbox, demonstrating secure authentication, relational data modeling for file hierarchy, and integration with third-party storage services.

---

## 🛠️ Technology Stack

This project is built using a modern, scalable JavaScript stack:

| Category | Technology | Purpose in Project |
|----------|------------|-------------------|
| **Frontend/Backend** | Next.js | Unified full-stack framework for rendering and API endpoints |
| **Authentication** | Clerk | User sign-up, sign-in, and session management with custom branding |
| **Database** | PostgreSQL | Primary relational database for storing application and file metadata |
| **ORM** | Drizzle | Object-Relational Mapper for interacting with PostgreSQL |
| **File Storage** | ImageKit | External service for actual storage and delivery of media files |

---

## ✨ Implemented Core Features

### 1. User Authentication & Authorization

- **Custom Sign-Up/In**: Utilizes Clerk for robust, secure user authentication with a fully custom-branded interface
- **User Identification**: All file and folder records are linked to authenticated users via unique ID, establishing clear ownership

### 2. File & Data Management

- **File Upload**: Browse, select, and upload files to external storage service (ImageKit) via dedicated endpoint handling form data
- **Database Synchronization**: Key file metadata (name, size, type, status, ownership) stored in PostgreSQL database, separate from file content
- **Download Functionality**: Retrieve and download files from cloud storage using stored download URLs
- **Optional Thumbnail URL**: Data model includes optional field for storing thumbnail URLs, useful for displaying previews of images or videos

### 3. File System Simulation & Status Tracking

The application uses the database to simulate folder structure and track file status:

#### Hierarchical Data Model
Files and folders are structured in the database with references to parent IDs, maintaining and displaying a true file-system hierarchy.

#### ⭐ Star / Favorites Feature
- Files can be marked as "starred" via dedicated endpoint
- Separate view/tab queries the database to display only starred files

#### 🗑️ Delete / Trash Feature (Soft Delete)
- Deleting a file performs a soft-delete by marking the file's status as "trash" in the database
- Files are not permanently removed
- Trash view/tab queries and displays only trashed files, functioning as a recycle bin

### 4. Basic UI Navigation

The primary interface includes distinct views for filtering files based on status:

- **Home/All Files** - Main file structure view
- **Starred** - Favorite files
- **Trash** - Soft-deleted files

---

## 📝 Data Schema Focus (Drizzle/PostgreSQL)

The database schema is critical for tracking file relationships and status:

- ✅ Stores essential file metadata (name, type, size, storage path)
- ✅ Tracks user ID (ownership)
- ✅ Manages parent IDs for hierarchy (folder structure)
- ✅ Maintains boolean status flags to track if a file is starred or in the trash

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database instance
- **Clerk** account for authentication
- **ImageKit** account for file storage

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prabhsingh14/droply.git
   cd droply
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory and add the following:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/droply
   
   # ImageKit
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   # or
   yarn db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

### Building for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

---

## 🤝 Contributing

We welcome contributions to DropIt! Here's how you can help:

### How to Contribute

1. **Fork the repository**
   
   Click the "Fork" button at the top right of this page.

2. **Clone your fork**
   ```bash
   git clone https://github.com/prabhsingh14/droply.git
   cd droply
   ```

3. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   
   - Write clean, readable code
   - Follow the existing code style
   - Add comments where necessary
   - Update documentation if needed

5. **Test your changes**
   
   Ensure all features work as expected and no existing functionality is broken.

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: Brief description of your changes"
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   
   Go to the original repository and click "New Pull Request". Provide a clear description of your changes.

### Contribution Guidelines

- **Code Quality**: Ensure your code is clean, well-documented, and follows best practices
- **Commit Messages**: Use clear, descriptive commit messages (e.g., "Add: file sharing feature", "Fix: upload bug on mobile")
- **Testing**: Test your changes thoroughly before submitting
- **Documentation**: Update the README or add comments if you're introducing new features
- **Issues First**: For major changes, open an issue first to discuss what you'd like to change

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features (file sharing, collaboration, etc.)
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage

### Code of Conduct

Please be respectful and constructive in all interactions. We're here to learn and build together!

---

Built with ❤️ using modern web technologies
