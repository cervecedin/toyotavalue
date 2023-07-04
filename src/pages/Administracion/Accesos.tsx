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

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
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
    /*Estado para los registros del dropdow Privilegios*/
    const [Privilegios, setPrivilegios] = useState<any[]>([]);
    /*Estado para los registros de la tabla Accesos*/
    const [Accesos, setAccesos] = useState([]);
    /*Estado para los campos de crear colaborador*/
    const [AccesosC, setAccesosC] = useState({
        Nombre_Acceso: "",
        Correo_acceso: "",
        Contrasena_Acceso: "",
        fk_Id_Privilegio: 0
    });

    /*Funcion Para Cambiar el estado de la variable de estado Licitaciones directo desde los textfields */
    const onChangeAccesosC = (e:React.ChangeEvent<any>) =>{
        setAccesosC({...AccesosC,[e.target.name]: e.target.value})
    }

    /*Funcion para Leer TipoLicitaciones*/
    const LeerPrivilegios = async () => {
        await Axios.post('http://192.168.25.141:3000/api/rprivilegio', {
          }, {
            headers: {
                'Token': localStorage.getItem("Token"),
            }
        }).then((response) => {
            setPrivilegios(response.data)
            /*console.log(response.data)*/
        });
    } 
    /*Funcion Para Crear Licitaciones */
    const CrearAcceso = async (e:any) => {
        e.preventDefault();      
        console.log(AccesosC);
        if (!AccesosC.Nombre_Acceso || !AccesosC.Correo_acceso || !AccesosC.Contrasena_Acceso) {
            setSnackbar({ Color: 'error', Mensaje: 'Complete Los Datos Obligatorios*' });
            setOpenSnackBar(true);
        } else { 
            await Axios.post('http://192.168.25.141:3000/api/signup', {
                Nombre_Acceso: AccesosC.Nombre_Acceso,
                Correo_acceso: AccesosC.Correo_acceso,
                Contrasena_acceso: AccesosC.Contrasena_Acceso,
                Acceso_Creacion: parseInt(localStorage.getItem("Acceso")!),
                fk_Id_Privilegio: AccesosC.fk_Id_Privilegio
            }, {
                headers: {
                    'Token': localStorage.getItem("Token"),
                }
            }).then((response) => {
                if (response.data.id_message === 0) {
                    setSnackbar({ Color: 'success', Mensaje: response.data.message });
                    setOpenSnackBar(true);
                    LimpiarAccesoC();
                    LeerAccesos();

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
    const LimpiarAccesoC = () => {
        setAccesosC({
            Nombre_Acceso: "",
            Correo_acceso: "",
            Contrasena_Acceso: "",
            fk_Id_Privilegio: 0
        })

    }


    /*Funcion Para Leer Licitaciones*/
    const LeerAccesos = async () => {
        await Axios.post('http://192.168.25.141:3000/api/racceso', {
        }, {
            headers: {
                'Token': localStorage.getItem("Token"),
            }
        }).then((response) => {
            setAccesos(response.data)
            /*console.log(response.data)*/
        });
    }
    /*definicion columnas grid  */
    const columnsAccesos: GridColDef[] = [    
        { field: 'Id_acceso', headerName: 'ID', width: 50, editable: false,},
        { field: 'Nombre_Acceso', headerName: 'Colaborador', width: 280, editable: true,},
        { field: 'Correo_acceso', headerName: 'Usuario', width: 280, editable: true,},
        { field: 'Contrasena_acceso', headerName: 'Contraseña', width: 280, editable: true,},
        { field: 'Fec_creacion', headerName: 'Fecha Creacion', width: 150, editable: false,},
        { field: 'Titulo_privilegio', headerName: 'Perfil', width: 200, editable: true,},
        {
            field: 'Estado',
            valueGetter: ({ row }) => {
              if (row.Estado_acceso==0) {
                return 'Deshabilitado';
              }
              else return 'Habilitado';              
            },
        },
        { field: 'editar', headerName: '',
            renderCell: (rows) => (
              <strong>            
                <IconButton style={{color:"blue"}} size="small" onClick={() => {ModificarAcceso(rows.row);}}><ModeEditIcon/></IconButton>
              </strong>
            ),
        },
        { field: 'elimnar', headerName: '',
            renderCell: (rows) => (
              <strong>            
                <IconButton style={{color:"red"}} size="small" onClick={() => {DeshabilitarAcceso(rows.row);}}><DeleteOutlineIcon/></IconButton>
              </strong>
            ),
        }
      ]; 
    
    useEffect(() => {
        LeerPrivilegios();
        LeerAccesos();
    }, []);

    /*Funcion Para Modificar Accesos*/
    /*const AbrirModalModificaAcceso = (data:any) => {
        AbrirCerrarModalAccesoM();
    }*/

    /*Funcion Para Deshabilitar Accesos*/
    const ModificarAcceso = (data:any) => {
        var flag=0;
        if (data.Contrasena_acceso!=='[password]')
            var flag=1;           

        Axios.post('http://192.168.25.141:3000/api/uacceso', {
            Id_acceso: data.Id_acceso,
            Nombre_Acceso: data.Nombre_Acceso,
            Correo_acceso: data.Correo_acceso,
            Contrasena_acceso: data.Contrasena_acceso,
            Acceso_modificacion: parseInt(localStorage.getItem("Acceso")!),
            Titulo_Privilegio: data.Titulo_privilegio,
            Flag_contrasena: flag
        }, {
            headers: {
                'Token': localStorage.getItem("Token"),
            }
        }).then((response) => {
            if (response.data.id_message === 0) {
                setSnackbar({ Color: 'success', Mensaje: response.data.message });
                setOpenSnackBar(true);
                LeerAccesos();

            }
            else if (response.data.id_message === 1) {
                setSnackbar({ Color: 'warning', Mensaje: response.data.message });
                setOpenSnackBar(true);
                LeerAccesos();
            }
            else {
                setSnackbar({ Color: 'error', Mensaje: response.data.message });
                setOpenSnackBar(true);
                LeerAccesos();
            }
        }); 
    }

     /*Funcion Para Deshabilitar Accesos*/
     const DeshabilitarAcceso = (data:any) => {
        Axios.post('http://192.168.25.141:3000/api/dacceso', {
            Id_acceso: data.Id_acceso,
        }, {
            headers: {
                'Token': localStorage.getItem("Token"),
            }
        }).then((response) => {
            if (response.data.id_message === 0) {
                setSnackbar({ Color: 'success', Mensaje: response.data.message });
                setOpenSnackBar(true);
                LeerAccesos();
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
                            <Box fontWeight="fontWeightBold">Accesos </Box>
                </Typography>
            </Box>
            <Box component="form" sx={{'& .MuiTextField-root': { m: 2, width: '25ch' },}} noValidate autoComplete="on">
                <div>                    
                    <TextField id="outlined-helperText" label="Nombre y Apellidos*"  size="small" name="Nombre_Acceso" onChange={onChangeAccesosC} value={AccesosC.Nombre_Acceso}/>     
                    <TextField id="outlined-helperText" label="Usuario*"  size="small" name="Correo_acceso" onChange={onChangeAccesosC} value={AccesosC.Correo_acceso}/>  
                    <TextField id="outlined-helperText" label="Contraseña*"  size="small" name="Contrasena_Acceso" onChange={onChangeAccesosC} type="password" value={AccesosC.Contrasena_Acceso}/>        
                    <TextField id="outlined-select-currency" select label="Privilegio*" defaultValue="" size="small" name="fk_Id_Privilegio" onChange={onChangeAccesosC} value={AccesosC.fk_Id_Privilegio}>
                        {Privilegios.map((option) => (
                            <MenuItem key={option.Id_privilegio} value={option.Id_privilegio}>
                            {option.Titulo_privilegio}
                            </MenuItem>
                        ))}
                     </TextField>                                            
                </div> 
            </Box>   
            <Box display="flex" justifyContent="center" alignItems="center" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}}>
                <div>
                    <Button variant="contained" color="success" onClick={CrearAcceso} startIcon={<SaveIcon />} className='Buttons'>Guardar</Button>
                    <Button type="submit" variant="contained" onClick={LimpiarAccesoC} color="warning" startIcon={<CleaningServicesIcon />} className='Buttons'>Limpiar</Button>
                </div>
            </Box>   
            <Box sx={{ m: 2 }}>
                <DataGrid rows={Accesos} columns={columnsAccesos} initialState={{pagination: {paginationModel: {pageSize: 5,},},}} pageSizeOptions={[5]} disableRowSelectionOnClick getRowId={(row) => row.Id_acceso}  sx={{boxShadow: 2,border: 1,"& .MuiDataGrid-cell:hover": {color: "primary.main"}}}/>
            </Box>

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