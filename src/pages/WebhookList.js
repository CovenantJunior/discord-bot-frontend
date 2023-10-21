import { Helmet } from 'react-helmet';
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Pagination,
  Button,
  Typography,
  withStyles,
  useTheme
} from '@material-ui/core';
import ChannelModelToolbar from 'src/components/channel/ChannelModelToolbar';
import WebhookCard from 'src/components/webhook//WebhookCard';
import WebhookForm from 'src/components/webhook//WebhookForm';
import products from 'src/__mocks__/products';
import useSdk from 'src/Hooks/useSdk';
import { useState } from 'react';
import { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import getPaginationSlice from 'src/utils/getPaginationSlice';
import { TablePagination } from '@material-ui/core';



const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitlec = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContentc = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActionsc = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);




const ProductList = () => {
  const sdk = useSdk()
  const [webhooks,setWebhooks] = useState(null)
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [sliceData, setSliceData] = useState([0,limit]);
  const [opennew, setOpennew] = useState(false);
  const [newProduct, setNewProduct] = useState(null);
  const theme = useTheme()
  const extraStyle = {color:theme.palette.primary.contrastText}
  const updateWebhook = ()=>{
    sdk.Webhook.list()
    .then(({data})=>{
      
      setWebhooks(data)
    })
    .catch(err=>console.redirectUnauthorize(err))
  }

  useEffect(()=>{
    updateWebhook()
    return ()=>sdk.abort()
  },[])

  function handlePageChange(event,newPage){
    setPage(newPage)
    setSliceData(getPaginationSlice(newPage,limit))
  }

  function handleLimitChange(event){
    setLimit(event.target.value)
    setSliceData(getPaginationSlice(page,event.target.value))
    
  }


  const postSubmit = (data)=>{
    setOpen(prev=>!prev)
    data||!!webhooks?setWebhooks(prev=>[data,...prev]):updateWebhook()
    setNewProduct(data)
    setOpennew(true)
  }
  return (
    <>
      <Helmet>
        <title>Webhook</title>
      </Helmet>
      {/* modal */}
      <Dialog
          open={open}
          onClose={()=>setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" style={{color:theme.palette.primary.contrastText}}>Create channel webhook</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 3 }}>
              <WebhookForm postSubmit={postSubmit} />
            </Box>
          </DialogContent>
        </Dialog>
      {/* modal */}


      {/* modal new */}
      {newProduct&&(
        <Dialog onClose={()=>{
          setNewProduct(null)
          setOpennew(false)
        }} aria-labelledby="customized-dialog-title" open={opennew}>
          <DialogTitlec id={"customized-dialog-title"+1000} onClose={()=>setOpennew(false)}>
            Copy
          </DialogTitlec>
          <DialogContentc dividers>
            <WebhookCard product={{...newProduct}} />
          </DialogContentc>
        </Dialog>
      )}
      {/* modal */}


      <Box
        sx={{
          backgroundColor: 'primary.main',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <ChannelModelToolbar>
            <Button onClick={()=>setOpen(prev=>!prev)} variant="contained" color="secondary">
              Create webhook
            </Button>
          </ChannelModelToolbar>
          <Box sx={{ pt: 3 }}>
            <Grid
              container
              spacing={3}
            >
              {webhooks?webhooks.slice(...sliceData).map((webhook) => (
                <Grid
                  item
                  key={webhook.id}
                  lg={4}
                  md={6}
                  xs={12}
                >
                  <WebhookCard postDelete={updateWebhook} product={webhook} />
                </Grid>
              )):(
                <CircularProgress color="secondary" thinkness={20} size={100} />
              )}
              {
                webhooks&&!webhooks.length?(
                  <Typography variant="h5">
                    You have no webhook
                  </Typography>
                ):null
              }
            </Grid>
          </Box>
          <Box sx={{ pt: 3 }}>
            <Grid
              container
              spacing={3}
            >
               <TablePagination
                  component="div"
                  style={extraStyle}
                  count={webhooks?webhooks.length+limit:0}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  rowsPerPageOptions={[3,5,20, 50,100,200]}
                />
            </Grid>
          </Box>
          
        </Container>
      </Box>
    </>
  );
}

export default ProductList;
