import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GraphTest({data = []}) {
    return (
        <ResponsiveContainer height={200} width="100%">
          <LineChart
            width="100%"
            height="100%"
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={['auto', 'auto']}/>
            <Tooltip />
            <Line strokeWidth={1.25} type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
    );
  }
