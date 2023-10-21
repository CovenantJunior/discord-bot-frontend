import { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useTheme
} from '@material-ui/core';
import getInitials from 'src/utils/getInitials';
import useSdk from 'src/Hooks/useSdk';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
import getPaginationSlice from 'src/utils/getPaginationSlice';
import EditIcon from '@material-ui/icons/Edit';
import ModalWithContent from '../ModalWithContent';
import UpdateIcon from '@material-ui/icons/Update';
import SubscriberForm from './forms/SubscriberForm'


const SubscriberTable = ({ channels,postDelete,update,data,params, ...rest }={channels:[],postDelete:()=>null,update:null,data}) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [updateIds, setUpdateIds] = useState([]);
  const [updateLoadingIds, setUpdateLoadingIds] = useState([]);
  const [subscribers, setSubscriber] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [deleteData, setDeleteData] = useState({
    id:'',
    submitting:false
  });
  
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const theme = useTheme()
  const sdk = useSdk()
  const extraStyle = {color:theme.palette.primary.contrastText}
  

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = channels.map((channel) => channel.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    updateSubscriberList({limit:event.target.value,offset:event.target.value*page})
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    updateSubscriberList({limit,offset:limit*newPage})
  };

  const handleEdit = (id,username) => e =>{
    setUpdateData({id,username:username||""})
    setUpdateOpen(true)
  }
  const handleDelete = id => e =>{
    setDeleteData(prev=>({...prev,id}))
    setDeleteOpen(true)
  }

  const handleUpdate = id => e =>{

    setUpdateLoadingIds(prev=>[...prev,id])
    sdk.Subscribers.update({
      id,
      data:{}
    })
    .then(data=>{
      setUpdateIds(prev=>[...prev,id])

      
    })
    .catch(console.error)
    .finally(()=>{
      setUpdateLoadingIds(prev=>prev.filter(v=>v!==id))
    })
  }



  const deleteSubscriber = () =>{
    if(!deleteData.id) return
      setDeleteData(prev=>({...prev,submitting:true}))
    sdk.Subscribers.delete({
      id:deleteData.id
    }).then(({data})=>{
      // console.log("deleted",data)
      updateSubscriberList({limit,offset:limit*page})
    }).catch(console.error)
    .finally(()=>{
      setDeleteData({id:'',submitting:false})
      setDeleteOpen(false)
    })
  }

  const updateSubscriberList =(params)=>{
    sdk.Subscribers.list({
      params
    })
    .then(({data})=>{
      
      setSubscriber(data)
    }).catch(console.error)
  }

  const handlePostSubmit = data =>{
    updateSubscriberList({limit,offset:limit*page})
    setUpdateOpen(false)
  }

  const handleSearch = e =>{
    e.preventDefault()
    if(e.target.value){
      updateSubscriberList({limit,offset:limit*page,q:e.target.value})

    }else{
      updateSubscriberList({limit,offset:limit*page})
    }

  }

  useEffect(() => {
    updateSubscriberList(params||{})
    return sdk.abort
  }, [])

  return (
    <>
      <ModalWithContent title="Update subscriber tradingview username" open={updateOpen} setOpen={setUpdateOpen}>
        <SubscriberForm initialValues={updateData} postSubmit={handlePostSubmit} />
      </ModalWithContent>
      <ModalWithContent title="delete subscriber"  open={deleteOpen} setOpen={setDeleteOpen}>
          <Box my={2} display="flex" flexDirection="row" justifyContent="space-evenly">
            <Box mr={2}>
              <Button variant="contained" onClick={()=>setDeleteOpen(false)}>
                cancel
              </Button>

            </Box>
            <Button color="error" variant="contained" onClick={deleteSubscriber} endIcon={deleteData?.submitting?<CircularProgress size={20} color="secondary" />:null}>
              delete
            </Button>

          </Box>
      </ModalWithContent>
      <Box my={{xs:2,md:5}}>
        <TextField onChange={handleSearch} placeholder="Search user" color="secondary" inputProps={{style:{
          color:theme.palette.primary.contrastText,
          backgroundColor:theme.palette.primary.light
        }}} />
      </Box>
      <Card {...rest}>
        <PerfectScrollbar>
          <Box sx={{ minWidth: 1050 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.length === channels.length}
                      style={extraStyle}
                      indeterminate={
                        selectedCustomerIds.length > 0
                        && selectedCustomerIds.length < channels.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell style={extraStyle}>
                    Discord
                  </TableCell>
                  <TableCell style={extraStyle}>
                    Tradingview
                  </TableCell>
                  
                  <TableCell style={extraStyle}>
                    user Token
                  </TableCell>
                  <TableCell style={extraStyle}>
                    -
                  </TableCell>
                  <TableCell style={extraStyle}>
                    -
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscribers?subscribers.results.map((subscriber) => (
                  <TableRow
                    hover
                    key={subscriber.id}
                    selected={selectedCustomerIds.indexOf(subscriber.id) !== -1}
                  >
                    <TableCell padding="checkbox" style={extraStyle}>
                      <Checkbox
                        checked={selectedCustomerIds.indexOf(subscriber.id) !== -1}
                        onChange={(event) => handleSelectOne(event, subscriber.id)}
                        value="true"
                      />
                    </TableCell>
                    <TableCell style={extraStyle}>
                      {subscriber.discord_username||"- - empty - -"}
                    </TableCell>
                    <TableCell style={extraStyle}>
                      <Button style={{color:theme.palette.primary.contrastText,textTransform:"none"}} onClick={handleEdit(subscriber.id,subscriber.tradingview_username)} endIcon={<EditIcon color="secondary" />}>
                        {subscriber.tradingview_username||"- - empty - -"}
                      </Button>
                    </TableCell>
                    <TableCell style={extraStyle}>
                        {subscriber.customer_id}
                    </TableCell>
                    <TableCell style={extraStyle}>
                      <Button endIcon={updateLoadingIds.includes(subscriber.id)?<CircularProgress size={20} color="primary" />:<UpdateIcon  />} onClick={handleUpdate(subscriber.id)} variant="contained" style={updateIds.includes(subscriber.id)?{backgroundColor:theme.palette.success.main,color:theme.palette.success.contrastText}:{backgroundColor:theme.palette.secondary.main,color:theme.palette.secondary.contrastText}}>
                        Update Tradingview
                      </Button>
                      
                    </TableCell>
                    <TableCell style={extraStyle}>
                        <IconButton  onClick={handleDelete(subscriber.id)}>
                          <DeleteIcon  color="error" />
                        </IconButton>
                    </TableCell>
                  </TableRow>
                )):<CircularProgress color="secondary" />}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          style={extraStyle}
          count={subscribers?subscribers.count:0}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[10,20,50,80]}
          
        />
      </Card>
    </>
  );
};


SubscriberTable.propTypes = {
  channels: PropTypes.array.isRequired
};

export default SubscriberTable;
