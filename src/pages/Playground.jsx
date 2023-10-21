import {useState,useEffect} from 'react'

import useSdk from 'src/Hooks/useSdk'
import Grid from '@material-ui/core/Grid'
import { Box } from '@material-ui/core'
import uniqueId from 'src/utils/uniqueId'
import GridCard from 'src/components/channel/Cards/GridCard'




export default function Playground() {
    const [channels, setchannels] = useState(null)
    const sdk = useSdk()
    const updateChart = ()=>{
        sdk.Channel.listModels()
        .then(({data})=>{
            console.log(data)
            const uniqueNames = [...new Set(data.map(value=>value.name))]
            
            const results =  uniqueNames.map((value,index)=>({
                id:uniqueId(index),
                name:value,
                products:data.filter(v=>v.name==value)
            }))
            setchannels(results)
            
            
        })
        .catch(console.redirectUnauthorize)
    }
    useEffect(() => {
        updateChart()
        return () => {
            sdk.abort()
        }
    }, [])
    return (
        <Box p={3}>
            <Grid container >

                {
                    channels?channels.map(value=>(
                        <GridCard key={value.id} postSubmit={updateChart} channel={value.name}  products={value.products}  />
                    )):null
                }
            </Grid>
        </Box>
    )
}
