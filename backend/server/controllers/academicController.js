import { Announcement, Resource } from '../module/index.js';
import { Op } from 'sequelize';

// --- ANNOUNCEMENTS ---

// GET: Fetch all announcements for everyone
export const getAnnouncements = async (req, res) => {
    try {
        const data = await Announcement.findAll({ order: [['createdAt', 'DESC']] });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching announcements" });
    }
};
export const deleteResource = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Resource.destroy({ where: { id } });
        
        if (deleted) {
            res.json({ message: "Resource deleted successfully" });
        } else {
            res.status(404).json({ message: "Resource not found" });
        }
    } catch (error) {
        console.error(" Delete Error:", error);
        res.status(500).json({ message: "Failed to delete resource" });
    }
};

// POST: Faculty creates an announcement
export const createAnnouncement = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Title and Content are required" });
        }
        const note = await Announcement.create({ title, content });
        console.log("Announcement Created:", note.title);
        res.status(201).json(note);
    } catch (error) {
        console.error("Announcement Error:", error);
        res.status(500).json({ message: "Failed to create announcement" });
    }
};

export const deleteAnnouncement = async (req, res) => {
    try {
        await Announcement.destroy({ where: { id: req.params.id } });
        res.json({ message: "Announcement Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
};

export const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        
        // Update the database record where ID matches
        await Announcement.update({ title, content }, { where: { id } });
        
        res.json({ message: "Announcement updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};

// --- RESOURCES ---

// GET: Fetch resources with optional search
export const getResources = async (req, res) => {
    try {
        const { search } = req.query;
        let results;
        if (search && search.trim() !== "") {
            results = await Resource.findAll({
                where: { 
                    title: { [Op.like]: `%${search}%` } 
                }
            });
        } else {
            results = await Resource.findAll({ order: [['createdAt', 'DESC']] });
        }
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Error fetching resources" });
    }
};

// POST: Faculty adds a resource (Link/URL)
export const createResource = async (req, res) => {
    try {
        const { title, link, category } = req.body;
        if (!title || !link) {
            return res.status(400).json({ message: "Title and Link are required" });
        }
        const resource = await Resource.create({ title, link, category: category || 'General' });
        console.log("Resource Saved:", resource.title);
        res.json(resource);
    } catch (error) {
        console.error("Resource Error:", error);
        res.status(500).json({ message: "Failed to save resource" });
    }
};