import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, Grid, LinearProgress, ListSubheader, useTheme } from '@material-ui/core';
import { TextField,Select } from 'formik-material-ui';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { useEffect, useState } from 'react';
import useSdk from 'src/Hooks/useSdk';
import InputLabel from '@material-ui/core/InputLabel';
import * as yup from 'yup';


const defaultInitialValues = {
  name: '',
  channel: 0,
  reason: "",
}


const schema = yup.object().shape({
  name:yup.string().required(),
  channel:yup.string().required(),
  reason:yup.string(),
})






export default function ChannelForm({initailValues,postSubmit}={initialValues:null,postSubmit:()=>null}) {
  const [options, setoptions] = useState({
    channels:[],
  })
  const sdk = useSdk()
  const theme = useTheme()
  const extraStyle = {color:theme.palette.primary.contrastText}
  const handleSubmit = (values, { setSubmitting,resetForm }) => {
    
     
     
      if(!initailValues){
        sdk.Webhook.create({
          data:values
        })
        .then(({data})=>{
          
          setSubmitting(false)
          resetForm(defaultInitialValues)
          postSubmit(data)
        })
        .catch(err=>{
          setSubmitting(false)
          console.redirectUnauthorize(err)
        })
        
      }else{
        // update code goes here

      }
  }

  useEffect(() => {
      sdk.Channel.list({
        params:{

        }
      })
    .then(({data})=>{
      const groups = [...new Set(data.map(channel=>channel.category))]
      const channels = []

      groups.forEach(value=>{
        channels.push(value)
        data.filter(v=>v.category===value).forEach(v=>{
          channels.push(v)
        })
 
      })

      
      setoptions({
        channels
      })
    })
    .catch(err=>console.redirectUnauthorize(err))

    
    return () => sdk.abort()
  }, [])

    return (
        <Formik
        
            initialValues={initailValues||defaultInitialValues}
            validationSchema={schema}
            onSubmit={handleSubmit}
            >
            {({ submitForm, isSubmitting }) => (
                <Form>
                  <Grid
                    container
                    
                    direction="column"
                    justify="center"
                    alignItems="center"
                    
                  >
                    
                    <Grid item xs={12} style={{width:"100%"}}>
                      <InputLabel htmlFor="webhook-name" style={extraStyle}>webhook name</InputLabel>
                      <FormControl style={{width:"100%",marginBottom:10,...extraStyle}}>
                        <Field
                          style={{...extraStyle,backgroundColor:theme.palette.primary.light}}
                          component={TextField}
                          name="name"
                          type="text"
                          inputProps={{
                            id: 'webhook-name',
                            style:extraStyle
                          }}
                        />
                      </FormControl>
                    </Grid>

                    

                    {/* chart url select */}
                    <Grid item xs={12} style={{width:"100%"}}>
                    <InputLabel htmlFor="channels">Select a discord channel</InputLabel>
                      <FormControl style={{width:"100%",marginBottom:10}}>
                        <Field
                          style={extraStyle}
                          component={Select}
                          name="channel"
                          
                          inputProps={{
                            id: 'channels',
                          }}
                          
                        >
                          <MenuItem value={0} style={extraStyle}>Select discord channel</MenuItem>
                          {options.channels.map((channel,index)=>{
                            
                            return typeof channel == "object"?(
                              <MenuItem key={channel.id} value={channel.id} style={extraStyle}>{channel.name}</MenuItem>
                            ):(
                              <ListSubheader key={channel} style={{marginTop:20,...extraStyle}}>
                                {channel}
                              </ListSubheader>
                            )
                          
                          }
                          )}
                        </Field>
                      </FormControl>

                    </Grid>



                    <Grid item xs={12} style={{width:"100%"}}>
                      <InputLabel htmlFor="webhook-Reason">Reason</InputLabel>
                      <FormControl style={{width:"100%",marginBottom:10}}>
                        <Field
                          style={{...extraStyle,backgroundColor:theme.palette.primary.light}}
                          component={TextField}
                          name="reason"
                          type="text"
                          inputProps={{
                            id: 'webhook-reason',
                            style:extraStyle
                          }}
                        />
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} style={{width:"100%"}}>
                      
                      
                      {isSubmitting && <LinearProgress color="secondary" />}
                      
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
