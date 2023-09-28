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
      height: "100%",
      padding: "6%"
    },
    enviarButton: {
      marginTop: theme.spacing(2),
    },
    select: {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderWidth: '2px',
          borderColor: theme.palette.primary.main, // Cambia al color primario de MUI
        },
        '&:hover fieldset': {
          borderWidth: '2px',
          borderColor: theme.palette.primary.dark, // Cambia el color al hacer hover
        },
      },
    },
  }));

  export default useStyles;