# 💻 CodeX — MERN Online Judge Platform

CodeX is a modern, feature-rich **DSA (Data Structures & Algorithms) practice platform** built with the **MERN stack**, Docker, Redux, and other cutting-edge technologies.  
It allows users to solve coding problems, run and submit code, track progress, view leaderboards, and much more — all with an intuitive interface and robust backend architecture.

---

## 🚀 Features

### 👩‍💻 For Users
- 🔍 **DSA Problem Bank**
  - Browse, search, sort, and filter problems by difficulty (`Easy`, `Medium`, `Hard`) and status (`Solved`, `Unsolved`).
- 📝 **Code Editor**
  - Write, run (with custom input), and submit code.
  - Code is cached — remains intact even after page reload.
- ⏱️ **Submission Metrics**
  - Get **time and space complexity** results upon submission.
- 📊 **Submissions Dashboard**
  - View submission history for each problem and see all submissions on your profile.
- 🏆 **Leaderboard**
  - Compete with others based on solved problems, accuracy, and a calculated rating.
- 👤 **Profile Management**
  - Update or delete your profile, and view problem-solving distribution by difficulty.

### 🧑‍💼 For Admin
- 🧩 **Admin Dashboard**
  - Create, update, and delete DSA problems.
  - View and respond to `Contact Me` messages sent by users.

---

## 🧰 Tech Stack & Architecture

### 🌍 Frontend
- React + Redux Toolkit + Redux Persist
- React Router DOM
- Framer Motion, Recharts, SweetAlert2
- TailwindCSS + DaisyUI
- Vite for blazing fast builds
- Lazy Loading & Code Splitting
- Modular, maintainable components

### 🖥️ Backend 1 (CRUD Server)
- Node.js + Express
- MongoDB + Mongoose
- JWT-based Authentication (cookies)
- Problem CRUD APIs, Leaderboard, Profile management, Contact messages

### 🖥️ Backend 2 (Compiler Server)
- Node.js + Express
- Docker-based code execution
- Handles both `Run` and `Submit` requests
- Calculates time and space complexity safely

---

## 📦 Project Structure

```
CodeX/
├── backend/ # CRUD server
│ └── package.json
│ └── .env
├── compiler/ # Docker-based code runner
│ └── package.json
│ └── .env
├── frontend/ # React frontend
│ └── package.json
│ └── .env
└── README.md
```

Each service runs independently and communicates via REST APIs.

---

## 🧪 Installation & Setup

### Prerequisites
✅ Node.js ≥ 18  
✅ MongoDB (local or Atlas)  
✅ Docker  

---

### 📄 Environment Variables

#### Backend (CRUD) `.env`:
```env
PORT=5005
ORIGIN_URL=http://localhost:5173
COMPILER_BASE_URL=http://localhost:5008

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority&appName=<appName>

JWT_SECRET_KEY=<your_jwt_secret_here>
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

#### Backend (COMPILER) `.env`:
```env
PORT=5008
ORIGIN_URL=http://localhost:5173

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority&appName=<appName>
```

#### Frontend `.env`:
```env
VITE_API_URL=http://localhost:5005/api/v1
VITE_COMPILER_URL=http://localhost:5008/
```

### Clone the repository

- git clone https://github.com/AyushGupta3900/SummerProject.git
- cd SummerProject

### Setup Backend (CRUD)

- cd backend
- cp .env.example .env   # and fill in your credentials
- npm install
- npm run dev

### Setup Frontend

- cd ../frontend
- cp .env.example .env   # and fill in your URLs
- npm install
- npm run dev
  
### Setup Compiler (Docker-based)

- cd ../compiler
- cp .env.example .env   # and fill in your credentials
- docker stop $(docker ps -q) || true
- docker rm $(docker ps -aq) || true
- docker image prune -a -f
- docker build --no-cache -t compiler-server .
- docker run -p 5008:5008 compiler-server
- docker run --env-file .env -d -p 5008:5008 codex-compiler

## Building multiarchitecture image 
- docker buildx create --use
- docker buildx inspect --bootstrap
- docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t 655232707800.dkr.ecr.ap-southeast-2.amazonaws.com/codex-compiler:latest \
  --push .

## Deploying on AWS 

- brew install awscli 
- Create a IAM user 
- Give username 
- attach permissions -> AdministratorAccess
- Create the Acess Key on aws 
- aws configure 
- AWS Access Key ID [None]: YOUR_ACCESS_KEY
- AWS Secret Access Key [None]: YOUR_SECRET_KEY
- Default region name [None]: ap-south-1
- Default output format [None]: json
- Make a ECR registry 
- create a repository 
- tag the image on your local system 
- docker push image_url 
- create the ec2 instance 
- create a key value pair in ec2 instance 
- add it to the keys folder of the project 
- Edit the network settings and add the exposed port of the project 
- Open the ec2 instance on you cmd in the keys folder using push commands 
- sudo yum install docker 
- sudo service docker start 
- sudo usermod -aG ec2-user 
- sudo reboot 
- ssh ""
-  docker pull image_url_on_url (655232707800.dkr.ecr.ap-southeast-2.amazonaws.com/codex-compiler:latest)
- docker run --env-file .env -d -p 5008:5008 \
  655232707800.dkr.ecr.ap-southeast-2.amazonaws.com/codex-compiler:latest
docker ps
- check the docker 
- curl http://localhost:5008/
- docker ps
- Allocate Elastic Ip to the EC2 instance 
- After deploying on was register the IPV4 Elastic IP on the domain 
- ping codex-online-judge.duckdns.org
- Install and configure nginx 
- sudo amazon-linux-extras enable nginx1
- sudo yum install nginx -y
- sudo systemctl enable nginx
- sudo systemctl start nginx
- sudo systemctl status nginx
- sudo amazon-linux-extras install epel -y
- sudo yum install certbot python2-certbot-nginx -y
- sudo certbot --nginx -d codex-online-judge.duckdns.org
- Open the ports 80 and 443 in security groups 
- sudo vim /etc/nginx/conf.d/codex-online-judge.conf
```
server {
    listen 80;

    server_name codex-online-judge.duckdns.org;

    location / {
        proxy_pass         http://127.0.0.1:5008;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
- sudo nginx -t
- sudo systemctl restart nginx
