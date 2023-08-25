import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  cellWithBorder: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default useStyles;