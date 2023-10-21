import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
  Button,
  CircularProgress,
  useTheme
} from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import GetAppIcon from '@material-ui/icons/GetApp';
import { forwardRef, useRef } from 'react';
import moment from 'moment';
import { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import useSdk from 'src/Hooks/useSdk';



const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});




/*
"id":webhook.id,
"channel_id":webhook.channel_id,
"channel_name":webhook.channel_name,
"created_at":webhook.created_at,
"name":webhook.name,
"token":webhook.token,
"type":str(webhook.type),
"url":webhook.url
 */


const ProductCard = ({ product,postDelete, ...rest }={postDelete:()=>null}) => {
  const ref = useRef()
  const sdk = useSdk()
  const [open,setOpen] = useState(false)
  const [submitting,setsubmitting] = useState(false)
  const theme = useTheme()
  const extraStyle = {color:theme.palette.primary.contrastText}


  const handleClose = () => {
    setOpen(false);
  };

  const copy = ()=>{
    ref.current.select()
    document.execCommand('copy');
  }


  const handelDelete =()=>{
    setsubmitting(true)
    sdk.Webhook.delete({
      id:product.id
    })
    .then(({data})=>{
      setsubmitting(false)
      setOpen(false)
      postDelete(data)
    })
    .catch(err=>{
      setsubmitting(false)
      setOpen(false)
      console.redirectUnauthorize(err)
    })
  }

  return (
    <>
    <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText style={extraStyle} id={"alert-dialog-slide-description"+1000}>
            {`You are deleting ${product.name} webhook,are you sure of this?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)} disabled={submitting} color="secondary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handelDelete} disabled={submitting} endIcon={submitting?<CircularProgress size={10} />:null}  color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
        {...rest}
      >
        <CardContent>
          <Typography
            align="center"
            style={extraStyle}
            gutterBottom
            variant="h4"
          >
            channel: {product.channel_name}
          </Typography>
          <Typography
            align="center"
            style={extraStyle}
            gutterBottom
            variant="h4"
          >
            webhook: {product.name}
          </Typography>
          <Grid
            style={{width:'100%'}}
            alignItems="center"
            justifyContent="center"
          >
            <TextField 
            
            fullWidth inputRef={ele=>ref.current=ele} id={product.id.toString()} label="url" 
            InputLabelProps={{style:extraStyle}}
            inputProps={{style:{...extraStyle,backgraoundColor:theme.palette.primary.light}}} variant="outlined" value={product.url} />
          </Grid>
    
        </CardContent>
        <Box sx={{ flexGrow: 1 }} />
        <Divider />
        <Box sx={{ p: 2 }}>
          <Grid
            container
            spacing={2}
            sx={{ justifyContent: 'space-between' }}
          >
            <Grid
              item
              sx={{
                alignItems: 'center',
                display: 'flex'
              }}
            >
              <AccessTimeIcon color="secondary" />
              <Typography
                style={extraStyle}
                display="inline"
                sx={{ pl: 1 }}
                variant="body2"
              >
                {moment(product.created_at).format('Do MMMM YYYY')}
              </Typography>
            </Grid>
            <Grid
              item
              sx={{
                alignItems: 'center',
                display: 'flex'
              }}
            >
              <Button onClick={copy} variant="contained" color="secondary">
                Copy
              </Button>
              <Button style={{marginLeft:20}} onClick={()=>setOpen(true)} variant="contained" color="error">
                Delete
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  );
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductCard;
