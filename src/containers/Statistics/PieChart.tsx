import { Doughnut } from 'react-chartjs-2';
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';

export const PieChart = (props) => {
  const theme = useTheme();
  const [data, setData] = useState<any>({ datasets: [] })
  const [events, setEvents] = useState<any>([])

  useEffect(() => {
    let dataToSet = {
      datasets: [
        {
          data: [props.data[0].count, props.data[1].count],
          backgroundColor: ['#b71c1c', '#1976d2'],
          borderWidth: 8,
          borderColor: '#FFFFFF',
          hoverBorderColor: '#FFFFFF'
        }
      ],
      labels: ['Bonding', 'Meeting']
    };

    let events = [
      {
        title: 'Bonding',
        value: props.data[0].ratio,
        color: '#b71c1c'
      },
      {
        title: 'Meeting',
        value: props.data[1].ratio,
        color: '#1976d2'
      },
    ];

    setData(dataToSet);
    setEvents(events);
  }, [props.data, props.render]);


  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
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
      <CardHeader title="Event types" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: 'relative'
          }}
        >
          <Doughnut
            data={data}
            options={options as any}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2
          }}
        >
          {events?.map(({
            color,
            title,
            value
          }) => (
            <Box
              key={title}
              sx={{
                p: 1,
                textAlign: 'center'
              }}
            >
              <Typography
                color="textPrimary"
                variant="body1"
              >
                {title}
              </Typography>
              <Typography
                style={{ color }}
                variant="h4"
              >
                {value}
                %
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
