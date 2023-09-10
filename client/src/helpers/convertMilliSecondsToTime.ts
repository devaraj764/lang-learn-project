export default function millisecondsToTime(milliseconds: number) {
    // Calculate hours, minutes, and seconds
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);

    // Create an array to hold non-zero time units
    const timeUnits = [];

    // Check and add hours if it's non-zero
    if (hours > 0) {
        timeUnits.push(`${hours}hr${hours > 1 ? 's' : ''}`);
    }

    // Check and add minutes if it's non-zero
    if (minutes > 0) {
        timeUnits.push(`${minutes}min${minutes > 1 ? 's' : ''}`);
    }

    // Check and add seconds if it's non-zero
    if (seconds > 0) {
        timeUnits.push(`${seconds}s`);
    }

    // Join the non-zero time units to create the formatted time string
    const timeString = timeUnits.join(', ');

    return timeString;
}
