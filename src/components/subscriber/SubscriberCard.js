import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import SurroundSoundIcon from '@material-ui/icons/SurroundSound';
import TelegramIcon from '@material-ui/icons/Telegram';
import TimerIcon from '@material-ui/icons/Timer';
import moment from 'moment';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    color:theme.palette.primary.contrastText
  },
}));


/* metadata
  email: "verdulj@gmail.com"
  first_name: "jackenson"
  ip_address: "170.250.161.73"
  last_name: "verdul"
  order_id: "27938009"
  source: "Thinkific"
  telegram_username: "jackpotpmg"
  tradingview_username_go_to_tradingviewco: "jackpotpmg"
 */

const ProductCard = ({ product, ...rest }) => {
  const theme = useTheme()
  const extraStyle = {color:theme.palette.primary.contrastText}
  const classes = useStyles();

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
      {...rest}
    >
      <CardContent>
        <List className={classes.root}>
          <ListItem>
            <ListItemAvatar>
              <Avatar style={{backgroundColor:'white'}}>
                <AccountCircleIcon color="primary" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={product.metadata.first_name+" "+product.metadata.first_name} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar style={{backgroundColor:'white'}}>
                <EmailIcon color="primary" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={product.metadata.email}  />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar style={{backgroundColor:'white'}}>
                <SurroundSoundIcon color="primary" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={product.metadata.source}  />
          </ListItem>
          {product.metadata.telegram_username&&(
            <ListItem>
              <ListItemAvatar>
                <Avatar style={{backgroundColor:'white'}}>
                  <TelegramIcon color="primary" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={product.metadata.telegram_username}  />
            </ListItem>
          )}
          {product.metadata.tradingview_username_go_to_tradingviewco&&(
            <ListItem>
              <ListItemAvatar>
                <Avatar src="/static/images/icons/tradingview.png" />
              </ListItemAvatar>
              <ListItemText primary={product.metadata.tradingview_username_go_to_tradingviewco}  />
            </ListItem>
          )}
          {product.metadata.discord_username&&(
            <ListItem>
              <ListItemAvatar>
                <Avatar src="/static/images/icons/discord.png" />
              </ListItemAvatar>
              <ListItemText primary={product.metadata.discord_username}  />
            </ListItem>
          )}
        </List>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2 }}>
        <Grid
          container
          spacing={2}
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid
            item
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
            <TimerIcon color="secondary"  />
            <Typography
              style={extraStyle}
              display="inline"
              sx={{ pl: 1 }}
              variant="body2"
            >
              {moment(product.current_period_end*1000).format("Do MMM YYYY")}
            </Typography>
          </Grid>
          
        </Grid>
      </Box>
    </Card>
  )
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductCard;
