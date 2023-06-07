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
      width: 400,
      maxHeight: "80vh",
      overflowY: "auto",
      padding: theme.spacing(2),
      position: "relative",
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
      height: '85vh',
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
      flex: '1',
    },
    boxDerecho: {
      flex: '1',
    },
    boxForm: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: theme.spacing(2),
      marginTop: "30px",
    },
    form: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
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
  }));

  export default useStyles;