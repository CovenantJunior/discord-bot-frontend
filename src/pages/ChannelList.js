import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import CustomerListResults from 'src/components/customer/CustomerListResults';
import CustomerListToolbar from 'src/components/customer/CustomerListToolbar';
import customers from 'src/__mocks__/customers';
import useSdk from 'src/Hooks/useSdk';
import ChannelTable from '../components/channel/ChannelTable'
import ChannelModelTable from '../components/channel/ChannelModelTable'
import { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ChannelForm from 'src/components/channel/forms/ChannelForm';
import ChannelModelToolbar from 'src/components/channel/ChannelModelToolbar'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';
import ChannelGridDisplay from 'src/components/channel/ChannelGridDisplay';



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
          {children}
        </>
      )}
    </div>
  );
}



TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));




export default () => {

  const sdk = useSdk()
  const [channels, setchannels] = useState(null)
  const [channelsModels, setchannelsModels] = useState(null)
  const [open, setOpen] = useState(false);
  const theme = useTheme()
  const extraStyle = {color:theme.palette.primary.contrastText}
  const getOptions = () =>{
  Promise.all([
    sdk.Channel.list(),
    sdk.Channel.listModels()
  ])
  .then(response=>{
    setchannels(response[0].data)
    setchannelsModels(response[1].data)
    
  })
  .catch(err=>console.redirectUnauthorize(err))

}


const postDelete = data =>{
 getOptions()
}

  useEffect(() => {
    getOptions()
    return () => sdk.abort("channel request has been cancelled")
  }, [])

 

  const [value, setValue] = useState(0);
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const postSubmit = ()=>{
    setOpen(prev=>!prev)
    getOptions()
  }
  
  return (
    <>
      <Helmet>
        <title>Channels</title>
      </Helmet>
      {/* modal */}
        <Dialog
          open={open}
          onClose={()=>setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" style={{color:theme.palette.primary.contrastText}}>Create and link a discord channel to a list of products</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 3 }}>
              <ChannelForm postSubmit={postSubmit} />
            </Box>
          </DialogContent>
        </Dialog>
      {/* modal */}
      <AppBar position="static" color="secondary">
        <Tabs value={value}  onChange={handleChange} aria-label="simple tabs example">
          <Tab  label="Linked Discord channels" {...a11yProps(0)} />
          <Tab label="Discord channels" {...a11yProps(1)} />
          
        </Tabs>
      </AppBar>
      
      <TabPanel value={value} index={0}>
        <Box
          sx={{
            backgroundColor: 'primary.main',
            minHeight: '100%',
            py: 3
          }}
        >
          <Container maxWidth={false}>
            
            <Box sx={{ pt: 3 }}>
              <ChannelModelToolbar  >
               
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={()=>setOpen(prev=>!prev)}
                  style={{marginBottom:10}}
                >
                  Add discord channel
                </Button>
              </ChannelModelToolbar>
              {channelsModels?(
                <ChannelGridDisplay postDelete={postDelete} channels={channelsModels} />

              ):(
                <CircularProgress thickness={10} color="secondary" variant="indeterminate" size={50} />
              )}
            </Box>
          </Container>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        
        <Box
          sx={{
            backgroundColor: 'primary.main',
            minHeight: '100%',
            py: 3
          }}
        >
          <Container maxWidth={false}>
            
            <Box sx={{ pt: 3 }}>
              {channels?(
                <ChannelTable postDelete={postDelete} channels={channels} />

              ):(
                <CircularProgress thickness={10} color="secondary" variant="indeterminate" size={50} />
              )}
            </Box>
          </Container>
        </Box>
      </TabPanel>
      
      
      
    </>
  );

}


