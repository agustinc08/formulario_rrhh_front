import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  titulo: {
    marginTop: 20,
  },
  centrar: {
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
  },
  cellWithBorder: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default useStyles;