import React, { useEffect, useState } from 'react';
import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { faArrowDown, faArrowUp, faMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Statistics.scss';

export const CardWithChange = (props) => (
  <Card
    sx={{ height: '100%' }}
    {...props}
  >
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            {props.label.toUpperCase()}
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {props.displayNumber}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: props.iconColor,
              height: 56,
              width: 56
            }}
          >
          </Avatar>
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <FontAwesomeIcon
          className={`${props.change < 0 ? "card-change__decrease" : props.change > 0 ?
            "card-change__increase" : "card-change__stable"}`}
          icon={props.change < 0 ? faArrowDown : faArrowUp}></FontAwesomeIcon>
        <Typography
          color={props.change < 0 ? "error" : props.change > 0 ? "green" : "caption"}
          sx={{
            mr: 1
          }}
          variant="body2"
        >
          {props.change}%
        </Typography>
        <Typography
          color="textSecondary"
          variant="caption"
        >
          Since last {props.unit}
        </Typography>
      </Box>
    </CardContent>
  </Card>
)