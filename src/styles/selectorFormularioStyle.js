import { makeStyles } from "@material-ui/core/styles";
import backgroundImage from "../imagenes/41-0.131209001550177303_B.jpg";

const useStyles = makeStyles((theme) => ({
container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#DCE0FE',
  },
  card: {
    display: 'flex',
    width: '80%',
    maxWidth: 700,
    height: "60%",
    backgroundColor: '#fff',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
  imagen: {
    flex: 5,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderTopLeftRadius: 10, 
    borderBottomLeftRadius: 10,
  },
  seleccion: {
    flex: 5,
    padding: 20,
  },
  form: {
    flex: 1,
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
    margin: "auto"
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  textFieldContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  button: {
    margin: "20px 0 0 0",
    width: "100%",
    maxWidth: "350px",
    height: "50px",
    fontSize: "16px",
    borderRadius: "5px",
    boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  textField: {
    margin: "10px 0",
    width: "100%",
    maxWidth: "350px",
  },
}));

export default useStyles;