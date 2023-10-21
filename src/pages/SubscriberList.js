import { Helmet } from 'react-helmet';
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Pagination, TablePagination, Typography, useTheme
} from '@material-ui/core';
import ProductListToolbar from 'src/components/product/ProductListToolbar';
import SubscriberCard from 'src/components/subscriber/SubscriberCard';
import products from 'src/__mocks__/products';
import { useEffect, useState } from 'react';
import useSdk from 'src/Hooks/useSdk';
import {  isEmpty } from 'lodash'





const ProductList = () => {
  const [subscribers, setsubscribers] = useState(null)
  const [page, setPage] = useState(0)
  const [limit, setlimit] = useState(20)
  const sdk = useSdk()
  const theme = useTheme()
  const extraStyle = {color:theme.palette.primary.contrastText}

  // const updateNext = ()=>{
  //   getSubscribers(subscribers[subscribers.length-1].id)
  // }
 
  const handleChange =(event,newPage) =>{
    
    if(newPage>page){
      
      if(subscribers?subscribers.has_more:true){
        setPage(newPage)
        getSubscribers({limit,starting_after:subscribers.data[subscribers.data.length-1].id})
      }
    }else if(newPage<page){
      setPage(newPage)
      getSubscribers({limit,ending_before:subscribers.data[0].id})

    }

  }


  const getSubscribers = (params={limit,starting_after:null,ending_before:null})=>{
    sdk.Subscription.list({
      params
    })
    .then(({data})=>{
      
      setsubscribers(data)
    })
    .catch(err=>console.redirectUnauthorize(err))
  }

  useEffect(() => {
    getSubscribers()
    return () => {
      sdk.abort()
    }
  }, [])

  function handleChangeRowsPerPage(event){
    setlimit(event.target.value)
    getSubscribers({limit:event.target.value})
  }


  return (
    <>
      <Helmet>
        <title>Stripe Subscribers</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'primary.main',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <Typography variant="h3" color={theme.palette.primary.contrastText}>
            Subscription List
          </Typography>
          {/* <ProductListToolbar /> */}
          <Box sx={{ pt: 3 }}>
            <Grid
              container
              spacing={3}
            >
              {subscribers?subscribers.data.map((product) => {
                
                return !isEmpty(product.metadata)?(
                  
                  <Grid
                    item
                    key={product.id}
                    lg={4}
                    md={6}
                    xs={12}
                  >
                      <SubscriberCard product={product}  />
                  </Grid>
                ):null
              }
                
              ):(
                <CircularProgress thickness={10} color="secondary" size={100}  />
                )}
            </Grid>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pt: 3
            }}
          >
            <TablePagination
              style={extraStyle}
              component="div"
              count={-1}
              page={page}
              onPageChange={handleChange}
              rowsPerPage={limit}
              rowsPerPageOptions={[5,20,50,100]}
              onRowsPerPageChange={handleChangeRowsPerPage}
              
            />
            
          </Box>
        </Container>
      </Box>
    </>
  )
};

export default ProductList;
