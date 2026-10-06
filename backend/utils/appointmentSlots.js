const SESSION_WINDOWS = [
    { start: 10 * 60, end: 14 * 60 },
    { start: 15 * 60, end: 18 * 60 },
    { start: 19 * 60, end: 22 * 60 }
];

const SLOT_DURATION_MINUTES = 20;

const getAppointmentSlots = () => SESSION_WINDOWS.flatMap(({ start, end }) => {
    const slots = [];
    for (let minute = start; minute + SLOT_DURATION_MINUTES <= end; minute += SLOT_DURATION_MINUTES) {
        const hours = String(Math.floor(minute / 60)).padStart(2, '0');
        const minutes = String(minute % 60).padStart(2, '0');
        slots.push(`${hours}:${minutes}`);
    }
    return slots;
});

const isValidAppointmentDate = (date) => {
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return false;
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`);
    return !Number.isNaN(parsedDate.getTime())
        && parsedDate.toISOString().slice(0, 10) === date
        && date >= new Date().toISOString().slice(0, 10);
};

module.exports = { getAppointmentSlots, isValidAppointmentDate };
