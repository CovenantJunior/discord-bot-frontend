import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, Grid, LinearProgress, useTheme } from '@material-ui/core';
import { TextField,Select } from 'formik-material-ui';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { useEffect, useState } from 'react';
import useSdk from 'src/Hooks/useSdk';
import InputLabel from '@material-ui/core/InputLabel';
import * as yup from 'yup';
import { values } from 'lodash';


const defaultInitialValues = {
  name: '',
  url: 0,
  product_ids: [""],
}


const schema = yup.object().shape({
  name:yup.string(),
  url:yup.string().required(),
  product_ids:yup.array().of(yup.string()).required()
})






export default function ChannelForm({initailValues,postSubmit}={initialValues:null,postSubmit:()=>null}) {
  const [options, setoptions] = useState({
    products:[],
    chart_urls:[]
  })
  const sdk = useSdk()
  const theme = useTheme()
  const extraStyle  = {color:theme.palette.primary.contrastText}
  const handleSubmit = (values, { setSubmitting,resetForm }) => {
    
     const data = {...values,product_ids:values.product_ids.filter(value=>value)}
     
      if(!initailValues){
        sdk.Chart.create({
          data
        })
        .then(({data})=>{
          setSubmitting(false)
          resetForm(defaultInitialValues)
          postSubmit&&postSubmit(data)
        })
        .catch(err=>{
          setSubmitting(false)
          console.redirectUnauthorize(err)
        })
        .finally(()=>{
          window.location.reload()
        })
        
      }else{
        // update code goes here

      }
  }

  useEffect(() => {
      sdk.Chart.listChartResult()
      .then(({data})=>{
        setoptions(prev=>({
          ...prev,
          chart_urls:data,
        }))
        

      })
      .catch(console.redirectUnauthorize)


      sdk.Product.list({
        params:{
          limit:300
        }
      })
    .then(({data})=>{
      setoptions(prev=>({
        ...prev,
        products:data.data
      }))
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
            {({ submitForm, isSubmitting,setFieldValue,values }) => (
                <Form>
                  <Grid
                    container
                    
                    direction="column"
                    justify="center"
                    alignItems="center"
                    
                  >
                    
                    <Grid item xs={12} style={{width:"100%"}}>
                      <InputLabel style={extraStyle} htmlFor="chart-name">Give this chart link a name</InputLabel>
                      <FormControl style={{width:"100%",marginBottom:10}}>
                        <Field
                          style={{...extraStyle,backgroundColor:theme.palette.primary.light}}
                          component={TextField}
                          name="name"
                          type="text"
                          inputProps={{
                            id: 'chart-name',
                            style:extraStyle
                          }}
                        />
                      </FormControl>
                    </Grid>

                    {/* chart url text input */}
                    <Grid item xs={12} style={{width:"100%"}}>

                      <InputLabel style={extraStyle} htmlFor="chart-url">Chart url</InputLabel>
                      <FormControl style={{width:"100%",marginBottom:10,...extraStyle}}>
                        <Field
                          style={{...extraStyle,backgroundColor:theme.palette.primary.light}}
                          component={TextField}
                          name="url"
                          inputProps={{
                            id: 'chart-url',
                            style:extraStyle
                          }}
                        />
                      </FormControl>
                    </Grid>
+
                    {/* chart url select */}
                    <Grid item xs={12} style={{width:"100%"}}>
                    <InputLabel style={extraStyle} htmlFor="chart-url">Or Select url</InputLabel>
                      <FormControl style={{width:"100%",marginBottom:10,...extraStyle}}>
                        <Field
                        style={{...extraStyle}}
                          onChange={(e)=>{
                            setFieldValue("url",e.target.value)
                            let res = options.chart_urls.filter(v=>v.link===e.target.value)
                            if(res.length){
                              setFieldValue("name",res[0].name)
                            }
                          }}
                          component={Select}
                          name="url"
                          
                          inputProps={{
                            id: 'chart-url-select',
                          }}
                          
                        >
                          <MenuItem value={0}>Select chart url</MenuItem>
                          {options.chart_urls?.map((url,index)=>(
                            <MenuItem style={extraStyle} key={url.id} value={url.link}>{url.name}</MenuItem>
                          ))}
                        </Field>
                      </FormControl>

                    </Grid>
                    {/* chart url select */}

                    <Grid item xs={12} style={{width:"100%"}}>
                      <InputLabel style={extraStyle} htmlFor="product-ids">Stripe Products</InputLabel>
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
                          <MenuItem style={extraStyle} value={""}>Select products</MenuItem>
                          {options.products?.map(product=>(
                            <MenuItem style={values.product_ids.includes(product.id)?{color:theme.palette.secondary.main}:extraStyle}  key={product.id} value={product.id}>{product.name.split("-").join(" ")}</MenuItem>
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
