import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
	Typography,
	ListItem,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Button,
	Box,
	Grid,
	Divider,
	Container,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Pagination from "@material-ui/lab/Pagination";
import "../css/global.css";
import "../css/formulario.css";
import useStyles from "../styles/formularioStyle";

function Preguntas() {
	const classes = useStyles();
	const [preguntas, setPreguntas] = useState([]);
	const [edad, setEdad] = useState("");
	const [genero, setGenero] = useState("");
	const [dependencia, setDependencia] = useState("");
	const [dependencias, setDependencias] = useState([]);
	const [isFirstPage, setIsFirstPage] = useState(true);
	const [isLastPage, setIsLastPage] = useState(false);
	const [seccionId, setSeccionId] = useState(null);
	const [secciones, setSecciones] = useState([]);
	const [preguntasPorSeccion, setPreguntasPorSeccion] = useState({});
	const [userComments, setUserComments] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [respuestas, setRespuestas] = useState({});
	const [tipoRespuesta, setTipoRespuesta] = useState({});
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("");
	const [error, setError] = useState(false);
	const [preguntasSinResponder, setPreguntasSinResponder] = useState({});
	const [preguntaActual, setPreguntaActual] = useState(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const { data } = await axios.get("http://localhost:4000/dependencias");
				setDependencias(data);
			} catch (error) {
				console.error(error);
			}
		}
		fetchData();
	}, []);

	useEffect(() => {
		async function fetchTipoRespuesta() {
			try {
				const { data } = await axios.get(
					"http://localhost:4000/tipoRespuesta"
				);
				// Agrupar los tipos de respuesta por tipoPreguntaId
				const tipoRespuestaGrouped = data.reduce((grouped, tipo) => {
					if (grouped[tipo.tipoPreguntaId]) {
						grouped[tipo.tipoPreguntaId].push(tipo);
					} else {
						grouped[tipo.tipoPreguntaId] = [tipo];
					}
					return grouped;
				}, {});
				setTipoRespuesta(tipoRespuestaGrouped);
			} catch (error) {
				console.error(error);
			}
		}
		fetchTipoRespuesta();
	}, []);

	useEffect(() => {
		async function cargarSecciones() {
			try {
				const { data } = await axios.get("http://localhost:4000/secciones");
				setSecciones(data);
				setSeccionId(data[0]?.id); // Establecer la primera sección como sección actual
			} catch (error) {
				console.error(error);
			}
		}
		cargarSecciones();
	}, []);

	const cargarPreguntasPorSeccion = useCallback(async () => {
		if (!seccionId) return; // Don't make the request if seccionId is null
		try {
		  const response = await axios.get(`http://localhost:4000/preguntas/${seccionId}`);
		  setPreguntasPorSeccion((prevPreguntasPorSeccion) => ({
			...prevPreguntasPorSeccion,
			[seccionId]: response.data,
		  }));
		  setCurrentPage(1);
		  setPreguntaActual(response.data[0]?.id); // Establecer la primera pregunta como pregunta actual
		} catch (error) {
		  console.error(error);
		}
	  }, [seccionId]);
	
	useEffect(() => {
		(async () => {
			await cargarPreguntasPorSeccion();
		})();
	}, [cargarPreguntasPorSeccion]);
	  
	useEffect(() => {
		if (preguntasPorSeccion[seccionId]) {
			const startIndex = (currentPage - 1) * 5;
			const endIndex = startIndex + 5;
			const slicedPreguntas = preguntasPorSeccion[seccionId]?.slice(startIndex, endIndex);
			setPreguntas(slicedPreguntas);
		} else {
			cargarPreguntasPorSeccion();
		}
	}, [seccionId, currentPage, preguntasPorSeccion, cargarPreguntasPorSeccion]);

	function handleEdadChange(event) {
		setEdad(event.target.value);
	}

	function handleGeneroChange(event) {
		setGenero(event.target.value);
	}

	function handleDependenciaChange(event) {
		setDependencia(event.target.value);
	}

	function handleComentarioChange(event, preguntaId) {
		const value = event.target.value;

		setUserComments((prevUserComments) => ({
			...prevUserComments,
			[preguntaId]: value,
		}));
	}

	async function getFormularioActivo() {
		try {
			const { data } = await axios.get("http://localhost:4000/formulario");
			const formularioActivo = data.find((formulario) => formulario.estaActivo);
			return formularioActivo ? formularioActivo.id : null;
		} catch (error) {
			console.error(error);
			return null;
		}
	}


	async function enviarRespuestas(event) {
		event.preventDefault();
		try {
		  const formularioId = await getFormularioActivo();
		  if (!formularioId) {
			throw new Error("No hay formulario activo");
		  }
		  const preguntasRespuestas = Object.entries(respuestas).map(
			([preguntaId, respuesta]) => ({
			  preguntaId: parseInt(preguntaId),
			  formularioId,
			  tipoRespuestaId: respuesta.tipoRespuesta,
			  dependenciaId: dependencia,
			  edad,
			  genero,
			  comentario: {
				respuestaComentario: userComments[preguntaId],
				preguntaId: parseInt(preguntaId),
				respuestaId: respuesta.tipoRespuesta,
				formularioId,
				dependenciaId: dependencia,
			  },
			})
		  );
		  await axios.post("http://localhost:4000/respuestas", {
			preguntasRespuestas,
		  });
		  setSnackbarMessage("Respuestas enviadas correctamente");
		  setSnackbarSeverity("success");
		} catch (error) {
		  console.error(error);
		  setSnackbarMessage("Error al enviar las respuestas");
		  setSnackbarSeverity("error");
		} finally {
		  setOpenSnackbar(true);
		}
	  }



	return (
		<Container className="mb80px">
			<Typography variant="h4" className={classes.tituloPregunta}>
				{seccionId &&
					secciones.length > 0 &&
					secciones.find((seccion) => seccion.id === seccionId)?.descripcion}
			</Typography>
			<Divider />
			<form onSubmit={enviarRespuestas} className="formulario">
				{isFirstPage && (
					<>
						<Grid container spacing={3}>
							<Grid item xs={12} md={4}>
								<FormControl
									error={error}
									variant="outlined"
									fullWidth
									size="small"
								>
									<InputLabel>Edad</InputLabel>
									<Select
										name="edad"
										value={edad}
										onChange={handleEdadChange}
										label="Edad"
										required
									>
										<MenuItem value="DESDE_18_A_45">
											Desde 18 a 45 Años
										</MenuItem>
										<MenuItem value="MAS_45">Mas de 45 Años</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={4}>
								<FormControl variant="outlined" fullWidth size="small">
									<InputLabel>Género</InputLabel>
									<Select
										name="genero"
										value={genero}
										onChange={handleGeneroChange}
										label="Género"
										required
									>
										<MenuItem value="MASCULINO">Masculino</MenuItem>
										<MenuItem value="FEMENINO">Femenino</MenuItem>
										<MenuItem value="OTRO">Otro</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={4}>
								<FormControl variant="outlined" fullWidth size="small">
									<InputLabel>Dependencia</InputLabel>
									<Select
										key={dependencia.id}
										name="dependencia"
										value={dependencia}
										onChange={handleDependenciaChange}
										label="Dependencia"
										required
									>
										{dependencias.map((dependencia) => (
											<MenuItem key={dependencia.id} value={dependencia.id}>
												{dependencia.nombreDependencia}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						</Grid>
					</>
				)}
				<Grid container spacing={2}>
					{preguntasPorSeccion[seccionId]?.map((pregunta) => (
						<Grid item xs={12} md={6} key={pregunta.id}>
							<ListItem style={{ height: "100%" }}>
								<Box
									className={`${classes.pregunta} ${preguntasSinResponder[pregunta.id] ? classes.preguntaIncompleta : ""
										}`}
									display="flex"
									flexDirection="column"
									boxShadow={6}
									borderRadius={5}
									p={2}
									mb={2}
									width={"100%"}
									value={pregunta.id}
								>
									<div className="mb20px">
										<Typography variant="h6">
											{pregunta.descripcion}
										</Typography>
									</div>
									<Grid container spacing={2}>
										{pregunta.tipoRespuesta &&
											tipoRespuesta[pregunta.tipoPreguntaId] && (
												<Grid item xs={12}>
													<FormControl fullWidth>
														<InputLabel
															id={`respuesta-${pregunta.id}-label`}
														>
															¿Qué opinas?
														</InputLabel>
														<Select
															name="tipoRespuesta"
															value={
																respuestas[pregunta.id]?.tipoRespuesta || ""
															}
															onChange={(event) => {
																const tipoRespuestaId =
																	event.target.value;
																setRespuestas((prevRespuestas) => ({
																	...prevRespuestas,
																	[pregunta.id]: {
																		...prevRespuestas[pregunta.id],
																		tipoRespuesta: tipoRespuestaId,
																	},
																}));
															}}
															label="tipoRespuesta"
															required
															className="mb20px"
														>
															{tipoRespuesta[pregunta.tipoPreguntaId].map(
																(tipo) => (
																	<MenuItem key={tipo.id} value={tipo.id}>
																		{tipo.descripcion}
																	</MenuItem>
																)
															)}
														</Select>
														{pregunta.tieneComentario && (
															<Grid item xs={12}>
																<Typography variant="body2" className="mb20px">
																	{pregunta.descripcionComentario}
																</Typography>
																<TextField
																	label="Comentario"
																	value={userComments[pregunta.id] || ""}
																	onChange={(event) =>
																		handleComentarioChange(event, pregunta.id)
																		
																	}
																	fullWidth
																	multiline
																	minRows={4}
																	variant="outlined"
																/>
															</Grid>
														)}
													</FormControl>
												</Grid>
											)}
									</Grid>
								</Box>
							</ListItem>
						</Grid>
					))}
				</Grid>
				<Snackbar open={openSnackbar} autoHideDuration={6000}>
					<MuiAlert elevation={6} variant="filled" severity={snackbarSeverity}>
						{snackbarMessage}
					</MuiAlert>
				</Snackbar>
				<Box display="flex" justifyContent="center">
					{isLastPage && (
						<Button
							variant="contained"
							color="primary"
							type="submit"
							className={classes.enviarButton}
						>
							Enviar
						</Button>
					)}
				</Box>
			</form>
			<Pagination
				className="pagination"
				count={secciones.length}
				page={secciones.findIndex((seccion) => seccion.id === seccionId) + 1}
				onChange={(event, value) => {
					const pageIndex = value - 1;
					const selectedSeccionId = secciones[pageIndex]?.id;
					setSeccionId(selectedSeccionId);
					setIsFirstPage(pageIndex === 0);
					setIsLastPage(pageIndex === secciones.length - 1);
				}}
			/>
		</Container>
	);
}

export default Preguntas;
