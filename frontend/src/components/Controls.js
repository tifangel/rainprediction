import { FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select } from "@material-ui/core";
import React, { useState } from "react";
import CardNumber from "./CardNumber";
import Header from "./Header";

export default function Controls() {
    const [city, setCity] = useState('Bandung');
    const [roofStatus, setRoofStatus] = useState("close")

    const handleCityChange = (event) => {
        setCity(event.target.value);
    }

    const handleRoofChange = (event) => {
        setRoofStatus(event.target.value);
        console.log(`Roof is now ${event.target.value}`)
    }

    const renderForm = () => {
        return (
            <div className="flex gap-8 sm:self-start">
                <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }} >
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

                <FormControl component="fieldset">
                    <FormLabel component="legend">Status Rumah</FormLabel>
                    <RadioGroup row name="status-atap" defaultValue={roofStatus} onChange={handleRoofChange}>
                        <FormControlLabel value="close" control={<Radio color="primary" />} label="Tertutup" />
                        <FormControlLabel value="open" control={<Radio color="primary" />} label="Terbuka" />
                    </RadioGroup>
                </FormControl>
            </div>
        )
    }

    return (
        <>
            <Header city={city} />
            <div className="flex mb-4 gap-4 justify-between items-center sm:flex-col md:flex-col lg:flex-row">
                { renderForm() }
                <div className="flex items-center gap-4">
                    <CardNumber label="Tekanan Udara (kPa)" value="91.5" />
                    <CardNumber label="Kelembaban (%)" value="67" />
                    <CardNumber label="Suhu (°C)" value="24" />
                    <CardNumber label="Sedang Hujan?" value="Ya" />
                    <CardNumber label="Nanti Hujan?" value="Tidak" />
                </div>
            </div>
        </>
    );
}