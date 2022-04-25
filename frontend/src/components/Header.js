import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";

const months = [ 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

export default function Header(props) {
    const { city } = props;
    const [currentTime, setCurrentTime] = useState('')

    const createDateString = () => {
        var newDate = new Date();
        return `${newDate.getDate()} ${months[newDate.getMonth()]} ${newDate.getFullYear()} \ 
            ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')} WIB`
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
                    {city[0].toUpperCase() + city.substring(1)}
                </Typography>
                <Typography variant="overline">
                    {currentTime}
                </Typography>
        </div>
    );
}