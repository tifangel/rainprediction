import { FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import CardNumber from "./CardNumber";
import Header from "./Header";
import { useQuery } from 'react-query';

export default function Controls({city, handleCityChange, data}) {
    const [roofStatus, setRoofStatus] = useState(data?.status);

    const handleRoofChange = (event) => {
        setRoofStatus(event.target.value);
        console.log(`Roof is now ${event.target.value}`)
    }

    useEffect(() => {
        setRoofStatus(data?.status);
        console.log(data.status);
        console.log(roofStatus);
    }, [city, data.status, roofStatus]);

    useQuery(
        ['data_status', roofStatus],
        async () => {
          const res = await fetch('http://localhost:8080/update-status-roof/' + city, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: roofStatus === 'close' ? 0 : 1 }),
          });
          const data = await res.json();
          return data;
        }, {
            onSuccess: (data) => {
                console.log(data);
                setRoofStatus(data?.status);
            }
        }
    )

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
                        <MenuItem value="bandung">Bandung</MenuItem>
                        <MenuItem value="jakarta">Jakarta</MenuItem>
                        <MenuItem value="malang">Malang</MenuItem>
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
                    <CardNumber label="Tekanan Udara (kPa)" value={data?.pressure} />
                    <CardNumber label="Kelembaban (%)" value={data?.humidity} />
                    <CardNumber label="Suhu (°C)" value={data?.temperature} />
                    <CardNumber label="Sedang Hujan?" value={data?.israin} />
                    <CardNumber label="Nanti Hujan?" value={data?.prediction} />
                </div>
            </div>
        </>
    );
}