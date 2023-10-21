import { useState, useEffect } from 'react'
import GridCard from 'src/components/chart/Cards/GridCard'
import useSdk from 'src/Hooks/useSdk'
import Grid from '@material-ui/core/Grid'
import { Box } from '@material-ui/core'
import ModalWithContent from 'src/components/ModalWithContent'
import uniqueId from 'src/utils/uniqueId'




export default function ({ charts, postDelete }) {
  const [data, setData] = useState(null)
  const sdk = useSdk()


  const updateChart = () => {
    const uniqueNames = [...new Set(charts.map(value => value.name))]

    const results = uniqueNames.map((value, index) => ({
      id: uniqueId(index),
      name: value,
      products: charts.filter(v => v.name == value)
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
    <Box p={3} >
      <Grid container justifyContent="center" alignItems="center" style={{
        justifyContent: "space-evenly",
        gap: "20px 0",
        alignItems: "normal"
      }}>
        {
          data ? data.map(value => (
            <GridCard key={value.id} postSubmit={postDelete} chart={value.name} products={value.products} />
          )) : null
        }
      </Grid>
    </Box>
  )
}
