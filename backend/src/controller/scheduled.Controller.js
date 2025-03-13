const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });  
const Scheduled = require("../model/scheduledSchema.model");

const createScheduledEvent = async (req, res) => {
    try {
        const eventData = req.body;

        if (req.files && req.files.length > 0) {
            eventData.attachments = req.files.map(file => file.buffer);  
        }

        const validRecurrences = ['one-time', 'Daily', 'Weekly', 'Monthly', 'Yearly'];
        if (eventData.recurrence && !validRecurrences.includes(eventData.recurrence)) {
            return res.status(400).json({
                success: false,
                message: `Invalid recurrence value. Allowed values are: ${validRecurrences.join(', ')}`,
            });
        }

        const newEvent = await Scheduled.create(eventData);

        res.status(201).json({
            success: true,
            message: "Scheduled event created successfully",
            data: newEvent,
        });
    } catch (error) {
        console.error("Error creating scheduled event:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};

const getAllScheduledEvents = async (req, res) => {
    try {
        const events = await Scheduled.find({});
        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error("Error fetching scheduled events:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message
        });
    }
};

const getScheduledEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Scheduled.findById(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Scheduled event not found"
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error("Error fetching scheduled event:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message
        });
    }
};

const updateScheduledEvent = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedEvent = await Scheduled.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true, 
        });

        if (!updatedEvent) {
            return res.status(404).json({
                success: false,
                message: "Scheduled event not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Scheduled event updated successfully",
            data: updatedEvent
        });
    } catch (error) {
        console.error("Error updating scheduled event:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message
        });
    }
};

const deleteScheduledEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEvent = await Scheduled.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({
                success: false,
                message: "Scheduled event not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Scheduled event deleted successfully",
            data: deletedEvent
        });
    } catch (error) {
        console.error("Error deleting scheduled event:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message
        });
    }
};

const searchByMonth = async (req, res) => {
    const { month, year } = req.query;

    if (!month || !year) {
        return res.status(400).json({
            success: false,
            message: "Both month and year are required"
        });
    }

    const parsedMonth = parseInt(month, 10);
    const parsedYear = parseInt(year, 10);

    if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
        return res.status(400).json({
            success: false,
            message: "Invalid month. It must be between 1 and 12."
        });
    }
    if (isNaN(parsedYear)) {
        return res.status(400).json({
            success: false,
            message: "Invalid year."
        });
    }

    try {
        const startDate = new Date(parsedYear, parsedMonth - 1, 1);
        const endDate = new Date(parsedYear, parsedMonth, 1);
        const events = await Scheduled.find({
            followUp: {
                $gte: startDate,
                $lt: endDate
            }
        });

        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error("Error searching by month:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message
        });
    }
};

const searchByYear = async (req, res) => {
    const { year } = req.query;

    if (!year) {
        return res.status(400).json({
            success: false,
            message: "Year is required"
        });
    }

    const parsedYear = parseInt(year, 10);

    if (isNaN(parsedYear)) {
        return res.status(400).json({
            success: false,
            message: "Invalid year."
        });
    }

    try {
        const startDate = new Date(parsedYear, 0, 1);
        const endDate = new Date(parsedYear + 1, 0, 1);
        const events = await Scheduled.find({
            followUp: {
                $gte: startDate,
                $lt: endDate
            }
        });

        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error("Error searching by year:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message
        });
    }
};

module.exports = {
    createScheduledEvent,
    getAllScheduledEvents,
    getScheduledEventById,
    updateScheduledEvent,
    deleteScheduledEvent,
    searchByMonth,
    searchByYear,
};
