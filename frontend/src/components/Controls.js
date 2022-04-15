import { FormControl, InputLabel, MenuItem, Select, Typography } from "@material-ui/core";
import React, { useState } from "react";
import CardNumber from "./CardNumber";

export default function Controls() {
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
        <div className="flex flex-col mb-4 gap-4 justify-center items-center">
            <div className="flex items-center gap-4">
                <CardNumber label="Tekanan Udara (kPa)" value="91.5" />
                <CardNumber label="Kelembaban (%)" value="67" />
                <CardNumber label="Suhu (°C)" value="24" />
                <CardNumber label="Sedang Hujan?" value="Ya" />
                <CardNumber label="Nanti Hujan?" value="Tidak" />
            </div>
        </div>
    );
}