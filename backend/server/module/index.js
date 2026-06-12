import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; 

export const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    // Adding all 3 just to be safe so MySQL never rejects it
    role: { type: DataTypes.ENUM('student', 'faculty', 'admin'), defaultValue: 'student' }
});

export const Announcement = sequelize.define('Announcement', {
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false }
});

export const Event = sequelize.define('Event', {
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    date: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING }
});

export const Resource = sequelize.define('Resource', {
    title: { type: DataTypes.STRING },
    link: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING }
});

// Many-to-Many Association
const Registration = sequelize.define('Registration', {});
User.belongsToMany(Event, { through: Registration });
Event.belongsToMany(User, { through: Registration });

export { sequelize, Registration };