import React from 'react';
import ReactApexChart from 'react-apexcharts';

const colorPalette = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
  '#98D8C8', '#F06000', '#7FDBFF', '#85144b',
  '#FFDC00', '#001f3f', '#39CCCC', '#3D9970',
  '#2ECC40', '#01FF70', '#FF851B', '#B10DC9',
  '#F012BE', '#FF4136', '#E91E63', '#9C27B0'
];

const LineChartGHGApex = ({ data, hideLegend }) => {
  const years = [...new Set(data.map(item => item.year))];
  const countries = [...new Set(data.map(item => item.country))];

  const series = countries.map(country => ({
    name: country,
    data: years.map(year => {
      const entry = data.find(item => item.year === year && item.country === country);
      return entry ? parseFloat(entry.totalEmissions.toFixed(2)) : null;
    })
  }));

  const options = {
    chart: {
      type: 'line',
      height: 400,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
    },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    colors: colorPalette,
    xaxis: {
      categories: years,
      title: {
        text: 'Year'
      },
      labels: {
        rotate: -45,
        rotateAlways: true,
        trim: false,
        style: {
          fontWeight: 600,
        }
      },
      tickPlacement: 'on'
    },
    yaxis: {
      title: {
        text: 'Total (MtCO2e)'
      },

      labels: {
        style: {
          fontWeight: 600,
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value) => value.toFixed(2)
      }
    },
    legend: {
      position: 'top',
      show: !hideLegend
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 4,
      hover: {
        size: 6
      }
    }
  };

  return (
    <div>
      <ReactApexChart 
        options={options} 
        series={series} 
        type="line" 
        height={300}
      />
    </div>
  );
};

export default LineChartGHGApex;