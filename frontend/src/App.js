import React, { useEffect, useState } from "react";
import './App.css';
import { useQuery, useMutation } from 'react-query';
import CardGraph from "./components/CardGraph";
import Controls from './components/Controls';

const months = [ 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const App = () => {

  const [city, setCity] = useState('bandung');
  const [roofStatus, setRoofStatus] = useState('-');
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
  }

  const createDateString = (datestring) => {
    var first_part = datestring.split(" ")[0],
        year  = first_part.split("-")[0],
        month = parseInt(first_part.split("-")[1]) - 1,
        day   = first_part.split("-")[2],
        second_part = datestring.split(" ")[1],
        hour   = second_part.split(":")[0],
        minute = second_part.split(":")[1];

    var newDate = new Date(year, month, day, hour, minute);
    return `${newDate.getDate()} ${months[newDate.getMonth()]} ${newDate.getFullYear()} \ 
        ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')} WIB`
}

  useEffect(() => {
    Notification.requestPermission().then(function (permission) {
      console.log(permission);
    });
  }, [])

  useEffect(() => {
    if (datalast.prediction === 'Ya' && roofStatus === 'open') {
      handleUpdateStatus.mutate('close');

      var title = "Pelindung Hujan";
      var body = "Cuaca akan hujan dalam 10 menit. Atap rumah akan ditutup.";
      var notification = new Notification(title, { body });
    } 
    else if (datalast.prediction === 'Tidak' && roofStatus === 'close') {
      handleUpdateStatus.mutate('open');

      var title = "Pelindung Hujan";
      var body = "Hujan akan berhenti dalam 10 menit. Atap rumah akan dibuka.";
      var notification = new Notification(title, { body });
    }
  }, [datalast.prediction, roofStatus])

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
        setRoofStatus(data?.statusroof);
        const dataLength = data?.data?.length;
        if (dataLength > 0) {
          const lastData = data?.data[dataLength - 1];
          
          setDatalast({
            timestamp: createDateString(lastData?.date),
            pressure: lastData?.pressure / 1000,
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
              value: element.pressure / 1000,
            });
            data_hum.push({
              name: element.date,
              value: element.humidity,
            });
            data_temp.push({
              name: element.date,
              value: element.temperature,
            });
          });
          setDataPress(data_press);
          setDataHum(data_hum);
          setDataTemp(data_temp);

        } else {
          setDatalast({
            timestamp: '-',
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
            alert("Berhasil update status atap");
        },
        onError: (err) => {
            alert("Tidak berhasil update status atap");
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
