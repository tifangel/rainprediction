import { FormControl, InputLabel, MenuItem, Select, Typography } from "@material-ui/core";
import React, { useState } from "react";
import CardNumber from "./CardNumber";

export default function Header() {
    const [city, setCity] = useState('Bandung');

    const handleCityChange = (event) => {
        setCity(event.target.value);
    }

    const renderDropdown = () => {
        return (
            <FormControl>
                <InputLabel id="city-label">Ganti Kota</InputLabel>
                <Select
                    id="city"
                    label="city"
                    value={city}
                    onChange={handleCityChange}
                >
                    <MenuItem value="Bandung">Bandung</MenuItem>
                    <MenuItem value="Jakarta">Jakarta</MenuItem>
                    <MenuItem value="Malang">Malang</MenuItem>
                </Select>
            </FormControl>
        )
    }

    return (
        <div className="flex flex-col mb-12 justify-center items-center">
                <Typography variant="h2">
                    {city}
                </Typography>
                <Typography variant="overline">
                    15 April 2021 15:59 WIB
                </Typography>
        </div>
    );
}