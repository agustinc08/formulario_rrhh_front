import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    divMain: {
      '& h2, & .MuiListItem-root': {
        fontFamily: 'Roboto, sans-serif',
      },
      '& h2': {
        marginBottom: 0
      }
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalContent: {
      backgroundColor: "white",
      width: "60%",
      maxHeight: "80vh",
      overflowY: "auto",
      padding: theme.spacing(2),
      position: "relative",
      border: "none !important",
    },
    drawer: {
      width: 140,
      flexShrink: 0,
    },
    drawerPaper: {
      width: 140,
      textAlign: "center",
    },
  
    gridPrincipal: {
      margin: '0 auto',
      [theme.breakpoints.up('sm')]: {
        margin: '0 5%',
      },
      [theme.breakpoints.up('md')]: {
        margin: '0 7%',
      },
      [theme.breakpoints.up('lg')]: {
        margin: '0 10%',
      },
    },
    gridIzquierdo: {
      display: 'flex',
      flexDirection: 'column',
    },
    gridDerecho: {
      display: 'flex',
      flexDirection: 'column',
    },
    boxIzquierdo: {
      flex: '0',
    }, 
    boxDerecho: {
      flex: '1',
    },
    boxCrearInicio:{
      [theme.breakpoints.up('md')]: {
        marginBottom: theme.spacing(7),
      },
    },
    boxForm: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      padding: theme.spacing(2),
      marginTop: theme.spacing(5),
    },
    form: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    tituloForm: {
      fontSize: "20px",
    },
    formCrearInicio:{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    formControl:{
      width: "100%",
    },
    textField: {
      margin: theme.spacing(2),
      width: "70%",
    },
    button: {
      margin: theme.spacing(2),
      width: "80%"
    },
    cardCreacion: {
      [theme.breakpoints.up('xs', 'sm')]: {
        paddingTop: "0px !important",
      },
    },
    mb60px: {
      marginBottom: "60px !important",
    },
    mt60px: {
      marginTop: "60px !important",
    },
  }));

  export default useStyles;