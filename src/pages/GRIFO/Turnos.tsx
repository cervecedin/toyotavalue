import SideNavBar from "../Modulos/SideNavBar"
import Axios from 'axios';
import { useState,useEffect,forwardRef } from 'react'
import {TextField,Typography, Box, MenuItem,Button,IconButton,Modal, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  /*Stylo modal*/ 
  const style = {
    position: 'absolute' as 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
export default function CrudLicitaciones() { 
    /*SnackBar Alertas Material ui*/
    const [OpenSnackBar, setOpenSnackBar] = useState(false);
    const [PropSnackbar, setSnackbar] = useState({
      Color: 'error',
      Mensaje: '',
    });
    const { Color, Mensaje } = PropSnackbar;
    const vertical = 'top';
    const horizontal = 'left';
    const handleClose = (event?: React.SyntheticEvent | Event,reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      setOpenSnackBar(false);
    };
    /*Estado para los registros del dropdow accesos1*/
    const [Accesos1, setAccesos1] = useState<any[]>([]);
    /*Estado para los registros del dropdow accesos2*/
    const [Accesos2, setAccesos2] = useState<any[]>([]);
    /*Estado para los registros de la drodow dispensado*/
    const [Dispensadores, setDispensadores] = useState<any[]>([]);
    /*Estado para los registros de la tabla Turno*/
    const [Turnos, setTurnos] = useState([]);
    /*Estado para los campos de crear Turno*/
    const [TurnoC, setturnoC] = useState({
        FechaHoraIni_Turno: "",
        FechaHoraFin_Turno: "",
        VendedorPri_Turno: 0,
        VendedorSec_Turno: 0,
        Observacion_Turno: "",
        fk_Id_Dispensador: 0
    });

    /*Estado para los campos de Eliminar Turno*/
    const [TurnoE, setturnoE] = useState({
        Id_TurnoE: "",
        Isla: ""
    });

    /*Estado y Funcion para modal Confirmacion Eliminar Licitacion*/
    const [ModalConfirElimTurno, setModalConfirElimTurno] = useState(false);
    const AbrirCerrarModalConfirElimTurno = () => {
        setModalConfirElimTurno(!ModalConfirElimTurno);
    };

    /*Funcion Para Cambiar el estado de la variable de estado Licitaciones directo desde los textfields */
    const onChangeTurnoC = (e:React.ChangeEvent<any>) =>{
        setturnoC({...TurnoC,[e.target.name]: e.target.value})
    }

     /*Funcion Para Leer Licitaciones*/
     const LeerAccesos = async () => {
        Axios.post('http://192.168.25.167:4000/api/raccesoH', {
        }, {
            headers: {
                'Token': localStorage.getItem("Token"),
            }
        }).then((response) => {
            setAccesos1(response.data)
            setAccesos2(response.data)
            /*console.log(response.data)*/
        });
    }
    /*Funcion Para Leer Dispensadores*/
    const LeerDispesadores = async () => {
        Axios.post('http://192.168.25.167:4000/api/rdispensadorH', {
        }, {
            headers: {
                'Token': localStorage.getItem("Token"),
            }
        }).then((response) => {
            setDispensadores(response.data)
            /*console.log(response.data)*/
        });
    }
     /*Funcion Para Leer Turnos*/
     const LeerTurnos = async () => {
        Axios.post('http://192.168.25.167:4000/api/rTurno', {
        }, {
            headers: {
                'Token': localStorage.getItem("Token"),
            }
        }).then((response) => {
            setTurnos(response.data)
            /*console.log(response.data)*/
        });
    }
    /*Funcion Para Crear Licitaciones */
    const CrearTurno = async (e:any) => {
        e.preventDefault();   
        if (!TurnoC.FechaHoraIni_Turno || !TurnoC.FechaHoraFin_Turno || !TurnoC.VendedorPri_Turno|| !TurnoC.VendedorSec_Turno|| !TurnoC.fk_Id_Dispensador) {
            setSnackbar({ Color: 'error', Mensaje: 'Complete Los Datos Obligatorios*' });
            setOpenSnackBar(true);
        } else { 
            await Axios.post('http://192.168.25.167:4000/api/cTurno', {
                FechaHoraIni_Turno: dayjs(TurnoC.FechaHoraIni_Turno).format('YYYY-MM-DD HH:mm'),
                FechaHoraFin_Turno: dayjs(TurnoC.FechaHoraFin_Turno).format('YYYY-MM-DD HH:mm'),
                VendedorPri_Turno: TurnoC.VendedorPri_Turno,
                VendedorSec_Turno: TurnoC.VendedorSec_Turno,
                Observacion_Turno: TurnoC.Observacion_Turno,
                Acceso_Creacion: parseInt(localStorage.getItem("Acceso")!),
                Fk_Id_Dispensador: TurnoC.fk_Id_Dispensador
            }, {
                headers: {
                    'Token': localStorage.getItem("Token"),
                }
            }).then((response) => {
                if (response.data.id_message === 0) {
                    setSnackbar({ Color: 'success', Mensaje: response.data.message });
                    setOpenSnackBar(true);
                    /*LimpiarAccesoC();*/
                    LeerTurnos();

                }
                else if (response.data.id_message === 1) {
                    setSnackbar({ Color: 'warning', Mensaje: response.data.message });
                    setOpenSnackBar(true);
                }
                else {
                    setSnackbar({ Color: 'error', Mensaje: response.data.message });
                    setOpenSnackBar(true);
                }
            });      

        }
    }
    const LimpiarTurnoC = () => {
        /*setAccesosC({
            Nombre_Acceso: "",
            Correo_acceso: "",
            Contrasena_Acceso: "",
            fk_Id_Privilegio: 0
        })*/

    }
   
    /*definicion columnas grid  */
    const columnsTurnos: GridColDef[] = [    
        { field: 'Id_Turno', headerName: 'ID', width: 50, editable: false,},
        { field: 'Descrip_Dispensador', headerName: 'Isla', width: 100, editable: true,},
        {
            field: 'Fecha Inicio',
            width: 200,
            valueGetter: ({ row }) => {
              /*if (row.Estado_acceso==0) {*/
                return dayjs(row.FechaHoraIni_Turno.substring(0,row.FechaHoraIni_Turno.length-1)).format('YYYY-MM-DD HH:mm:ss');
                           
            },
        },
        {
            field: 'Fecha Fin',
            width: 200,
            valueGetter: ({ row }) => {
              /*if (row.Estado_acceso==0) {*/
                return dayjs(row.FechaHoraFin_Turno.substring(0,row.FechaHoraIni_Turno.length-1)).format('YYYY-MM-DD HH:mm:ss');
                           
            },
        },
        { field: 'VendedorPri_TurnoN', headerName: 'Vendedor Principal', width: 280, editable: true,},
        { field: 'VendedorSec_TurnoN', headerName: 'Vendedor Secundario', width: 280, editable: true,},
        { field: 'Observacion_Turno', headerName: 'Observación', width: 150, editable: true,},
        { field: 'eliminar', headerName: '',
            renderCell: (rows) => (
              <strong>            
                <IconButton style={{color:"red"}} size="small" onClick={() => {ConfirmarElimTurno(rows.row);}}><DeleteOutlineIcon/></IconButton>
              </strong>
            ),
        }
      ]; 

       /*Funcion Confirmar Elimnacion Modal**/
    const ConfirmarElimTurno = (data:any) => {
        AbrirCerrarModalConfirElimTurno();
        setturnoE({...TurnoE,Id_TurnoE:data.Id_Turno,Isla:data.Descrip_Dispensador});
        
    }

    
    useEffect(() => {
        LeerAccesos();
        LeerDispesadores();
        LeerTurnos();
    }, []);

     /*Funcion Para Eliminar Accesos*/
     const EliminarTurno = () => {
        Axios.post('http://192.168.25.167:4000/api/dTurno', {
            Id_Turno: TurnoE.Id_TurnoE,
        }, {
            headers: {
                'Token': localStorage.getItem("Token"),
            }
        }).then((response) => {
            if (response.data.id_message === 0) {
                setSnackbar({ Color: 'success', Mensaje: response.data.message });
                setOpenSnackBar(true);
                AbrirCerrarModalConfirElimTurno();
                LeerTurnos();
            }
            else if (response.data.id_message === 1) {
                setSnackbar({ Color: 'warning', Mensaje: response.data.message });
                setOpenSnackBar(true);
            }
            else {
                setSnackbar({ Color: 'error', Mensaje: response.data.message });
                setOpenSnackBar(true);
            }
        });
    }

    return(
        <SideNavBar>
            <Box sx={{ m: 2 }}>
                <Typography variant="h5" component="div">
                            <Box fontWeight="fontWeightBold">Turnos </Box>
                </Typography>
            </Box>
            <Box component="form" sx={{'& .MuiTextField-root': { m: 2, width: '25ch' },}} noValidate autoComplete="on">
                <div>   
                    <TextField id="outlined-select-currency" select label="Isla*" defaultValue="" size="small" name="fk_Id_Dispensador" onChange={onChangeTurnoC} value={TurnoC.fk_Id_Dispensador}>
                        {Dispensadores.map((option) => (
                            <MenuItem key={option.Id_Dispensador} value={option.Id_Dispensador}>
                            {option.Descrip_Dispensador}
                            </MenuItem>
                        ))}
                    </TextField>                   
                    <TextField id="outlined-select-currency" select label="Vendedor Principal*" defaultValue="" size="small" name="VendedorPri_Turno" onChange={onChangeTurnoC} value={TurnoC.VendedorPri_Turno}>
                        {Accesos1.map((option) => (
                            <MenuItem key={option.Id_acceso} value={option.Id_acceso}>
                            {option.Nombre_Acceso}
                            </MenuItem>
                        ))}
                    </TextField>   
                    <TextField id="outlined-select-currency" select label="Vendedor Secundario*" defaultValue="" size="small" name="VendedorSec_Turno" onChange={onChangeTurnoC} value={TurnoC.VendedorSec_Turno}>
                        {Accesos2.map((option) => (
                            <MenuItem key={option.Id_acceso} value={option.Id_acceso}>
                            {option.Nombre_Acceso}
                            </MenuItem>
                        ))}
                    </TextField>   
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                         <DateTimePicker label="Fecha Inicio*" slotProps={{ textField: { size: 'small' } }} onChange={(newValue) =>setturnoC({...TurnoC,FechaHoraIni_Turno:newValue as string})}/>
                         <DateTimePicker label="Fecha Fin*" slotProps={{ textField: { size: 'small' } }} onChange={(newValue2) =>setturnoC({...TurnoC,FechaHoraFin_Turno:newValue2 as string})}/>
                    </LocalizationProvider> 
                    <TextField id="outlined-multiline-obs" label="Observación"  size="small" multiline maxRows={4} name="Observacion_Turno"  onChange={onChangeTurnoC}/>         
                                                             
                </div> 
            </Box>   
            <Box display="flex" justifyContent="center" alignItems="center" sx={{'& .MuiTextField-root': { m: 2, width: '25ch' },}}>
                <div>
                    <Button variant="contained" color="success" onClick={CrearTurno} startIcon={<SaveIcon />} className='Buttons'>Guardar</Button>
                    <Button type="submit" variant="contained" onClick={LimpiarTurnoC} color="warning" startIcon={<CleaningServicesIcon />} className='Buttons'>Limpiar</Button>
                </div>
            </Box>   
            <Box sx={{ m: 2 }}>
                <DataGrid rows={Turnos} columns={columnsTurnos} initialState={{pagination: {paginationModel: {pageSize: 5,},},}} pageSizeOptions={[5]} disableRowSelectionOnClick getRowId={(row) => row.Id_Turno}  sx={{boxShadow: 2,border: 1,"& .MuiDataGrid-cell:hover": {color: "primary.main"}}}/>
            </Box>

            <Modal open={ModalConfirElimTurno} onClose={AbrirCerrarModalConfirElimTurno} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Box sx={{ m: 2 }} fontStyle={"italic"}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            ¿Eliminar Turno de {TurnoE.Isla}?
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{'& .MuiTextField-root': { m: 2, width: '25ch' },}}>
                        <div>
                            <Button variant="contained" color="success" onClick={EliminarTurno} startIcon={<SaveIcon />} className='Buttons'>Eliminar</Button>
                            <Button type="submit" variant="contained" onClick={AbrirCerrarModalConfirElimTurno} color="error" startIcon={<CleaningServicesIcon />} className='Buttons'>Cancelar</Button>
                        </div>
                    </Box> 
                </Box>
            </Modal> 

            {/*Componente Para Alertas*/}
            <Snackbar anchorOrigin={{ vertical, horizontal }} open={OpenSnackBar} autoHideDuration={2000} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={Color == "success" ? "success" : Color == "error" ? "error" : Color == "info" ? "info" : "warning"}
                elevation={6}
                variant="filled"
            >
                {Mensaje}
            </Alert>
            </Snackbar>          
        </SideNavBar>
        
    );
}