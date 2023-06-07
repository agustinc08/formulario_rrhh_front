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
    subtitle: {
      fontSize: "36px",
      fontWeight: "bold",
      marginBottom: "20px",
      borderBottom: "2px solid black",
    },
    mainTitle: {
      fontSize: "2.7rem",
      textAlign: "center",
      marginBottom: "30px",
    },
    tituloPregunta: {
      textAlign: "center",
      marginTop: "15px",
    },
    pregunta: {
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
      padding: theme.spacing(2),
      margin: theme.spacing(2),
      borderRadius: "5px",
      fontFamily: "Roboto, sans-serif",
      fontWeight: "normal",
      width: "100px",
      height: "250px",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
      color: "#333",
      border: "1px solid #ccc",
      lineHeight: "120px",
    },
    enviarButton: {
      marginTop: theme.spacing(2),
    },
  }));

  export default useStyles;