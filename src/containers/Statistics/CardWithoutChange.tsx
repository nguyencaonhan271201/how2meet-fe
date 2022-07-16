import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';

export const CardWithoutChange = (props) => (
  <Card {...props}>
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
            TOTAL MEETINGS (ALL TIME)
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {props.totalMeeting}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 56,
              width: 56
            }}
          >
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
)