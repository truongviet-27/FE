import React, { useEffect, useState } from "react";

export default function OtpCountdown({ otpExpire }) {
    const [timeLeft, setTimeLeft] = useState(otpExpire - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const newTimeLeft = otpExpire - Date.now();
            if (newTimeLeft <= 0) {
                setTimeLeft(0);
                clearInterval(interval);
            } else {
                setTimeLeft(newTimeLeft);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [otpExpire]);

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <div>
            OTP expires in: <strong>{formatTime(timeLeft)}</strong>
        </div>
    );
}
