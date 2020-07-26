import React from 'react';
import { Line } from 'react-chartjs-2';
import {useState, useEffect} from 'react';
import numeral from 'numeral';

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridlines: {
                    display: false,
                },
                tricks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
}

function LineGraph({ casesType = 'cases' }) {
    const [data, setData] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                let chartData = buildChartData(data, 'cases');
                setData(chartData);
            });
        }

        fetchData();
        
    }, [casesType]);

    const buildChartData = (data, casesType) => {
        let chartData = [];
        let lastDataPoint;

        for (let date in data.cases) {
            if (lastDataPoint) {
                let newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                };
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    }

    return (
        <div>
            <h1>Im a graph</h1>
            {console.log("Data: ", data)}
            {data?.length > 0 && (
                <Line
                options={options}
                data={{
                    datasets: [
                        {
                            backgroundColor: "rgba(204, 16, 52, 0.5)",
                            borderColor: "#CC1034",
                            data: data
                        },
                    ],
                }} 
            />
            )}
        </div>
    )
}

export default LineGraph;