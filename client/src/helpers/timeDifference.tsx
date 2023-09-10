export default function timeDifference(input: Date): string {
    const timestamp = Date.parse(input.toString())
    const currentTime = new Date();
    const targetTime = new Date(timestamp * 1000); // Convert to milliseconds

    const timeDiffInSeconds = Math.floor((currentTime.getTime() - targetTime.getTime()) / 1000);
    const timeDiffInMinutes = Math.floor(timeDiffInSeconds / 60);
    const timeDiffInHours = Math.floor(timeDiffInMinutes / 60);
    const timeDiffInDays = Math.floor(timeDiffInHours / 24);
    const timeDiffInMonths = (currentTime.getFullYear() - targetTime.getFullYear()) * 12 + (currentTime.getMonth() - targetTime.getMonth());

    if (timeDiffInSeconds < 60) {
        return "today";
    } else if (timeDiffInSeconds < 120) {
        return "yesterday";
    } else if (timeDiffInDays < 7) {
        return timeDiffInDays + " days ago";
    } else if (timeDiffInDays < 30) {
        return Math.floor(timeDiffInDays / 7) + " weeks ago";
    } else {
        return timeDiffInMonths + " months ago";
    }
}
