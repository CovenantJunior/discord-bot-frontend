import { Helmet } from 'react-helmet';
import { Box, Container, Pagination } from '@material-ui/core';
import CustomerListResults from 'src/components/customer/CustomerListResults';
import CustomerListToolbar from 'src/components/customer/CustomerListToolbar';
import customers from 'src/__mocks__/customers';
import useSdk from 'src/Hooks/useSdk';
import ProductTable from '../components/stripeProduct/ProductTable'
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




export default () => {
  const theme = useTheme()
  const sdk = useSdk()
  const [products, setProducts] = useState(null)
  
  

  const getOptions = (params={limit:20,starting_after:null}) =>{
    
      sdk.Product.list({
        params
      })
      .then(({data})=>{
        
        setProducts(data)
        
      })
      .catch(err=>console.redirectUnauthorize(err))
}




  useEffect(() => {
    getOptions()
    return () => sdk.abort("channel request has been cancelled")
  }, [])

 

 
  
  
  
  return (
    <>
      <Helmet>
        <title>Stripe products</title>
      </Helmet>
      
     
      
      <Box
          sx={{
            backgroundColor: 'primary.main',
            minHeight: '100%',
            py: 3
          }}
        >
          <Container maxWidth={false}>
            
            <Box sx={{ pt: 3 }}>
              
              {products?(
                <ProductTable update={getOptions} channels={products.data} data={products}  />

              ):(
                <CircularProgress thickness={10} color="secondary" variant="indeterminate" size={50} />
              )}
            </Box>
          </Container>
        </Box>
      
      
      
    </>
  );

}


