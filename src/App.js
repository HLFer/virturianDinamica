import React, { Component } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import axios from 'axios';
import Influx from 'influxdb-nodejs';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pontos: [{}],
    };
  }

  componentWillMount() {
   this.getdata(); 
  }

  getdata() {
    const Influx = require('influxdb-nodejs');
    const client = new Influx('http://10.0.0.118:8086/telegraf');
    console.log(client)
    client.query("moving_window")
      .where('time', 1, '>')
      .then(data => {
        const dados = data.results[0].series[0].values
        const dadosFormat = dados.slice(Math.max(dados.length - 200, 1))
        let media = null;
        let pontos = [];
        for (let x=0;x<dadosFormat.length;x++){
          pontos.push({
            name: dadosFormat[x][0],
            media: dadosFormat[x][1],
            dp: dadosFormat[x][2]
          })
        }
        console.log(pontos)
        this.setState({ pontos });
      })
      .catch(console.error);
  }

  render() {

    return (
      <div className="container-fluid">
        <center>
          <h1>Classificacao de uma serie temporal</h1>
          <LineChart width={1200} height={600} data={this.state.pontos}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
           <XAxis/>
           <YAxis/>
           <Tooltip/>
           <Line type="monotone" dataKey="media" stroke="purple" activeDot={{r: 8}}/>
           <Line type="monotone" dataKey="dp" stroke="green" activeDot={{r: 8}}/>
           <Legend />
           </LineChart>
        </center>
      </div>
    );
  }
}

export default App;
