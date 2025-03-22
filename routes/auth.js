const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();
const SECRET = "supersecret"; // Use environment variables in production
const USERS_FILE = "./users.json";

// Read users from JSON file
const readUsers = () => JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));

// Write users to JSON file
const writeUsers = (users) => fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

// 🛡️ Register User
router.post("/register", (req, res) => {
    const { username, email, password, role } = req.body;
    const users = readUsers();

    if (users.find((u) => u.email === email)) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ username, email, password: hashedPassword, role: role || "user" });
    writeUsers(users);

    res.status(201).json({ message: "User registered successfully" });
});

// 🔑 Login & Get JWT Token
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    const user = users.find((u) => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, SECRET, { expiresIn: "1h" });
    res.json({ token });
});

// 🛡️ Middleware: Verify JWT Token
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
};

// 🔒 Protected Route
router.get("/protected", authenticateToken, (req, res) => {
    res.json({ message: `Hello ${req.user.email}, you have accessed a protected route!` });
});

// 🔒 Admin-Only Route
const authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ message: "Access denied" });
    next();
};

router.get("/admin", authenticateToken, authorizeRole("admin"), (req, res) => {
    res.json({ message: `Hello Admin ${req.user.email}, you have accessed an admin-only route!` });
});

module.exports = router;
