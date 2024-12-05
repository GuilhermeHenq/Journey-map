# **JourneyEasyMap (JEM)** <img src="https://raw.githubusercontent.com/GuilhermeHenq/Journey-map/refs/heads/main/frontend/src/assets/mascote.png" width="30px"></img>

**JourneyEasyMap (JEM)** is a powerful User Journey Map (UJM) creation tool designed for efficiency and ease of use.

- **Frontend**: Built with React.JS and Vite, leveraging the **React Konva** library for advanced shape manipulation and visualization.  
- **Backend**: Developed using Node.js with the **Express** framework, ensuring robust and scalable server-side operations.  
- **Database**: Utilizes a **MySQL** database, with the schema `mapjourney` to store and manage all application data.

---

## **Getting Started**

### **Frontend Interface Setup**
1. Navigate to the frontend directory:  
   ```bash
   cd ./frontend/
2. Install dependencies:  
   ```bash
   npm install
3. Start the development server:  
   ```bash
   npm run dev
By default, React will run on <b>port 5173.</b>

### **Backend Server Setup**
1. Navigate to the backend directory:  
   ```bash
   cd ./backend/
2. Install dependencies:  
   ```bash
   npm install
3. Start the development server:  
   ```bash
   npm run dev
The server will run on <b>port 3000.</b>

---

## Database Configuration
### **Setup MySQL**
1. Navigate to the backend directory:  
   ```bash
   cd ./backend/
2. Create a .env file with the following configuration:  
   ```bash
   DB_HOST=your_host (e.g., localhost)
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=mapjourney
Replace the placeholders with your MySQL credentials.

### **Create the <i>mapjourney</i> Database**
1. Import the <i>mapjourneyDB.sql</i> file into MySQL to configure and create the required database schema.

---

We hope you enjoy JourneyEasyMap! If you encounter any issues, please consult the project documentation or contact the development team.

✉ luca.oliveira@sou.unifal-mg.edu.br<br>
✉ guilherme.serafini@sou.unifal-mg.edu.br
