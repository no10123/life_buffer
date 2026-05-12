# UniDash - Student Productivity Dashboard

A comprehensive web-based dashboard for students that integrates multiple educational tools and services into a unified interface.

## Features

- **Canvas Integration**: View upcoming assignments and course information
- **HAC Grades**: Access Home Access Center grades (Round Rock ISD)
- **Gmail Integration**: View emails and announcements
- **Playlist Manager**: Audio playlist functionality
- **App Browser**: Embedded web applications
- **Customizable UI**: Theme customization and settings

## Setup Instructions

### Prerequisites
- Node.js (for running the server)
- A modern web browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/no10123/life_buffer.git
   cd life_buffer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser to `http://localhost:3000`

### Canvas API Setup

**⚠️ Security Note**: Never commit API tokens to version control. The `.gitignore` file excludes sensitive configuration files.

1. **Get your Canvas Access Token**:
   - Go to your Canvas instance (e.g., `https://canvas.instructure.com` or your school's URL)
   - Navigate to Account → Settings → Approved Integrations
   - Click "New Access Token"
   - Give it a name like "UniDash" and set an expiration if desired
   - Copy the token immediately (you won't see it again)

2. **Configure in UniDash**:
   - Open the application and go to Settings
   - In the "Canvas Integration" section:
     - Canvas Instance URL should already be set to `https://learn.irvingisd.net` (Irving ISD)
     - Enter your access token
     - Click "Test Connection" to verify it works
   - Your token is stored securely in your browser's localStorage

### HAC Integration

The HAC (Home Access Center) integration works out of the box for Round Rock ISD students. Your credentials are only used to authenticate with RRISD servers and are never stored.

## Development

- Frontend: Vanilla JavaScript, HTML, CSS
- Backend: Node.js/Express (for HAC proxy)
- No build process required - serves static files

## Security

- API tokens are stored client-side in localStorage
- HAC credentials are proxied through the server but not stored
- CORS proxy used for HAC access (corsproxy.io)
- Sensitive files are gitignored

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC

