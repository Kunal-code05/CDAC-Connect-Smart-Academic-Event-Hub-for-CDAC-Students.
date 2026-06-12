import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../module/index.js';

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        
        // Map Frontend 'Faculty' to Backend 'admin'
        const dbRole = (role === 'Faculty') ? 'admin' : 'student';

        await User.create({ 
            name, 
            email, 
            password: hashed, 
            role: dbRole 
        });

        res.status(201).json({ message: "User Registered Successfully" });
    } catch (e) {
        console.error("Reg Error:", e);
        res.status(400).json({ error: "Registration Failed: Email might exist" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (user && await bcrypt.compare(password, user.password)) {
            // IMPORTANT: We must include the role in the token!
            const token = jwt.sign(
                { id: user.id, role: user.role }, 
                process.env.JWT_SECRET || 'secret', 
                { expiresIn: '1d' }
            );

            // Send EVERYTHING back to the frontend
            res.json({ 
                token, 
                role: user.role, // should be 'admin'
                name: user.name, 
                id: user.id 
            });
        } else {
            res.status(401).json({ error: "Invalid Email or Password" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};