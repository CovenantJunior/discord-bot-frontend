import React from 'react';
import { useTheme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import pt from 'prop-types'
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

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton color="secondary" aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);



function ModalWithContent({title,children,open,setOpen}) {
  const theme = useTheme()
  const extraStyle = {color:theme.palette.primary.contrastText}
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle style={extraStyle} id="customized-dialog-title" onClose={handleClose}>
        {title}
      </DialogTitle>
      <DialogContent style={extraStyle} dividers>
        {children}
      </DialogContent>
    </Dialog>
    
    
  );
}


ModalWithContent.defaultProps = {
  title:"No title",
  children:<div/>,
  open:false,
  setOpen:()=>null
}



ModalWithContent.propTypes = {
  title:pt.oneOfType([pt.string,pt.element]),
  children:pt.element,
  setOpen:pt.func,
  open:pt.bool
}



export default ModalWithContent
