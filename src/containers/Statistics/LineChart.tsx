import { Bar } from 'react-chartjs-2';
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';

export const LineChart = (props) => {
  const theme = useTheme();
  const [data, setData] = useState<any>({ datasets: [] })

  useEffect(() => {
    let dataBonding = [];
    let dataMeeting = [];
    let dataLabels = [];

    props.data.forEach((item: any) => {
      dataBonding.push(item.bonding);
      dataMeeting.push(item.meeting);
      dataLabels.push(item.label);
    })

    let dataToSet = {
      datasets: [
        {
          backgroundColor: '#ff8f00',
          barPercentage: 0.5,
          barThickness: 12,
          borderRadius: 4,
          categoryPercentage: 0.5,
          data: dataBonding,
          label: 'Bonding',
          maxBarThickness: 10
        },
        {
          backgroundColor: 'teal',
          barPercentage: 0.5,
          barThickness: 12,
          borderRadius: 4,
          categoryPercentage: 0.5,
          data: dataMeeting,
          label: 'Meeting',
          maxBarThickness: 10
        }
      ],
      labels: dataLabels
    };

    setData(dataToSet);
  }, [props.data, props.render]);

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider
        }
      }
    ],
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  return (
    <Card {...props}>
      <CardHeader
        title={`Number of meetings (${props.displayTimeRange})`}
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >
          <Bar
            data={data}
            options={options as any}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
