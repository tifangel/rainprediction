import React, { useState } from "react";
import './App.css';
import { useQuery } from 'react-query';
import CardGraph from "./components/CardGraph";
import Controls from './components/Controls';

const App = () => {

  const [city, setCity] = useState('bandung');
  const [dataAvg, setDataAvg] = useState({
    pressure: 0,
    humidity: 0,
    temperature: 0,
    israin: '-',
    prediction: '-'
  });

  const [dataPress, setDataPress] = useState([]);
  const [dataHum, setDataHum] = useState([]);
  const [dataTemp, setDataTemp] = useState([]);

  const handleCityChange = (event) => {
      setCity(event.target.value);
      console.log(event.target.value);
  }

  useQuery(
    ['data_payload', city],
    async () => {
      const res = await fetch('http://localhost:8080/get-data/' + city);
      const data = await res.json();
      return data;
    }, {
      refetchInterval: 10 * 60 * 1000,
      onSuccess: (data) => {
        console.log(data);
        if (data?.data?.length > 0) {
          const dataLength = data?.data?.length;
          const avgPress = data?.data?.reduce((sum, curr) => sum + Number(curr.pressure), 0) / dataLength;
          const avgHum = data?.data?.reduce((sum, curr) => sum + Number(curr.humidity), 0) / dataLength;
          const avgTemp = data?.data?.reduce((sum, curr) => sum + Number(curr.temperature), 0) / dataLength;
          
          setDataAvg({
            pressure: avgPress,
            humidity: avgHum,
            temperature: avgTemp,
            israin: data?.data[dataLength - 1]?.rainDigital === 0 ? 'Ya' : 'Tidak',
            prediction: data?.prediction === 1 ? 'Ya' : 'Tidak'
          });
  
          const data_press = data?.data?.map((element, index) => {
            const item = {
                name: element.date,
                pv: element.pressure,
            }
            return item
          });
          setDataPress(data_press);
    
          const data_hum = data?.data?.map((element, index) => {
            const item = {
                name: element.date,
                pv: element.humidity,
            }
            return item
          });
          setDataHum(data_hum);
    
          const data_temp = data?.data?.map((element, index) => {
            const item = {
                name: element.date,
                pv: element.temperature,
            }
            return item
          });
          setDataTemp(data_temp);
        } else {
          setDataAvg({
            pressure: 0,
            humidity: 0,
            temperature: 0,
            israin: '-',
            prediction: '-'
          });
          setDataPress([]);
          setDataHum([]);
          setDataTemp([]);
        }
      }
    }
  );

  return (
    <div className="App">
      <Controls city={city} handleCityChange={handleCityChange} data={dataAvg}/>
      <CardGraph dataPress={dataPress} dataHum={dataHum} dataTemp={dataTemp} />
    </div>
  );
}

export default App;
