import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
} from "@material-ui/core";
import useStyles from "../../styles/buscadorStyle";

const RespuestasTable = ({
  sortedRespuestas,
  sortConfig,
  handleSort,
  preguntas,
  dependencias,
  tipoRespuestaDescripciones
  
}) => {
  const classes = useStyles();
  console.log(sortedRespuestas);

  const getDependenciaNombre = (dependenciaId) => {
    // Buscar la dependencia por su ID y devolver su nombre
    const dependencia = dependencias.find((dep) => dep.id === dependenciaId);
    return dependencia ? dependencia.nombreDependencia : "Dependencia no encontrada";
  };

  const getTipoRespuestaDescripcion = (tipoRespuestaId) => {
    // Verificar si tipoRespuestaDescripciones es un objeto y contiene la clave tipoRespuestaId
    if (typeof tipoRespuestaDescripciones === 'object' && tipoRespuestaDescripciones !== null) {
      return tipoRespuestaDescripciones.hasOwnProperty(tipoRespuestaId)
        ? tipoRespuestaDescripciones[tipoRespuestaId]
        : "Tipo de respuesta no encontrado";
    } else {
      return "Tipo de respuesta no encontrado";
    }
  };
  
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className={classes.cellWithBorder}>
            <TableSortLabel
              active={sortConfig.field === "id"}
              direction={
                sortConfig.field === "id" ? sortConfig.direction : "asc"
              }
              onClick={() => handleSort("id")}
            >
              ID
            </TableSortLabel>
          </TableCell>
          <TableCell className={classes.cellWithBorder}>
            <TableSortLabel
              active={sortConfig.field === "createdAt"}
              direction={
                sortConfig.field === "createdAt" ? sortConfig.direction : "asc"
              }
              onClick={() => handleSort("createdAt")}
            >
              Fecha
            </TableSortLabel>
          </TableCell>
          <TableCell className={classes.cellWithBorder}>
            <TableSortLabel
              active={sortConfig.field === "dependenciaId"} // Cambiar a "dependenciaId"
              direction={
                sortConfig.field === "dependenciaId"
                  ? sortConfig.direction
                  : "asc"
              }
              onClick={() => handleSort("dependenciaId")}
            >
              Dependencia
            </TableSortLabel>
          </TableCell>
          <TableCell className={classes.cellWithBorder}>
            <TableSortLabel
              active={sortConfig.field === "edad"}
              direction={
                sortConfig.field === "edad" ? sortConfig.direction : "asc"
              }
              onClick={() => handleSort("edad")}
            >
              Edad
            </TableSortLabel>
          </TableCell>
          <TableCell className={classes.cellWithBorder}>
            <TableSortLabel
              active={sortConfig.field === "genero"}
              direction={
                sortConfig.field === "genero" ? sortConfig.direction : "asc"
              }
              onClick={() => handleSort("genero")}
            >
              Género
            </TableSortLabel>
          </TableCell>
          <TableCell className={classes.cellWithBorder}>
          <TableSortLabel
              active={sortConfig.field === "tipoRespuestaId"} // Cambiar a "tipoRespuestaId"
              direction={
                sortConfig.field === "tipoRespuestaId"
                  ? sortConfig.direction
                  : "asc"
              }
              onClick={() => handleSort("tipoRespuestaId")}
            >
              Tipo de Respuesta
            </TableSortLabel>
          </TableCell>
          <TableCell className={classes.cellWithBorder}>
            <TableSortLabel
              active={sortConfig.field === "preguntaId"}
              direction={
                sortConfig.field === "preguntaId" ? sortConfig.direction : "asc"
              }
              onClick={() => handleSort("preguntaId")}
            >
              Pregunta
            </TableSortLabel>
          </TableCell>
          <TableCell className={classes.cellWithBorder}>
            <TableSortLabel
              active={sortConfig.field === "comentarios"}
              direction={
                sortConfig.field === "comentarios"
                  ? sortConfig.direction
                  : "asc"
              }
              onClick={() => handleSort("comentarios")}
            >
              Comentarios
            </TableSortLabel>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedRespuestas &&
          sortedRespuestas.map((respuesta) => (
            <TableRow key={respuesta.id}>
              <TableCell className={classes.cellWithBorder}>
                {respuesta.id}
              </TableCell>
              <TableCell className={classes.cellWithBorder}>
                {new Date(respuesta.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className={classes.cellWithBorder}>
                {getDependenciaNombre(respuesta.dependenciaId)} {/* Mostrar el nombre de la dependencia */}
              </TableCell>
              <TableCell className={classes.cellWithBorder}>
                {respuesta.edad}
              </TableCell>
              <TableCell className={classes.cellWithBorder}>
                {respuesta.genero}
              </TableCell>
              <TableCell className={classes.cellWithBorder}>
                {getTipoRespuestaDescripcion(respuesta.tipoRespuestaId)} {/* Mostrar la descripción del tipo de respuesta */}
              </TableCell>
              <TableCell className={classes.cellWithBorder}>
                {preguntas.find(
                  (pregunta) => pregunta.id === respuesta.preguntaId
                )?.descripcion || "Pregunta no encontrada"}
              </TableCell>
              <TableCell className={classes.cellWithBorder}>
                {respuesta.comentario &&
                  respuesta.comentario.respuestaComentario}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default RespuestasTable;
