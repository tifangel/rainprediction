import { Button, Chip, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import CardNumber from "./CardNumber";
import Header from "./Header";


export default function Controls({city, handleCityChange, handleRoofChange, handleAutomaticRoof, data, automaticRoof, roofStatus}) {
    const [localRoofStatus, setLocalRoofStatus] = useState(roofStatus);
    const [localAutomaticRoof, setLocalAutomaticRoof] = useState(automaticRoof);

    const GreyText = withStyles({
        root: {
            color: "#0000008A"
        }
    })(Typography);

    const localHandleRoofChange = (event) => {
        handleRoofChange(event);
        setLocalRoofStatus(event.target.value);
        console.log(`Roof is now ${event.target.value}`)
    }

    const localHandleAutomaticRoof = (event) => {
        handleAutomaticRoof(event);
        setLocalAutomaticRoof(event.target.value);
    }
    
    const renderForm = () => {
        return (
            <div className="flex gap-4 sm:self-start md:self-start lg:self-end">
                <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }} >
                    <InputLabel id="city-label">Ganti Kota</InputLabel>
                    <Select
                        id="city"
                        label="city"
                        value={city}
                        onChange={handleCityChange}
                    >
                        <MenuItem value="bandung">Bandung</MenuItem>
                        <MenuItem value="jakarta">Jakarta</MenuItem>
                        <MenuItem value="malang">Malang</MenuItem>
                    </Select>
                </FormControl>
                
                <FormControl component="fieldset">
                    <FormLabel component="legend">Buka tutup atap secara</FormLabel>
                    <RadioGroup row name="status-atap" value={localAutomaticRoof} onChange={localHandleAutomaticRoof}>
                        <FormControlLabel value="otomatis" control={<Radio color="primary" />} label="Otomatis" />
                        <FormControlLabel value="manual" control={<Radio color="primary" />} label="Manual" />
                    </RadioGroup>
                </FormControl>

                <FormControl component="fieldset">
                    <FormLabel component="legend">Ganti Status Rumah</FormLabel>
                    <RadioGroup row name="status-atap" value={localRoofStatus} onChange={localHandleRoofChange}>
                        <FormControlLabel disabled={localAutomaticRoof == "otomatis"} value="close" control={<Radio color="primary" />} label="Tertutup" />
                        <FormControlLabel disabled={localAutomaticRoof == "otomatis"} value="open" control={<Radio color="primary" />} label="Terbuka" />
                    </RadioGroup>
                </FormControl>
            </div>
        )
    }


    console.log(data);
    return (
        <>
            <Header city={city} />
            <div className="flex mb-4 gap-4 justify-between sm:flex-col-reverse md:flex-col-reverse lg:flex-row">
                { renderForm() }
                <div>
                    <GreyText variant="body1" gutterBottom>
                        Data Terbaru: {data?.timestamp}
                    </GreyText>
                    <div className="flex items-center gap-4">
                        <CardNumber label="Tekanan Udara (kPa)" value={parseFloat(data?.pressure).toFixed(2)} />
                        <CardNumber label="Kelembaban (%)" value={data?.humidity} />
                        <CardNumber label="Suhu (°C)" value={data?.temperature} />
                        <CardNumber label="Sedang Hujan?" value={data?.israin} />
                        <CardNumber label="Nanti Hujan?" value={data?.prediction} />
                        <CardNumber label="Status Rumah" value={localRoofStatus[0].toUpperCase() + localRoofStatus.substring(1)} />
                    </div>

                </div>

            </div>
        </>
    );
}