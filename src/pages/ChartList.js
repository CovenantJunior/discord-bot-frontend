import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import CustomerListResults from 'src/components/customer/CustomerListResults';
import CustomerListToolbar from 'src/components/customer/CustomerListToolbar';
import customers from 'src/__mocks__/customers';
import useSdk from 'src/Hooks/useSdk';
import ChartTable from '../components/chart/ChartTable'
import { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ChartForm from 'src/components/chart/forms/ChartForm';
import ChannelModelToolbar from 'src/components/channel/ChannelModelToolbar'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';
import ChartGridDiplay from '../components/chart/ChartGridDisplay'




export default () => {

  const sdk = useSdk()
  const [charts, setcharts] = useState(null)
  
  const [open, setOpen] = useState(false);
  const theme = useTheme()

const getOptions = () =>{
  sdk.Chart.list({
    parmas:{

    }
  })
  .then(({data})=>{
    setcharts(data)
    
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

 

 
  
  const postSubmit = ()=>{
    setOpen(prev=>!prev)
    getOptions()
  }
  
  return (
    <>
      <Helmet>
        <title>Charts</title>
      </Helmet>
      {/* modal */}
        <Dialog
          open={open}
          onClose={()=>setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          
        >
          <DialogTitle 
          style={{color:theme.palette.primary.contrastText}}
          id="alert-dialog-title">Link TradingView to list of stripe products</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 3 }}>
              <ChartForm postSubmit={postSubmit} />
            </Box>
          </DialogContent>
        </Dialog>
      {/* modal */}
     
      
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
                  variant="contained"
                  onClick={()=>setOpen(prev=>!prev)}
                  style={{marginBottom:10}}
                  color="secondary"
                >
                  Link TradingView chart to a list of stripe product
                </Button>
              </ChannelModelToolbar>
              {charts?(
                <ChartGridDiplay postDelete={postDelete} charts={charts} />

              ):(
                <CircularProgress thickness={10} color="secondary" variant="indeterminate" size={50} />
              )}
            </Box>
          </Container>
        </Box>
      
      
      
    </>
  );

}


