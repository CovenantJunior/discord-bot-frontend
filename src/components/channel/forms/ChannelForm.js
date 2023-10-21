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


const defaultInitialValues = {
  server: 0,
  name: '',
  topic: '',
  channel: '0',
  product_ids: [""],
}


const schema = yup.object().shape({
  server:yup.string().required(),
  name:yup.string().required().default("no name"),
  topic:yup.string().required().default("general"),
  channel:yup.string(),
  product_ids:yup.array().of(yup.string()).required()
})






export default function ChannelForm({initailValues,postSubmit}={initialValues:null,postSubmit:()=>null}) {
  const [options, setoptions] = useState({
    servers:[],
    products:[],
    channels:[]
  })
  const sdk = useSdk()
  const theme = useTheme()
  const extraStyle = {color:theme.palette.primary.contrastText}
  
  const handleSubmit = (values, { setSubmitting,resetForm }) => {
    
     const data = {...values,product_ids:values.product_ids.filter(value=>value)}
     
      if(!initailValues){
        sdk.Channel.create({
          data
        })
        .then(({data})=>{
          setSubmitting(false)
          resetForm(defaultInitialValues)
          postSubmit&&postSubmit(data)
          window.location.reload()
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
    Promise.all([
      sdk.Product.list({
        params:{
          limit:300
        }
      }),
      sdk.Server.list(),
      sdk.Channel.list()
    ])
    .then(response=>{
      const groups = [...new Set(response[2].data.map(channel=>channel.category))]
      const channels = []

      groups.forEach(value=>{
        channels.push(value)
        response[2].data.filter(v=>v.category===value).forEach(v=>{
          channels.push(v)
        })
 
      })
      

      setoptions({
        products:response[0].data.data,
        servers:response[1].data,
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
            {({ submitForm, isSubmitting,values }) => (
                <Form>
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    
                  >
                    <Grid item xs={12} style={{width:"100%"}}>
                        <InputLabel htmlFor="discord-server" style={extraStyle}>Server</InputLabel>
                      <FormControl style={{width:'100%',marginBottom:10}}>
                        <Field
                          
                          style={extraStyle}
                          component={Select}
                          name="server"
                          inputProps={{
                            id: 'discord-server'
                          }}
                          
                        >
                          <MenuItem value={0} style={extraStyle}>Select a discord server</MenuItem>
                          {options.servers.map(server=>(
                            <MenuItem key={server.id} value={server.id} style={extraStyle}>{server.name}</MenuItem>
                          ))}
                        </Field>
                      </FormControl>
                    </Grid>
                    {/* channels */}
                    <Grid item xs={12} style={{width:"100%"}}>
                        <InputLabel htmlFor="discord-server" style={extraStyle}>Channel</InputLabel>
                      <FormControl style={{width:'100%',marginBottom:10}}>
                        <Field
                          style={extraStyle}
                          component={Select}
                          name="channel"
                          inputProps={{
                            id: 'discord-channel',
                          }}
                          
                        >
                          <MenuItem value={"0"} style={extraStyle}>Select a discord channel</MenuItem>
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
                    {
                      !values.channel?(
                        <>
                          <Grid item xs={12} style={{width:"100%"}}>
                            <InputLabel htmlFor="channel-name" style={extraStyle}>Channel name</InputLabel>
                            <FormControl style={{width:"100%",marginBottom:10}}>
                              <Field
                                component={TextField}
                                name="name"
                                type="text"
                                inputProps={{
                                  id: 'channel-name',
                                  style:extraStyle
                                }}
                                style={extraStyle}
                              />
                            </FormControl>
                          </Grid>

                          
                          <Grid item xs={12} style={{width:"100%"}}>

                            <InputLabel htmlFor="channel-topic" style={extraStyle}>Channel Topic</InputLabel>
                            <FormControl style={{width:"100%",marginBottom:10}}>
                              <Field
                                style={extraStyle}
                                component={TextField}
                                name="topic"
                                inputProps={{
                                  id: 'channel-topic',
                                  style:extraStyle
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </>

                      ):null
                    }
                    {/* channel */}
                    
                    <Grid item xs={12} style={{width:"100%"}}>
                      <InputLabel htmlFor="product-ids" style={extraStyle}>Stripe Products</InputLabel>
                      <FormControl style={{width:"100%",marginBottom:10}}>
                        <Field
                          style={extraStyle}
                          component={Select}
                          name="product_ids"
                          multiple
                          inputProps={{
                            id: 'product-ids',
                          }}
                          
                        >
                          <MenuItem value={""} style={extraStyle}>Select products</MenuItem>
                          {options.products.map(product=>(
                            <MenuItem   
                            key={product.id} 
                            value={product.id} 
                              style={{color:values.product_ids.includes(product.id)?theme.palette.secondary.main:theme.palette.primary.contrastText}}
                            >
                              {product.name.split("-").join(" ")}
                            </MenuItem>
                          ))}
                        </Field>
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
