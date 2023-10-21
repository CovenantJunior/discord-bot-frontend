import {useState} from 'react'
import pt from 'prop-types'
import {Card, Grid, Typography, Button, Box} from '@material-ui/core'
import ModalWithContent from 'src/components/ModalWithContent'

import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import useSdk from 'src/Hooks/useSdk';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    color:theme.palette.primary.contrastText
  },
}));



function GridCard(props) {
    const {chart,products,postSubmit} = props
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState([])
    const sdk = useSdk()
    const theme = useTheme()
    const extraStyle = {color:theme.palette.primary.contrastText}
    const toggleChecked = (id) => () =>{
      if(selected.indexOf(id) ===-1){
        
        setSelected(prev=>[...prev,id])
      }else{
        setSelected(prev=>prev.filter(prevId=>prevId!==id))
      }
    }

    const handleDlete = ()=>{
      if(selected.length){
        sdk.Chart.deleteList({
          data:{
            ids:selected
          }
        })
        .then(({data})=>{
          setSelected([])
          setOpen(false)
          postSubmit({data})
          window.location.reload()
        })
        .catch(console.redirectUnauthorize)
        .finally(()=>setSelected([]))
      }
    }
    
    const handleSetOpen = (active)=>{
      setSelected([])
      setOpen(active)
    }
    
    
    return (
      <>
      <ModalWithContent open={open} setOpen={handleSetOpen} 
      title={
        <Button onClick={handleDlete} variant="text" style={extraStyle} endIcon={selected.length?<DeleteIcon color="error" />:null} >
          {`Products linked with => ${chart}`}
        </Button>
        } >
        <List className={classes.root}>
          {products.map((chart) => {
            const labelId = `checkbox-list-label-${chart.id}`;

            return (
              <ListItem button selected={selected.indexOf(chart.id) !== -1} key={chart.id} role={undefined} dense button onClick={toggleChecked(chart.id)} >
                <ListItemIcon>
                  <Checkbox
                    
                    edge="start"
                    checked={selected.indexOf(chart.id) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={chart.product_name.split("-").join(" ")} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="comments" color="secondary">
                    <CommentIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </ModalWithContent>
      <Card component={Grid} style={{margin:2,...extraStyle}} item xs={12} sm={3} md={3}>
        <Box p={2} style={{height:"100%", display:"grid", gap:"10px"}}>
          <Typography variant="button">
            Chart
          </Typography>
          <Typography gutterBottom variant="h3">
            {chart}
          </Typography>
          <Button onClick={()=>setOpen(true)} variant="contained" color="secondary">
            Show Products
          </Button>
        </Box>
      </Card>
      </>
    )
}

GridCard.defaultProps = {
  chart:"unknown chart",
  products:[],
  postSubmit:()=>null
}


GridCard.propTypes = {
  chart:pt.string,
  products:pt.arrayOf(pt.object),
  postSubmit:pt.func
}

export default GridCard

