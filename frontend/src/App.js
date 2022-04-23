import React, { useState } from "react";
import './App.css';
import { useQuery, useMutation } from 'react-query';
import CardGraph from "./components/CardGraph";
import Controls from './components/Controls';

const App = () => {

  const [city, setCity] = useState('bandung');
  const [roofStatus, setRoofStatus] = useState('open');
  const [datalast, setDatalast] = useState({
    pressure: 0,
    humidity: 0,
    temperature: 0,
    israin: '-',
    prediction: '-',
  });

  const [dataPress, setDataPress] = useState([]);
  const [dataHum, setDataHum] = useState([]);
  const [dataTemp, setDataTemp] = useState([]);

  const handleCityChange = (event) => {
      setCity(event.target.value);
  }

  const handleRoofChange = (event) => {
    setRoofStatus(event.target.value);
    handleUpdateStatus.mutate(event.target.value);
    console.log(`Roof is now ${event.target.value}`);
  }

  useQuery(
    ['data_payload', city],
    async () => {
      const res = await fetch('http://localhost:8080/get-data/' + city);
      const data = await res.json();
      return data;
    }, {
      onSuccess: (data) => {
        console.log(data);
        setRoofStatus(data?.statusroof);
        const dataLength = data?.data?.length;
        if (dataLength > 0) {
          const lastData = data?.data[dataLength - 1];
          
          setDatalast({
            pressure: lastData?.pressure,
            humidity: lastData?.humidity,
            temperature: lastData?.temperature,
            israin: lastData?.rainDigital === 0 ? 'Ya' : 'Tidak',
            prediction: data?.prediction === -1 ? '-' : data?.prediction === 0 ? 'Ya' : 'Tidak',
          });

          const data_press = [];
          const data_hum = [];
          const data_temp = [];
          data?.data?.forEach((element, index) => {
            data_press.push({
                name: element.date,
                pv: element.pressure,
            });
            data_hum.push({
              name: element.date,
              pv: element.humidity,
            });
            data_temp.push({
              name: element.date,
              pv: element.temperature,
            });
          });
          setDataPress(data_press);
          setDataHum(data_hum);
          setDataTemp(data_temp);

        } else {
          setDatalast({
            pressure: 0,
            humidity: 0,
            temperature: 0,
            israin: '-',
            prediction: '-',
          });
          setDataPress([]);
          setDataHum([]);
          setDataTemp([]);
        }
      }
    }
  );

  const handleUpdateStatus = useMutation(
    async (status) => {
      const res = await fetch('http://localhost:8080/update-status-roof/' + city, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status }),
      });
      const data = await res.json();
      
      return data;
    }, {
        onSuccess: () => {
            console.log("Berhasil update status atap");
        },
        onError: (err) => {
            console.log("Tidak berhasil update status atap");
        }
    }
  );

  return (
    <div className="App">
      <Controls city={city} handleCityChange={handleCityChange} handleRoofChange={handleRoofChange} data={datalast} roofStatus={roofStatus}/>
      <CardGraph dataPress={dataPress} dataHum={dataHum} dataTemp={dataTemp} />
    </div>
  );
}

export default App;
