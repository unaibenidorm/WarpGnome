# 🌐 WarpGNOME — Cloudflare WARP Toggle for GNOME Shell

> Toggle Cloudflare WARP directly from the GNOME Quick Settings panel, without leaving your desktop.

***

## ✨ Features

- **One-click toggle** from the GNOME Quick Settings panel
- Native integration with GNOME Shell's visual style
- Real-time WARP status detection (connected / disconnected)
- No external interfaces — everything from the top bar

***

## 📸 Screenshot


<img width="623" height="424" alt="image" src="https://github.com/user-attachments/assets/4dd48052-24f7-4d25-96da-c63c7718a04e" />
<<<<<<< HEAD

***

## 📋 Requirements

- GNOME Shell **45 or higher**
- [Cloudflare WARP CLI](https://developers.cloudflare.com/warp-client/get-started/linux/) installed and configured

***

## 🚀 Installation

### 1. Install Cloudflare WARP CLI

Follow the official guide for your distribution:  
👉 https://developers.cloudflare.com/warp-client/get-started/linux/

### 2. Register the client

```bash
warp-cli register
```

### 3. Install the extension manually

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/warpgnome.git

# Copy the extension to your GNOME extensions directory
cp -r warpgnome ~/.local/share/gnome-shell/extensions/warpgnome@unaibenidorm

# Enable the extension
gnome-extensions enable warpgnome@unaibenidorm
```

> 💡 If you don't see the changes immediately, restart GNOME Shell with `Alt + F2` → `r` (on X11) or log out and back in (on Wayland).

***

## 🔧 Usage

Once enabled, a toggle button will appear in the **Quick Settings** panel (top-right corner). Click it to instantly connect or disconnect WARP.

***

## 🗂 Project Structure

```
warpgnome@unaibenidorm/
├── extension.js       # Main extension logic
├── metadata.json      # Metadata: UUID, name, supported GNOME versions
├── stylesheet.css     # Optional styles
└── README.md
```

***

## 🤝 Credits

This project is based on the original work by:

- **[khaled-0/gnome-cloudflare-warp-toggle](https://github.com/khaled-0/gnome-cloudflare-warp-toggle)** — author of the base extension this fork is built upon.
- **[pikokr/cloudflare-warp-quicksettings](https://github.com/pikokr/cloudflare-warp-quicksettings)** — original creator of the concept.

***

## 📄 License

This project is distributed under the same license as the original repository. See the `LICENSE` file for more details.
=======

***

## 📋 Requirements

- GNOME Shell **45 or higher**
- [Cloudflare WARP CLI](https://developers.cloudflare.com/warp-client/get-started/linux/) installed and configured

***

## 🚀 Installation

### 1. Install Cloudflare WARP CLI

Follow the official guide for your distribution:  
👉 https://developers.cloudflare.com/warp-client/get-started/linux/

### 2. Register the client

```bash
warp-cli register
```

### 3. Install the extension manually

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/warpgnome.git

# Copy the extension to your GNOME extensions directory
cp -r warpgnome ~/.local/share/gnome-shell/extensions/warpgnome@unaibenidorm

# Enable the extension
gnome-extensions enable warpgnome@unaibenidorm
```

> 💡 If you don't see the changes immediately, restart GNOME Shell with `Alt + F2` → `r` (on X11) or log out and back in (on Wayland).

***

## 🔧 Usage

Once enabled, a toggle button will appear in the **Quick Settings** panel (top-right corner). Click it to instantly connect or disconnect WARP.

***

## 🗂 Project Structure

```
warpgnome@unaibenidorm/
├── extension.js       # Main extension logic
├── metadata.json      # Metadata: UUID, name, supported GNOME versions
├── stylesheet.css     # Optional styles
└── README.md
```

***

## 🤝 Credits

This project is based on the original work by:

- **[khaled-0/gnome-cloudflare-warp-toggle](https://github.com/khaled-0/gnome-cloudflare-warp-toggle)** — author of the base extension this fork is built upon.
- **[pikokr/cloudflare-warp-quicksettings](https://github.com/pikokr/cloudflare-warp-quicksettings)** — original creator of the concept.

***

## 📄 License

This project is distributed under the same license as the original repository. See the `LICENSE` file for more details.

>>>>>>> c1b44bd (EGO code fix)
