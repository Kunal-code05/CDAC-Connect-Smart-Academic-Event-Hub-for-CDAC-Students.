import { Event, User } from '../module/index.js';

export const getEvents = async (req, res) => {
    const events = await Event.findAll({ include: User });
    res.json(events);
};

export const createEvent = async (req, res) => {
    res.json(await Event.create(req.body));
};

export const registerForEvent = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        const user = await User.findByPk(req.body.userId);
        if (event && user) {
            await event.addUser(user);
            res.json({ message: "Student registered for event" });
        } else {
            res.status(404).json("Not found");
        }
    } catch (err) { res.status(500).json(err); }
};