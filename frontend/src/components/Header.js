import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";

const months = [ 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

export default function Header(props) {
    const { city } = props;
    const [currentTime, setCurrentTime] = useState('')

    const createDateString = () => {
        var newDate = new Date();
        return `${newDate.getDate()} ${months[newDate.getMonth()]} ${newDate.getFullYear()} ${newDate.getHours()}:${String(newDate.getMinutes()).padStart(2, '0')} WIB`
    }

    useEffect(() => {
        setCurrentTime(createDateString())
    }, [])

    useEffect(() => {
        setInterval(() => setCurrentTime(createDateString()), 15000)
    }, [])

    return (
        <div className="flex flex-col mb-12 justify-center items-center">
                <Typography variant="h2">
                    {city}
                </Typography>
                <Typography variant="overline">
                    {currentTime}
                </Typography>
        </div>
    );
}