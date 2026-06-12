import express from 'express';
import { login, register } from '../controllers/authController.js';
import { getAnnouncements, createAnnouncement, deleteAnnouncement, getResources, createResource } from '../controllers/academicController.js';
import { getEvents, createEvent, registerForEvent } from '../controllers/eventController.js';
import { deleteResource } from '../controllers/academicController.js'; // Import it
import { updateAnnouncement } from '../controllers/academicController.js';

// Import the security gate
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- 1. AUTH (Public) ---
router.post('/register', register);
router.post('/login', login);

// --- 2. ANNOUNCEMENTS ---
// Students and Faculty can view
router.get('/announcements', verifyToken, getAnnouncements); 
// Only Faculty can post or delete
router.post('/announcements', verifyToken, isAdmin, createAnnouncement); 
router.delete('/announcements/:id', verifyToken, isAdmin, deleteAnnouncement); 
router.put('/announcements/:id', verifyToken, isAdmin, updateAnnouncement);

// --- 3. EVENTS ---
// Students and Faculty can view
router.get('/events', verifyToken, getEvents); 
// Only Faculty can create events
router.post('/events', verifyToken, isAdmin, createEvent); 
// Students can register for events (This is a student action, so no isAdmin)
router.post('/events/:id/register', verifyToken, registerForEvent); 


// --- 4. RESOURCES ---
// Students and Faculty can view
router.get('/resources', verifyToken, getResources); 
// Only Faculty can upload resources
router.post('/resources', verifyToken, isAdmin, createResource); 
router.delete('/resources/:id', verifyToken, isAdmin, deleteResource);

export default router;