import axios from "axios";
import React from "react";
import {isLoggedIn} from '../helpers';
import {useLoaderData} from 'react-router-dom';
import '../styles/StatsPage.css';
import Plot from 'react-plotly.js';

async function getTask(){
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://localhost:8000';
    let newData = await axios.get('api/records').then(response => {
        return response.data
    }).catch(error => {console.log(error)});
    console.log(newData);
    return newData;
}

export async function statsLoader(){
    const taskData = await getTask();
    return taskData;
}

function sumArray(data) {
    let sum = 0;
    for (var examp of data) {
        sum += examp['sum'];
    }
    return sum;
}


function groupBy(data, groupLabel) {
    let newData = {};

    for (let index = 0; index < data.length; index++) {
        const element = data[index];

        let label = null;

        if (typeof(groupLabel) == 'function') {
            label = groupLabel(element);
        }

        else {
            label = element[groupLabel];
        }

        if (!newData.hasOwnProperty(label)){
            newData[label] = [];
        }
        
        newData[label].push(element);
    }

    return newData;
}

function getUnique(data, dataLabel) {
    let uniqueList = [];


    for (let index = 0; index < data.length; index++) {
        const element = data[index];

        let label = null;

        if (typeof(dataLabel) == 'function') {
            label = dataLabel(element);
        }
        else {
            label = element[dataLabel];
        }

        if (!uniqueList.contains(label)){
            uniqueList.push(label);
        }
    }

    return uniqueList;
}


function SpendIncomeBarPlot(props) {

    let statsData = groupBy(props.tasksData, 'record_type_id');

    Object.keys(statsData).forEach(function(key, index) {
        statsData[key] = sumArray(statsData[key]);
    });

    return (
        <Plot
        data={[
          {
            y: Object.values(statsData),
            x: Object.keys(statsData),
            type: 'bar',
            mode: 'lines+markers',
            marker: {color: ['#050507', 'grey']},
          },
        ]}
        layout={ {width: 520, height: 440, title: 'A Fancy Plot', paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)'} }
      />
    )
}

function PieChartPlot(props) {

    let statsData = groupBy(props.tasksData, 'category_name');

    let spendData = {};

    Object.keys(statsData).forEach(function(key, index) {
        if (statsData[key][0]['record_type_id'] == props.record_type) {
            spendData[key] = sumArray(statsData[key]);
        }
    });

    let title = '';

    if (props.record_type == 1) {
        title = 'Spend Plot';
    }
    else {
        title = 'Income Plot';
    }

    return (
        <Plot
        data={[
          {
            values: Object.values(spendData),
            labels: Object.keys(spendData),
            type: 'pie'
          },
        ]}
        layout={ {width: 520, height: 440, title: title, paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)'} }
      />
    )
}

export function StatsPage(){
    const tasksData = useLoaderData();

    let statsData = groupBy(tasksData, 'category_name');

    // let filters = {
    //     'category_name': getUnique(tasksData, 'category_name'),
    //     'date_start': getUnique(tasksData, 'category_name')
    // }

    return (
        <div className="plot-page-wrapper">
            <div className="filter-wrapper">
                
            </div>
            <div className="plots-wrapper">
                <SpendIncomeBarPlot tasksData={tasksData}/>
                <PieChartPlot tasksData={tasksData} record_type={1}/>
                <PieChartPlot tasksData={tasksData} record_type={2}/>
            </div>
        </div>
    )
}