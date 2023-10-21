import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography
} from '@material-ui/core';
import { useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import useSdk from 'src/Hooks/useSdk';
import { createBrowserHistory } from 'history';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles, useTheme } from '@material-ui/core/styles';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}




const Login = () => {
  const navigate = useNavigate();
  const [message,setmessage] = useState({
    type:'',
    message:''
  })
  const [state,setstate] = useState({
    email:'',
    password:''
  })
  const [isSubmitting,setIsSubmitting] = useState(false)
  const history = createBrowserHistory()
  const sdk = useSdk()
  const theme = useTheme()
  const extraStyle = {color:theme.palette.primary.contrastText}


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setmessage({
      type:'',
      message:''
    })
  };

  function handleChange(e){
    setstate(prev=>({...prev,[e.target.name]:e.target.value}))
  }

  function handleSubmit(){
    setIsSubmitting(true)
    sdk.Auth.login({
      data:state
    })
    .then(({data})=>{
      localStorage.setItem("token",data.token)
      setmessage({
        type:"success",
        message:"login successfull"
      })
      
      setstate({email:'',password:''})
      
      window.location.href = "/app/channels/"
    })
    .catch(err=>{
      setmessage({
        type:"error",
        message:"invalid email or password"
      })
      setstate(prev=>({...prev,password:''}))
      console.error(err)
    })
    .finally(()=>{
      setIsSubmitting(false)
    })
  }

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
         
      {
        
        message.message&&message.type?(
          <div style={{position:'absolute'}}>
              <Alert style={{color:theme.palette.primary.contrastText}} onClose={handleClose} severity={message.type}>
                {message.message}
              </Alert>
          </div>

        ):null
      }
      <Box
        sx={{
          backgroundColor: 'primary.dark',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
        <TextField
          fullWidth
          style={extraStyle}
          value={state.email}
          label="enter your email"
          margin="normal"
          name="email"
          InputLabelProps = {{
            style:extraStyle
          }}
          onChange={handleChange}
          inputProps={{
            style:{...extraStyle,backgroundColor:theme.palette.primary.light}
          }}
          type="email"
          variant="outlined"
        />
        <TextField
          fullWidth
          style={extraStyle}
          InputLabelProps = {{
            style:extraStyle
          }}
          inputProps={{
            style:{...extraStyle,backgroundColor:theme.palette.primary.light}
          }}
          value={state.password}
          label="enter your password"
          margin="normal"
          name="password"
          onChange={handleChange}
          type="password"
          variant="outlined"
        />
        <Box sx={{ py: 2 }}>
          <Button
            color="secondary"
            disabled={Boolean(isSubmitting|!state.password|!state.email)}
            endIcon={isSubmitting?<CircularProgress size={10} />:null}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            onClick={handleSubmit}
          >
            Sign in now
          </Button>
        </Box>
        </Container>
      </Box>
    </>
  );
};

export default Login;
