# XYZ University Student Portal

A web application for XYZ University students to sign up and access course materials.

## Features

- User account creation
- MongoDB integration for data storage
- Modern responsive UI
- Professional design elements

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- Containerization: Docker (configuration included)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance (local or remote)
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
```
git clone https://github.com/mksinha01/xyz-university-portal.git
cd xyz-university-portal
```

2. Install dependencies:
```
npm install
```

3. Configure MongoDB:
Update the MongoDB connection string in `server.js` if needed.

4. Start the server:
```
npm start
```

5. Access the application:
Open your browser and navigate to `http://localhost:5050`

### Docker Deployment

#### Using GitHub Container Registry (GHCR)
```bash
# Pull and run from GHCR
docker pull ghcr.io/mksinha01/docker-testapp:latest
docker run -p 5050:5050 ghcr.io/mksinha01/docker-testapp:latest
```

#### Building Locally
1. Build the Docker image:
```
docker build -t xyz-university-portal .
```

2. Run the container:
```
docker-compose up -d
```

#### Using Docker Compose with GHCR
```yaml
services:
  app:
    image: ghcr.io/mksinha01/docker-testapp:latest
    ports:
      - "5050:5050"
```

For detailed GHCR setup and usage, see [GHCR_SETUP.md](./GHCR_SETUP.md).

## Project Structure

- `server.js` - Express server and API endpoints
- `public/` - Static frontend files
  - `index.html` - Main entry page
  - `style.css` - Styling

## API Endpoints

- `POST /addUser` - Create a new user account
- `GET /getUsers` - Retrieve all users

## License

MIT