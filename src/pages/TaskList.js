import { Helmet } from 'react-helmet';
import {
  Box,
  CircularProgress,
  Container,
  Grid
} from '@material-ui/core';
import Budget from 'src/components/dashboard//Budget';
import LatestOrders from 'src/components/dashboard//LatestOrders';
import LatestProducts from 'src/components/dashboard//LatestProducts';
import Sales from 'src/components/dashboard//Sales';
import TasksProgress from 'src/components/dashboard//TasksProgress';
import TotalCustomers from 'src/components/dashboard//TotalCustomers';
import TotalProfit from 'src/components/dashboard//TotalProfit';
import TrafficByDevice from 'src/components/dashboard//TrafficByDevice';
import useSdk from 'src/Hooks/useSdk';
import { useEffect, useState } from 'react';
import TasksProgressCard from 'src/components/task/TaskProgressCard'


const Dashboard = () => {
  const [tasks, settasks] = useState(null)
  const sdk = useSdk()


  const updateTask = () =>{

    sdk.Task.list()
    .then(({data})=>{
      settasks(data)
    })
    .catch(err=>{
      console.redirectUnauthorize(err)
    })
  }


  useEffect(() => {
    updateTask()
    return () => {
      sdk.abort()
    }
  }, [])
  
  return (
    <>
      <Helmet>
        <title>Tasks </title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'primary.main',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <Grid
            container
            spacing={3}
          >
           {tasks?tasks.map(value=>(
             <Grid
                key={value}
                item
                lg={3}
                sm={6}
                xl={3}
                xs={12}
              >
                <TasksProgressCard task={value} />
              </Grid>
           )):(
             <CircularProgress thickness={30} color="secondary" size={50} />
           )}
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default Dashboard;
