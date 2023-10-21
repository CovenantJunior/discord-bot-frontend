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
    const {channel,products,postSubmit} = props
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState([])
    const sdk = useSdk()
    const theme = useTheme()

    const toggleChecked = (id) => () =>{
      if(selected.indexOf(id) ===-1){
        
        setSelected(prev=>[...prev,id])
      }else{
        setSelected(prev=>prev.filter(prevId=>prevId!==id))
      }
    }

    const handleDlete = ()=>{
      if(selected.length){
        sdk.Channel.deleteModelList({
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
        <Button onClick={handleDlete} variant="text" style={{color:theme.palette.primary.contrastText}}  endIcon={selected.length?<DeleteIcon color="error" />:null} >
          {`Products linked with => ${channel}`}
        </Button>
        } >
        <List className={classes.root}>
          {products.map((channel) => {
            const labelId = `checkbox-list-label-${channel.id}`;

            return (
              <ListItem button selected={selected.indexOf(channel.id) !== -1} key={channel.id} role={undefined} dense button onClick={toggleChecked(channel.id)} >
                <ListItemIcon>
                  <Checkbox
                    
                    edge="start"
                    checked={selected.indexOf(channel.id) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={channel.product_name.split("-").join(" ")} />
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
      <Card component={Grid} style={{margin:2,color:theme.palette.primary.contrastText,backgroundColor:theme.palette.background.paper}} item xs={12} sm={3} md={3}>
        <Box p={2}>
          <Typography variant="button">
            Channel
          </Typography>
          <Typography gutterBottom variant="h2">
            {channel}
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
  channel:"unknown channel",
  products:[],
  postSubmit:()=>null
}


GridCard.propTypes = {
  channel:pt.string,
  products:pt.arrayOf(pt.object),
  postSubmit:pt.func
}

export default GridCard

