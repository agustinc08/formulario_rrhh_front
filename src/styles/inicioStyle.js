import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
    sectionTitle: {
      marginBottom: theme.spacing(2),
    },
    table: {
      marginTop: theme.spacing(2),
    },
    subtitulo: {
      fontSize: "22px !important",
      marginBottom: "10px",
      marginTop: "20px",
    },
    tituloPrincipal: {
      fontSize: "46px !important",
      textAlign: "center",
      marginTop: "10px",
    },
  }));
  
  export default useStyles;