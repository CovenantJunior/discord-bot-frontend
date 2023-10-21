import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, Grid, LinearProgress, ListSubheader, useTheme, withStyles } from '@material-ui/core';
import { TextField,Select } from 'formik-material-ui';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { useEffect, useState } from 'react';
import useSdk from 'src/Hooks/useSdk';
import InputLabel from '@material-ui/core/InputLabel';
import * as yup from 'yup';
import clsx from 'clsx';

const CustomMenuItem =  withStyles((theme)=>({
  root:{
    color:theme.palette.primary.contrastText,
    
  },
  selected:{
    color:theme.palette.secondary.main
  }
}))(MenuItem)




const schema = yup.object().shape({
  username:yup.string()
})






export default function SubscriberForm({initialValues,postSubmit}={initialValues:{},postSubmit:()=>null}) {
  
  const sdk = useSdk()
  const theme = useTheme()
  const extraStyle = {color:theme.palette.primary.contrastText}
  
  const handleSubmit = (values, { setSubmitting,resetForm }) => {
    
     
     
      if(initialValues.id){
        sdk.Subscribers.update({
          id:initialValues.id,
          data:{
            tradingview_username:values.username
          }
        })
        .then(({data})=>{
          
          resetForm({username:''})
          postSubmit&&postSubmit(data)
          
        })
        .catch(console.error)
        .finally(()=>{
          setSubmitting(false)
        })
        
      }
  }
    
  
    return (
        <Formik
            
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={handleSubmit}
            >
            {({ submitForm, isSubmitting,values }) => (
                <Form>
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    
                  >
                    
                    
                    
                    <Grid item xs={12} style={{width:"100%"}}>

                      <InputLabel htmlFor="username" style={extraStyle}>Tradingview Username</InputLabel>
                      <FormControl style={{width:"100%",marginBottom:10}}>
                        <Field
                          style={extraStyle}
                          component={TextField}
                          name="username"
                          inputProps={{
                            id: 'username',
                            style:extraStyle
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{width:"100%"}}>
                      
                      
                      {isSubmitting && <LinearProgress />}
                      
                      <Button
                          variant="contained"
                          color="secondary"
                          disabled={isSubmitting}
                          onClick={submitForm}
                          fullWidth
                      >
                          Submit
                      </Button>

                    </Grid>
                  </Grid>
                  
                 
                </Form>
            )}
        </Formik>
    )
}
