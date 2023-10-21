import {useState,useEffect} from 'react'
import useSdk from 'src/Hooks/useSdk'
import Grid from '@material-ui/core/Grid'
import { Box } from '@material-ui/core'
import uniqueId from 'src/utils/uniqueId'
import GridCard from './Cards/GridCard'




export default function({channels,postDelete}) {
    const [data, setData] = useState(null)
    const sdk = useSdk()
    
    
    const updateChart = ()=>{
      
      const uniqueNames = [...new Set(channels.map(value=>value.name))]
      
      const results =  uniqueNames.map((value,index)=>({
          id:uniqueId(index),
          name:value,
          products:channels.filter(v=>v.name==value)
      }))
      setData(results)
      
      
    }
    useEffect(() => {
        updateChart()
        return () => {
            sdk.abort()
        }
    }, [])
    return (
        <Box p={3}>
            <Grid container justifyContent="center" alignItems="center" >

                {
                    data?data.map(value=>(
                        <GridCard key={value.id} postSubmit={postDelete} channel={value.name}  products={value.products}  />
                    )):null
                }
            </Grid>
        </Box>
    )
}
