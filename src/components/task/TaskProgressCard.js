import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  LinearProgress,
  Typography,
  Button,
  useTheme
} from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';
import { useState, useEffect,useRef, forwardRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import useSdk from 'src/Hooks/useSdk';
import CancelIcon from '@material-ui/icons/Cancel';


import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const TasksProgress = (props) => {
  const [open, setOpen] = useState(false);
  // status => noaction | pending | done | fail
    const [data, setdata] = useState({
      status:"noaction",
      result:null,
      id:''
    })

    const theme = useTheme()
    const extraStyle = {color:theme.palette.primary.contrastText}
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const reset = ()=>{
      clearInterval(ref.current)
      ref.current=0
      setdata(prev=>({...prev,return:null,status:'noaction'}))
    }

    const sdk = useSdk()
    const ref = useRef(0)

    const performTask = (type)=>{
      setdata(prev=>({...prev,status:"pending"}))
      sdk.Task.perform({
        type
      })
      .then(({data})=>{
        setdata(prev=>({...prev,id:data.id}))
        monitorAndGetResult(data.id)
      })
    }
    const monitorAndGetResult = id =>{

      ref.current = setInterval(()=>{
        sdk.Task.result({id})
        .then(({data})=>{
          
          switch(data.status) {
            case "SUCCESS":
              clearInterval(ref.current)
              setdata(prev=>({...prev,status:"done",result:data.result}))
              break;
            case "STARTED":
              break;
            case "PENDING":
              break;
          
            default:
              clearInterval(timer)
              setdata(prev=>({...prev,status:"fail",result:data.result}))
              break;
          }
        }).catch(err=>console.redirectUnauthorize(err))

      },5000)
      
      
    }

    const cleartTimer = () => {
      
      clearInterval(ref.current)
    }

    useEffect(() => {
      return cleartTimer
    }, [])


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
          <DialogTitle id={"alert-dialog-slide-title"+props.task}>Task result</DialogTitle>
          <DialogContent>
            <DialogContentText id={"alert-dialog-slide-description"+props.task}>
              <pre>
                {JSON.stringify(data.result,null, 4)}
              </pre>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Card
          sx={{ height: '100%' }}
          {...props}
        >
          <CardContent>
            <Grid
              container
              spacing={3}
              sx={{ justifyContent: 'space-between' }}
            >
              <Grid item>
                <Typography
                  style={extraStyle}
                  gutterBottom
                  variant="h6"
                >
                  {props.task.split("_").join(" ").toUpperCase()}
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="h3"
                >
                  <Button variant="contained" onClick={handleClickOpen} color="secondary" disabled={data.status!=="done"}>
                    View Results
                  </Button>
                </Typography>
              </Grid>
              <Grid item>
                <Avatar
                  sx={{
                    backgroundColor:"#e8e8e8",
                    height: 56,
                    width: 56
                  }}
                >
                  {
                    data.status==="noaction"&&(
                      <IconButton color="primary" onClick={()=>{
                        performTask(props.task)
                      }} aria-label="upload picture" component="span">
                        <PlayCircleFilledWhiteIcon fontSize="large" />
                      </IconButton>
                    )
                  }
                  {
                    data.status==="done"&&(
                      <IconButton onClick={reset} color="primary" aria-label="upload picture" component="span">
                        <CheckCircleIcon fontSize="large" />
                      </IconButton>
                    )
                  }
                  {
                    data.status==="pending"&&(
                      <IconButton color="primary" aria-label="upload picture" component="span">
                        <CircularProgress  size={40} />
                      </IconButton>
                    )
                  }
                  {
                    data.status==="fail"&&(
                      <IconButton onClick={reset} color="primary" aria-label="upload picture" component="span">
                        <CancelIcon  size={40} />
                      </IconButton>
                    )
                  }
                </Avatar>
              </Grid>
            </Grid>

            <Box sx={{ pt: 3 }}>
              <LinearProgress
                color="secondary"
                value={100}
                variant={data.status==="pending"?"indeterminate":"determinate"}
              />
            </Box>
          </CardContent>
        </Card>
      </>
    );
}

export default TasksProgress;
