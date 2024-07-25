import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const GroupBarSectorApex = ({ data }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: 'Total (MtCO2e)'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " Mt"
          }
        }
      },
      legend: {
        position: 'top',
      }
    },
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const countries = [...new Set(data.map(item => item.country))];
      const sectors = [...new Set(data.map(item => item.sector))];
      
      const series = sectors.map(sector => ({
        name: sector,
        data: countries.map(country => {
          const item = data.find(d => d.country === country && d.sector === sector);
          return item ? item.totalEmissions : 0;
        })
      }));

      setChartData(prevState => ({
        ...prevState,
        series: series,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: countries
          }
        }
      }));
    }
  }, [data]);

  return (
    <div id="chart">
      <ReactApexChart 
        options={chartData.options} 
        series={chartData.series} 
        type="bar" 
        height={350} 
      />
    </div>
  );
};

export default GroupBarSectorApex;