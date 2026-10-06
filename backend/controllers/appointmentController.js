const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { getAppointmentSlots, isValidAppointmentDate } = require('../utils/appointmentSlots');

const ACTIVE_APPOINTMENT_STATUSES = ['pending', 'approved'];

// @desc    Get available appointment slots for a counselor and date
// @route   GET /api/appointment/availability
// @access  Private (Student)
const getAvailableSlots = async (req, res) => {
    try {
        const { counselorId, date } = req.query;

        if (!counselorId || !isValidAppointmentDate(date)) {
            return res.status(400).json({ success: false, message: 'Choose a valid date that is not in the past.' });
        }

        const counselor = await User.findOne({ _id: counselorId, role: 'counselor', isApproved: true });
        if (!counselor) {
            return res.status(400).json({ success: false, message: 'Invalid counselor' });
        }

        const appointments = await Appointment.find({
            counselorId,
            date,
            status: { $in: ACTIVE_APPOINTMENT_STATUSES }
        }).select('time -_id');
        const bookedSlots = new Set(appointments.map((appointment) => appointment.time));

        res.status(200).json({
            success: true,
            data: getAppointmentSlots().filter((slot) => !bookedSlots.has(slot))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Book an appointment (Student only)
// @route   POST /api/appointment/book
// @access  Private (Student)
const bookAppointment = async (req, res) => {
    try {
        const { counselorId, date, time, concern } = req.body;

        if (!counselorId || !date || !time || !concern) {
            return res.status(400).json({ success: false, message: 'Please add all fields' });
        }

        if (!isValidAppointmentDate(date)) {
            return res.status(400).json({ success: false, message: 'Choose a valid date that is not in the past.' });
        }

        if (!getAppointmentSlots().includes(time)) {
            return res.status(400).json({ success: false, message: 'Choose a valid 20-minute appointment slot.' });
        }

        // Verify counselor exists and is actually a counselor
        const counselor = await User.findOne({ _id: counselorId, role: 'counselor', isApproved: true });
        if (!counselor) {
            return res.status(400).json({ success: false, message: 'Invalid counselor' });
        }

        const existingAppointment = await Appointment.findOne({
            counselorId,
            date,
            time,
            status: { $in: ACTIVE_APPOINTMENT_STATUSES }
        });

        if (existingAppointment) {
            return res.status(409).json({ success: false, message: 'That time slot has already been booked. Please choose another slot.' });
        }

        const appointment = await Appointment.create({
            userId: req.user.id,
            counselorId,
            date,
            time,
            concern,
            status: 'pending'
        });

        res.status(201).json({ success: true, data: appointment });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'That time slot has already been booked. Please choose another slot.' });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get my appointments (Student only)
// @route   GET /api/appointment/my
// @access  Private (Student)
const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user.id })
            .populate('counselorId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: appointments.length, data: appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get appointments for logged-in counselor
// @route   GET /api/appointment/counselor
// @access  Private (Counselor)
const getCounselorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ counselorId: req.user.id })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: appointments.length, data: appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update appointment status (Counselor only)
// @route   PATCH /api/appointment/:id/status
// @access  Private (Counselor)
const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!['approved', 'rejected', 'completed'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        let appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Ensure appointment belongs to this counselor
        if (appointment.counselorId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this appointment' });
        }

        appointment.status = status;
        await appointment.save();

        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    bookAppointment,
    getAvailableSlots,
    getMyAppointments,
    getCounselorAppointments,
    updateAppointmentStatus
};
