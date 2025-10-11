# 🐳 Docker Test App - Apna College

This repository is a simple **Docker-based Node.js application** created for learning and practicing containerization concepts taught in **Apna College**.  
It demonstrates how to use Docker for building, running, and managing a Node.js app, along with MongoDB integration via Docker Compose.

---

## 📁 Project Structure

```
docker-testapp/
│
├── Dockerfile             # Defines how to build the Node.js app image
├── mongo.yaml             # Docker Compose file for MongoDB service
├── package.json           # Node.js dependencies and scripts
├── server.js              # Express app entry point
├── .gitignore             # Ignore unnecessary files like node_modules
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone 
cd docker-testapp
```

### 2️⃣ Install dependencies (optional if you want to run locally)
```bash
npm install
```

### 3️⃣ Run using Docker
Build and start containers:
```bash
docker compose -f mongo.yaml up --build
```

This will:
- Build your Node.js application image  
- Start a MongoDB container  
- Link both using a shared Docker network  

---

## ⚙️ Environment Variables

Create a `.env` file in the project root (if required):
```
PORT=5050
MONGO_URI=mongodb://mongo:27017/testdb
```

---

## 📦 Useful Docker Commands

```bash
# Build image
docker build -t testapp .

# Run container
docker run -p 5050:5050 testapp

# List running containers
docker ps

# Stop all containers
docker stop $(docker ps -aq)
```

---

## 🧠 Learning Goals

This project helps you understand:
- Building and running containers with Docker  
- Using **Docker Compose** for multi-container apps  
- Connecting a Node.js app to MongoDB inside Docker  
- Managing Docker networks and volumes  

---

## 🤝 Contributing

Want to contribute or learn together?

1. **Fork** the repo  
2. Create your feature branch  
   ```bash
   git checkout -b feature-name
   ```
3. **Commit** your changes  
   ```bash
   git commit -m "Added new feature"
   ```
4. **Push** to your fork  
   ```bash
   git push origin feature-name
   ```
5. Open a **Pull Request**

---

## 🧩 Credits

- Instructor: [Apna College](https://www.apnacollege.in/)  

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
