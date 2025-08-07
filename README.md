# 🎬 Mini Media Editor

A modern, browser-based **video, audio, and image editor** inspired by iMovie and Windows Movie Maker—reimagined for quick, intuitive clip editing in your web browser.

# Screenshots
<img width="1440" height="811" alt="image" src="https://github.com/user-attachments/assets/74a5168b-1303-48f8-8e04-00c2cd4ec12a" />
<img width="1292" height="813" alt="image" src="https://github.com/user-attachments/assets/7b173946-28ea-49d4-80a7-cd671e6fe8d0" />


## 📋 Project Explanation

### 🎯 What This App Does

- **Purpose:** A simple editor for videos, audios, and images—all in your browser.
- **Think of it like:** A *mini version* of iMovie or Windows Movie Maker.
- **Main goal:** Upload media files, arrange their order, trim or edit as needed, and play them back with ease.

## 🏗️ How It's Built

### Technology Stack

- **React:** Creates a fast and interactive user interface.
- **Redux Toolkit:** Centralized data management for all app states.
- **Tailwind CSS:** Makes the design modern and responsive with minimal effort.
- **Vite:** Lightning-fast development server and build tool.
- **JavaScript:** Core logic, keeping things simple—*no TypeScript, only JavaScript*.

## 🗂️ File Organization

src/
├── App.jsx # Main controller - connects everything
├── store/ # Redux - manages all data
│ ├── index.js # Store setup
│ └── slices/ # Data management
├── components/ # UI pieces
│ ├── MediaPlayer.jsx # Shows videos/audio
│ ├── Timeline.jsx # Shows all clips in a row
│ ├── FileUpload.jsx # Drag & drop area
│ └── Others...


## 🚀 Features

- **Drag & Drop** to add media.
- **Timeline View** for intuitive editing and ordering.
- **Trim Clips** by resizing handles or input fields.
- **Live Preview** of your edited media.
- **Support for Common Formats**: MP4, MP3, JPG, PNG, and more.

## 🌐 Getting Started

1. **Clone the repository:**
2. **Install dependencies:**
3. **Run locally:**
4. **Visit:** `http://localhost:5173`

## 📦 Deployment

This app is live on Vercel!  
Find the deployed version here: [**Deployed Vercel Link**](#) *(https://mediaviwer.vercel.app/)*
