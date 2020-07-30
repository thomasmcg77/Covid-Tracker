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

function LineGraph({ casesType = 'cases', ...props }) {
    const [data, setData] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://corona.lmao.ninja/v3/covid-19/historical/all?lastdays=120')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                let chartData = buildChartData(data, casesType);
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

    const borderColor = () => {
        if(casesType === "cases") {
            return("#CC1034");
        }
        else if(casesType === "deaths") {
            return("#181818");
        }
        else {
            return("#7dd71d")
        }
    }

    const backgroundColor = () => {
        if(casesType === "cases") {
            return("rgba(204, 16, 52, 0.5)");
        }
        else if(casesType === "deaths") {
            return("rgba(24, 24, 24, 0.5)");
        }
        else {
            return("rgba(125, 215, 29, 0.5)")
        }
    }
    

    return (
        <div className={props.className}>
            {data?.length > 0 && (
                <Line
                options={options}
                data={{
                    datasets: [
                        {
                            backgroundColor: backgroundColor,
                            borderColor: borderColor,
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
