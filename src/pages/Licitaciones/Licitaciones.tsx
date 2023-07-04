import SideNavBar from "../Modulos/SideNavBar"
import Axios from 'axios';
import { useState,useEffect,forwardRef } from 'react'
import {TextField,Typography, Box, MenuItem,InputAdornment,Button,IconButton,Modal, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SaveIcon from '@mui/icons-material/Save';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import SearchIcon from '@mui/icons-material/Search';
import AddchartIcon from '@mui/icons-material/Addchart';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
const Variacion = [
    {
      value: 0,
      label: 'No',
    },
    {
      value: 1,
      label: 'Si',
    }
  ];
  const EstadoLic = [
    {
        value: 1,
        label: 'Iniciar',
      },
      {
        value: 2,
        label: 'Pausar',
      },
      {
        value: 3,
        label: 'Cerrar',
      }
  ];
  const style = {
    position: 'absolute' as 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const style2= {
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
    /*Estado para los registros de la tabla TipoLicitaciones*/
    const [TipoLicitaciones, setTipoLicitaciones] = useState<any[]>([]);
    /*Estado para los registros de la tabla Socios de Negocio*/
    const [SociosNegocio, setSociosNegocio] = useState<any[]>([]);
    /*Estado para los registros de la tabla Licitaciones*/
    const [Licitaciones, setLicitaciones] = useState([]);
    /*Estado para Licitaciones Detalle*/
    const [LicitacionDetalle, setLicitacionDetalle] = useState([]);
    /*Estado para los registros de la tabla Articulos Combustibles*/
    const [Articulos, setArticulos] = useState<any[]>([]);
    /*Estado para los campos de crear Licitacion*/
    const [LicitacionesC, setLicitacionesC] = useState({
        Nro_Licitacion: "",
        FechIni_Licitacion: "",
        FechFin_Licitacion: "",
        LugarEntrega_Licitacion: "",
        SujetoVarPrecio_Licitacion: 0,
        Monto_Licitacion: 0,
        Observacion_Licitacion: "",
        RSSocioNegocio: "",
        Fk_Id_SocioNegocio: "",
        Fk_Id_Tipo_Licitacion: ""
    });
    /*Estado para los modificar Licitacion*/
    const [LicitacionesM, setLicitacionesM] = useState({
        Id_LicitacionM: 0,
        Nro_LicitacionM: "",
        FechIni_LicitacionM: dayjs(''),
        FechFin_LicitacionM: dayjs(''),
        LugarEntrega_LicitacionM: "",
        SujetoVarPrecio_LicitacionM: 0,
        Monto_LicitacionM: 0,
        Observacion_LicitacionM: "",
        Estado_LicitacionM: 0,
        RSSocioNegocioM: "",
        Fk_Id_SocioNegocioM: "",
        Fk_Id_Tipo_LicitacionM: ""
    });
    /*Estado para los modificar Licitacion*/
    const [LicitacionesE, setLicitacionesE] = useState({
        Id_LicitacionE: 0,
        Nro_LicitacionE: ""
    });
    /*Estado para los campos de crear Detalle Licitaciones*/
    const [LicDetalleC, setLicDetalleC] = useState({
        Cantidad_Lic_Det: 0,
        Precio_Lic_Det: 0,
        Total_Lic_Det: 0,
        Fk_Id_Licitacion: 0,
        Fk_Id_Articulo: 0
    });

    /*Estado para los campos de crear Detalle Licitaciones Variacion*/
    const [LicDetalleVarC, setLicDetalleVarC] = useState({
        Id_Lic_Det:0,
        Precio_Lic_Det: 0,
        Tipo_Lic_Det: 0,
        ProductoVariacion: "",
    });
    
    /*Estado y Funcion para modal de Socios de Negoxio*/
    const [ModalSociosN, setModalSociosN] = useState(false);
    const AbrirCerrarModalSN = () => {
        setModalSociosN(!ModalSociosN);
    };
    /*Estado y Funcion para modal de Socios de Negoxio*/
    const [ModalDetalleLic, setModalDetalleLic] = useState(false);
    const AbrirCerrarModalDetalleLic = () => {
        setModalDetalleLic(!ModalDetalleLic);
    };
    /*Estado y Funcion para modal de Socios de Negoxio*/
    const [ModalModLicitacion, setModalModLicitacion] = useState(false);
    const AbrirCerrarModalModLicitacion = () => {
        setModalModLicitacion(!ModalModLicitacion);
    };

    /*Estado y Funcion para modal Confirmacion Eliminar Licitacion*/
    const [ModalConfirElimLicitacion, setModalConfirElimLicitacion] = useState(false);
    const AbrirCerrarModalConfirElimLicitacion = () => {
        setModalConfirElimLicitacion(!ModalConfirElimLicitacion);
    };

    /*Estado y Funcion para modal Variacion Precio*/
    const [ModalVariacion, setModalVariacion] = useState(false);
    const AbrirCerrarModalVariacion = () => {
        setModalVariacion(!ModalVariacion);
    };

    /*Funcion Para Cambiar el estado de la variable de estado Licitaciones directo desde los textfields */
    const onChangeLicitacion = (e:React.ChangeEvent<any>) =>{
        setLicitacionesC({...LicitacionesC,[e.target.name]: e.target.value})
    }
    /*Funcion Para Cambiar el estado de la variable de estado Licitaciones directo desde los textfields */
    const onChangeLicitacionM = (e:React.ChangeEvent<any>) =>{
        setLicitacionesM({...LicitacionesM,[e.target.name]: e.target.value})
    }
    /*Funcion Para Cambiar el estado de la variable de estado Licitaciones directo desde los textfields */
    const onChangeLicDetalle = (e:React.ChangeEvent<any>) =>{
        setLicDetalleC({...LicDetalleC,[e.target.name]: e.target.value})
    }

    /*Funcion Para Cambiar el estado de la variable de estado Licitaciones directo desde los textfields */
    const onChangeLicDetalleVar = (e:React.ChangeEvent<any>) =>{
        setLicDetalleVarC({...LicDetalleVarC,[e.target.name]: e.target.value})
    }

    /*Funcion para Leer TipoLicitaciones*/
    const LeerTipoLicitaciones = async () => {
        await Axios.post('http://192.168.25.141:3000/api/rlicitaciontipo', {
          }, {
            headers: {
                'Token': localStorage.getItem("Token"),
            }
        }).then((response) => {
            setTipoLicitaciones(response.data)
            /*console.log(response.data)*/
        });
    }
    /*Funcion para Leer Socios de Negocio*/
    const LeerSociosNegocio = async () => {
        Axios.post('http://192.168.25.141:3000/api/rsocionegocio', {
        }, {
            headers: {
                'Token': localStorage.getItem("Token"),
            }
        }).then((response) => {
            setSociosNegocio(response.data)
            /*console.log(response.data)*/
        });
    }
    /*definicion columnas grid socios de negocio */
    const columnsSocios: GridColDef[] = [    
        { field: 'Id_SocioNegocio', headerName: 'ID', width: 50, editable: false,},
        { field: 'NumDocumento_SocioNegocio', headerName: 'Documento', width: 150, editable: false,},
        { field: 'RS_SocioNegocio', headerName: 'Razón Social', width: 450, editable: false,},
        { field: 'TipoPersona_SocioNegocio', headerName: 'Tipo Persona', width: 100, editable: false,},
        { field: 'date', headerName: '',
            renderCell: (rows) => (
              <strong>            
                <IconButton style={{color:"Green"}} size="small" onClick={() => {SocioNegocioSeleccion(rows.row);}}><DoneOutlineIcon/></IconButton>
              </strong>
            ),
        }
      ]; 
    /*Funcion botn seleccionar tabla Socios de Negocio*/
    const SocioNegocioSeleccion = (data:any) => {
        setLicitacionesC({
            ...LicitacionesC,
            RSSocioNegocio: data.RS_SocioNegocio,
            Fk_Id_SocioNegocio: data.Id_SocioNegocio
        })
        AbrirCerrarModalSN();
        /*console.log(data.Id_SocioNegocio);
        console.log(dayjs(LicitacionesC.FechIni_Licitacion).format('YYYY-MM-DD'));*/
    };

    /*Funcion Para Crear Licitaciones */
    const CrearLicitacion = async (e:any) => {
        e.preventDefault();       
        console.log(LicitacionesC);
        if (!LicitacionesC.Nro_Licitacion || !LicitacionesC.FechIni_Licitacion || !LicitacionesC.FechFin_Licitacion || !LicitacionesC.LugarEntrega_Licitacion || !LicitacionesC.Monto_Licitacion || !LicitacionesC.Fk_Id_SocioNegocio || !LicitacionesC.Fk_Id_Tipo_Licitacion) {
            setSnackbar({ Color: 'error', Mensaje: 'Complete Los Datos Obligatorios*' });
            setOpenSnackBar(true);
        } else { 
            await Axios.post('http://192.168.25.141:3000/api/clicitacion', {
                Nro_Licitacion: LicitacionesC.Nro_Licitacion,
                FechIni_Licitacion: dayjs(LicitacionesC.FechIni_Licitacion).format('YYYY-MM-DD'),
                FechFin_Licitacion: dayjs(LicitacionesC.FechFin_Licitacion).format('YYYY-MM-DD'),
                LugarEntrega_Licitacion: LicitacionesC.LugarEntrega_Licitacion,
                SujetoVarPrecio_Licitacion: LicitacionesC.SujetoVarPrecio_Licitacion,
                Monto_Licitacion: LicitacionesC.Monto_Licitacion,
                Observacion_Licitacion: LicitacionesC.Observacion_Licitacion,
                Acceso_creacion: parseInt(localStorage.getItem("Acceso")!),
                Fk_Id_SocioNegocio: LicitacionesC.Fk_Id_SocioNegocio,
                Fk_Id_Tipo_Licitacion: LicitacionesC.Fk_Id_Tipo_Licitacion
            }, {
                headers: {
                    'Token': localStorage.getItem("Token"),
                }
            }).then((response) => {
                if (response.data.id_message === 0) {
                    setSnackbar({ Color: 'success', Mensaje: response.data.message });
                    setOpenSnackBar(true);
                    LeerLicitaciones();
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

    /*Funcion Para Limpiar celdas Licitaciones*/
    const LimpiarCasillasL = async (e:any) => {
        setLicitacionesM({
            Id_LicitacionM: 0,
            Nro_LicitacionM: "",
            FechIni_LicitacionM: dayjs(''),
            FechFin_LicitacionM: dayjs(''),
            LugarEntrega_LicitacionM: "",
            SujetoVarPrecio_LicitacionM: 0,
            Monto_LicitacionM: 0,
            Observacion_LicitacionM: "",
            Estado_LicitacionM: 0,
            RSSocioNegocioM: "",
            Fk_Id_SocioNegocioM: "",
            Fk_Id_Tipo_LicitacionM: ""
        })
    }

    /*Funcion Para Leer Licitaciones*/
    const LeerLicitaciones = async () => {
        Axios.post('http://192.168.25.141:3000/api/rlicitacion', {
        }, {
            headers: {
                'Token': localStorage.getItem("Token"),
            }
        }).then((response) => {
            setLicitaciones(response.data)
            console.log(response.data)
        });
    }
    
    /*definicion columnas grid  */
    const columsLicitaciones: GridColDef[] = [    
        { field: 'Id_Licitacion', headerName: 'ID', width: 50, editable: false,},        
        { field: 'Nro_Licitacion', headerName: 'Licitacion', width: 130, editable: false,},
        { field: 'RS_SocioNegocio', headerName: 'Entidad', width: 300, editable: false,},
        { field: 'Descrip_LicitacionTipo', headerName: 'Tipo Licitación', width: 130, editable: false,},
        { field: 'Monto_Licitacion', headerName: 'Monto', width: 130, editable: false,},
        {
            field: 'Variacion', width: 80,
            valueGetter: ({ row }) => {
              if (row.SujetoVarPrecio_Licitacion==0) {
                return 'No';
              }
              else return 'Si';              
            },
        },        
        { field: 'LugarEntrega_Licitacion', headerName: 'Entrega', width: 150, editable: false,},
        {
            field: 'Fecha Inicio',
            width: 150,
            valueGetter: ({ row }) => {
              /*if (row.Estado_acceso==0) {*/
                return dayjs(row.FechIni_Licitacion).format('YYYY-MM-DD');
                           
            },
        },
        {
            field: 'Fecha Fin',
            width: 150,
            valueGetter: ({ row }) => {
              /*if (row.Estado_acceso==0) {*/
                return dayjs(row.FechFin_Licitacion).format('YYYY-MM-DD');
                           
            },
        },
        {
            field: 'Estado', width: 80,
            valueGetter: ({ row }) => {
              if (row.Estado_Licitacion==0) {
                return 'Creado';
              }
              else if(row.Estado_Licitacion==1){
                return 'Iniciado';
              }
              else if(row.Estado_Licitacion==2){
                return 'Pausado';
              }
              else return 'Finalizado';              
            },
        }, 
        { field: 'Observacion_Licitacion', headerName: 'Observación', width: 150, editable: false,},
        { field: 'detalle', headerName: '',
            renderCell: (rows) => (
              <strong>            
                <IconButton style={{color:"green"}} size="small" onClick={() => {AbrirModalLicDetalle(rows.row);}}><FormatListBulletedIcon/></IconButton>
              </strong>
            ),
        },
        { field: 'editar', headerName: '',
            renderCell: (rows) => (
              <strong>            
                <IconButton style={{color:"blue"}} size="small" onClick={() => {AbrirModalModLicitacion(rows.row);}}><ModeEditIcon/></IconButton>
              </strong>
            ),
        },
        { field: 'eliminar', headerName: '',
            renderCell: (rows) => (
              <strong>            
                <IconButton style={{color:"red"}} size="small" onClick={() => {ConfirmarElimLicitacion(rows.row);}}><DeleteOutlineIcon/></IconButton>
              </strong>
            ),
        }
      ]; 

      /*Funcion Para Modificar Licitaciones */
    const ModificarLicitacion = async (e:any) => {
        e.preventDefault();     
        if (!LicitacionesM.Nro_LicitacionM || !LicitacionesM.FechIni_LicitacionM || !LicitacionesM.FechFin_LicitacionM || !LicitacionesM.LugarEntrega_LicitacionM || !LicitacionesM.Monto_LicitacionM || !LicitacionesM.Fk_Id_SocioNegocioM || !LicitacionesM.Fk_Id_Tipo_LicitacionM) {
            setSnackbar({ Color: 'error', Mensaje: 'Complete Los Datos Obligatorios*' });
            setOpenSnackBar(true);
        } else { 
            await Axios.post('http://192.168.25.141:3000/api/ulicitacion', {
                Id_Licitacion: LicitacionesM.Id_LicitacionM,
                Nro_Licitacion: LicitacionesM.Nro_LicitacionM,
                FechIni_Licitacion: dayjs(LicitacionesM.FechIni_LicitacionM).format('YYYY-MM-DD'),
                FechFin_Licitacion: dayjs(LicitacionesM.FechFin_LicitacionM).format('YYYY-MM-DD'),
                LugarEntrega_Licitacion: LicitacionesM.LugarEntrega_LicitacionM,
                SujetoVarPrecio_Licitacion: LicitacionesM.SujetoVarPrecio_LicitacionM,
                Monto_Licitacion: LicitacionesM.Monto_LicitacionM,
                Observacion_Licitacion: LicitacionesM.Observacion_LicitacionM,
                Estado_Licitacion: LicitacionesM.Estado_LicitacionM,
                AccesoModificacion: parseInt(localStorage.getItem("Acceso")!),
                Fk_Id_SocioNegocio: LicitacionesM.Fk_Id_SocioNegocioM,
                Fk_Id_Tipo_Licitacion: LicitacionesM.Fk_Id_Tipo_LicitacionM
            }, {
                headers: {
                    'Token': localStorage.getItem("Token"),
                }
            }).then((response) => {
                if (response.data.id_message === 0) {
                    setSnackbar({ Color: 'success', Mensaje: response.data.message });
                    setOpenSnackBar(true);
                    LeerLicitaciones();
                    AbrirCerrarModalModLicitacion();
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
    /*Funcion Confirmar Elimnacion Modal*/ 
    const ConfirmarElimLicitacion = (data:any) => {
        AbrirCerrarModalConfirElimLicitacion();
        setLicitacionesE({...LicitacionesE,Id_LicitacionE:data.Id_Licitacion,Nro_LicitacionE:data.Nro_Licitacion});
        
    }

    /*Funcion Para Eliminar Licitaciones*/
    const EliminarLicitacion = () => {
        Axios.post('http://192.168.25.141:3000/api/dlicitacion', {
            Id_Licitacion: LicitacionesE.Id_LicitacionE,
        }, {
            headers: {
                'Token': localStorage.getItem("Token"),
            }
        }).then((response) => {
            if (response.data.id_message === 0) {
                setSnackbar({ Color: 'success', Mensaje: response.data.message });
                setOpenSnackBar(true);
                AbrirCerrarModalConfirElimLicitacion();
                LeerLicitaciones();
                
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

    /*Listar Articulos Modal */
    const ListarArticulos = async () => {
        await Axios.post('http://192.168.25.141:3000/api/rarticuloComb', {
        }, {
            headers: {
                'Token': localStorage.getItem("Token"),
            }
        }).then((response) => {
            setArticulos(response.data)
        });
    }

     /*Funcion Para Crear Licitacion Detalle */
     const CrearLicDetalle = async (e:any) => {
        e.preventDefault();      
        if (!LicDetalleC.Cantidad_Lic_Det || !LicDetalleC.Precio_Lic_Det || !LicDetalleC.Fk_Id_Licitacion || !LicDetalleC.Fk_Id_Articulo ) {
            setSnackbar({ Color: 'error', Mensaje: 'Complete Los Datos Obligatorios*' });
            setOpenSnackBar(true);
        } else { 
            await Axios.post('http://192.168.25.141:3000/api/clicitaciondet', {
                Cantidad_Lic_Det: LicDetalleC.Cantidad_Lic_Det,    
                Precio_Lic_Det: LicDetalleC.Precio_Lic_Det,    
                Total_Lic_Det: parseFloat((LicDetalleC.Cantidad_Lic_Det*LicDetalleC.Precio_Lic_Det).toFixed(2)),                
                Acceso_creacion: parseInt(localStorage.getItem("Acceso")!),
                Fk_Id_Licitacion: LicDetalleC.Fk_Id_Licitacion,
                Fk_Id_Articulo: LicDetalleC.Fk_Id_Articulo
            }, {
                headers: {
                    'Token': localStorage.getItem("Token"),
                }
            }).then((response) => {
                if (response.data.id_message === 0) {
                    setSnackbar({ Color: 'success', Mensaje: response.data.message });
                    setOpenSnackBar(true);
                    ListarLicDetalle(LicDetalleC.Fk_Id_Licitacion);
                    LeerLicitaciones();
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
     /*Funcion Para Eliminar LICITACION DETALLE*/
     const EliminarLicDetalle = (data:any) => {
        Axios.post('http://192.168.25.141:3000/api/dlicitaciondet', {
            Id_Lic_Det: data.Id_Lic_Det,
        }, {
            headers: {
                'Token': localStorage.getItem("Token"),
            }
        }).then((response) => {
            if (response.data.id_message === 0) {
                setSnackbar({ Color: 'success', Mensaje: response.data.message });
                setOpenSnackBar(true);
                ListarLicDetalle(LicDetalleC.Fk_Id_Licitacion);
                LeerLicitaciones();
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


    /*Abri Modal Licitacion Detalle*/
    const AbrirModalLicDetalle = (data:any) => {
        AbrirCerrarModalDetalleLic();
        ListarArticulos();        
        setLicDetalleC({...LicDetalleC,Fk_Id_Licitacion:data.Id_Licitacion});  
        ListarLicDetalle(data.Id_Licitacion!);
        
    }
    /*Funcion para Listar Detalle Licitacion*/
    const ListarLicDetalle = async (data:any) => {
        await Axios.post('http://192.168.25.141:3000/api/rlicitaciondet', {
            Fk_Id_Licitacion: data!
        }, {
            headers: {
                'Token': localStorage.getItem("Token"),
            }
        }).then((response) => {
            setLicitacionDetalle(response.data)
        });
    }
    
    /*definicion columnas grid Detalle Licitacion */
    const columnsLicDetalle: GridColDef[] = [    
        { field: 'Id_Lic_Det', headerName: 'ID', width: 50, editable: false,},
        { field: 'Descrip_Articulo', headerName: 'Combustible', width: 180, editable: false,},
        { field: 'Cantidad_Lic_Det', headerName: 'Cantidad', width: 100, editable: false,},
        { field: 'Precio_Lic_Det', headerName: 'Precio Unitario', width: 120, editable: false,},
        { field: 'Total_Lic_Det', headerName: 'Total', width: 100, editable: false,},
        { field: 'variación', headerName: '',
            renderCell: (rows) => (
              <strong>            
                <IconButton style={{color:"blue"}} size="small" onClick={() => {AbrirModalLicDetaVar(rows.row);}}><AddchartIcon/></IconButton>
              </strong>
            ),
        },
        { field: 'eliminar', headerName: '',
            renderCell: (rows) => (
              <strong>            
                <IconButton style={{color:"red"}} size="small" onClick={() => {EliminarLicDetalle(rows.row);}}><DeleteOutlineIcon/></IconButton>
              </strong>
            ),
        }
      ]; 

    /*Abri Modal Licitacion Detalle*/
    const AbrirModalModLicitacion = (data:any) => {
        AbrirCerrarModalModLicitacion();   
        setLicitacionesM({
            ...LicitacionesM,
            Id_LicitacionM: data.Id_Licitacion,
            Nro_LicitacionM: data.Nro_Licitacion,
            FechIni_LicitacionM: dayjs(data.FechIni_Licitacion),
            FechFin_LicitacionM: dayjs(data.FechFin_Licitacion),
            LugarEntrega_LicitacionM: data.LugarEntrega_Licitacion,
            Monto_LicitacionM: data.Monto_Licitacion,
            Observacion_LicitacionM: data.Observacion_Licitacion,
            Estado_LicitacionM: data.Estado_Licitacion,
            RSSocioNegocioM: data.RS_SocioNegocio,
            Fk_Id_SocioNegocioM: data.fk_Id_SocioNegocio,
        })  
    }

    /*Abri Modal Licitacion Variación*/
    const AbrirModalLicDetaVar = (data:any) => {
        AbrirCerrarModalVariacion();   
        setLicDetalleVarC({
            ...LicDetalleVarC,
            Id_Lic_Det: data.Id_Lic_Det,
            ProductoVariacion: data.Descrip_Articulo,
        })  
    }

    /*Funcion Para Crear Licitacion Detalle Variación*/
    const CrearLicDetalleVar = async (e:any) => {
        e.preventDefault();      
        if (!LicDetalleVarC.Id_Lic_Det || !LicDetalleVarC.Precio_Lic_Det || !LicDetalleVarC.Tipo_Lic_Det) {
            setSnackbar({ Color: 'error', Mensaje: 'Complete Los Datos Obligatorios*' });
            setOpenSnackBar(true);
        } else { 
            await Axios.post('http://192.168.25.141:3000/api/clicitaciondetvar', {
                Id_Lic_Det: LicDetalleVarC.Id_Lic_Det,   
                Precio_Lic_Det: LicDetalleVarC.Precio_Lic_Det,    
                Tipo_Lic_Det: LicDetalleVarC.Tipo_Lic_Det,                
                Acceso_creacion: parseInt(localStorage.getItem("Acceso")!)
            }, {
                headers: {
                    'Token': localStorage.getItem("Token"),
                }
            }).then((response) => {
                if (response.data.id_message === 0) {
                    setSnackbar({ Color: 'success', Mensaje: response.data.message });
                    setOpenSnackBar(true);
                    AbrirCerrarModalVariacion();
                    ListarLicDetalle(LicDetalleC.Fk_Id_Licitacion);
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

    

    useEffect(() => {
        LeerTipoLicitaciones();
        LeerLicitaciones();
    }, []);

    return(
        <SideNavBar>
            <Box sx={{ m: 2 }}>
                <Typography variant="h5" component="div">
                            <Box fontWeight="fontWeightBold">Licitaciones </Box>
                </Typography>
            </Box>
            <Box sx={{'& .MuiTextField-root': { m: 2, width: '25ch' },}}>
                <div>
                    <TextField id="outlined-start-adornment" value={LicitacionesC.RSSocioNegocio}  label="Cliente Licitación*"  size="small" InputProps={{endAdornment: <InputAdornment position="end"><IconButton onClick={()=>{AbrirCerrarModalSN();LeerSociosNegocio();}}><SearchIcon/></IconButton></InputAdornment>}} disabled/>  
                    <TextField id="outlined-helperText" label="Número Licitacion*"  size="small" name="Nro_Licitacion" onChange={onChangeLicitacion} autoComplete='off'/>     
                    <TextField id="outlined-select-currency" select label="Tipo Licitación*" defaultValue="" size="small" name="Fk_Id_Tipo_Licitacion" onChange={onChangeLicitacion}>
                        {TipoLicitaciones.map((option) => (
                            <MenuItem key={option.Id_LicitacionTipo} value={option.Id_LicitacionTipo}>
                            {option.Descrip_LicitacionTipo}
                            </MenuItem>
                        ))}
                     </TextField>                  
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                         <DatePicker label="Fecha Inicio*" slotProps={{ textField: { size: 'small' } }} onChange={(newValue) =>setLicitacionesC({...LicitacionesC,FechIni_Licitacion:newValue as string})} />
                         <DatePicker label="Fecha Fin*" slotProps={{ textField: { size: 'small' } }} onChange={(newValue2) =>setLicitacionesC({...LicitacionesC,FechFin_Licitacion:newValue2 as string})}/>
                    </LocalizationProvider> 
                    <TextField id="outlined-multiline-flexible" label="Lugar Entrega*"  size="small" multiline maxRows={4} name="LugarEntrega_Licitacion" onChange={onChangeLicitacion} autoComplete='off'/>         
                    <TextField id="outlined-select-currency" select label="Sujeto Variación*" defaultValue="0" size="small" name="SujetoVarPrecio_Licitacion" onChange={onChangeLicitacion}>
                        {Variacion.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                     </TextField>
                     <TextField id="outlined-start-adornment" label="Monto Total*" size="small" InputProps={{startAdornment: <InputAdornment position="start">S/.</InputAdornment>}} name="Monto_Licitacion" onChange={(e)=>{setLicitacionesC({...LicitacionesC,Monto_Licitacion:Number(e.target.value)})}} autoComplete='off'/>  
                     <TextField id="outlined-multiline-obs" label="Observación"  size="small" multiline maxRows={4} name="Observacion_Licitacion"  onChange={onChangeLicitacion} autoComplete='off'/>                                 
                </div> 
            </Box>   
            <Box display="flex" justifyContent="center" alignItems="center" sx={{'& .MuiTextField-root': { m: 2, width: '25ch' },}}>
                <div>
                    <Button style={{marginRight:'17px'}} variant="contained" color="success" onClick={CrearLicitacion} startIcon={<SaveIcon />} className='Buttons'>Guardar</Button>
                    <Button type="submit" variant="contained" color="warning" onClick={LimpiarCasillasL} startIcon={<CleaningServicesIcon />} className='Buttons'>Limpiar</Button>
                </div>
            </Box>   
            <Box sx={{ m: 2 }}>
                <DataGrid rows={Licitaciones} columns={columsLicitaciones} initialState={{pagination: {paginationModel: {pageSize: 5,},},}} pageSizeOptions={[5]} getRowId={(row) => row.Id_Licitacion} sx={{boxShadow: 2,border: 1,"& .MuiDataGrid-cell:hover": {color: "primary.main"}}}/>
            </Box>

            <Modal open={ModalSociosN} onClose={AbrirCerrarModalSN} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Box sx={{ m: 2 }} fontStyle={"italic"}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Socios de Negocio
                        </Typography>
                    </Box>
                    <Box sx={{ m: 2 }}>
                        <DataGrid rows={SociosNegocio} columns={columnsSocios} initialState={{pagination: {paginationModel: {pageSize: 5,},},}} pageSizeOptions={[5]} disableRowSelectionOnClick getRowId={(row) => row.Id_SocioNegocio}/>
                    </Box>
                </Box>
            </Modal>  
            <Modal open={ModalDetalleLic} onClose={AbrirCerrarModalDetalleLic} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Box sx={{ m: 2 }} fontStyle={"italic"}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Productos Licitación
                        </Typography>
                    </Box>
                    <Box sx={{ m: 2 }}>
                        <TextField id="outlined-select-currency" select label="Combustible*" defaultValue="" size="small" name="Fk_Id_Articulo" sx={{mr:1, width: '20ch' }} onChange={onChangeLicDetalle}>
                            {Articulos.map((option) => (
                                <MenuItem key={option.Id_Articulo} value={option.Id_Articulo}>
                                {option.Descrip_Articulo}
                                </MenuItem>
                            ))}
                        </TextField>     
                        <TextField type="number" id="outlined-start-adornment" label="Cantidad*" size="small" InputProps={{startAdornment: <InputAdornment position="start">GL.</InputAdornment>}} name="Cantidad_Lic_Det" onChange={(e)=>{setLicDetalleC({...LicDetalleC,Cantidad_Lic_Det:Number(e.target.value)})}} sx={{mr:1, width: '20ch' }}/>           
                        <TextField type="number" id="outlined-start-adornment" label="Precio Unitario*" size="small" InputProps={{startAdornment: <InputAdornment position="start">S/.</InputAdornment>}} name="Precio_Lic_Det" onChange={(e)=>{setLicDetalleC({...LicDetalleC,Precio_Lic_Det:Number(e.target.value)})}} sx={{mr:1, width: '20ch' }}/> 
                        <TextField id="outlined-start-adornment" label="Total*" size="small" InputProps={{startAdornment: <InputAdornment position="start">S/.</InputAdornment>}} name="Total_Lic_Det" value={(LicDetalleC.Cantidad_Lic_Det!*LicDetalleC.Precio_Lic_Det!).toFixed(2)} sx={{width: '20ch' }} disabled/> 
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{'& .MuiTextField-root': { m: 2, width: '25ch' },}}>
                        <div>
                            <Button variant="contained" color="success" onClick={CrearLicDetalle} startIcon={<SaveIcon />} className='Buttons'>Guardar</Button>
                            <Button type="submit" variant="contained" color="warning" startIcon={<CleaningServicesIcon />} className='Buttons'>Limpiar</Button>
                        </div>
                    </Box>  
                    <Box sx={{ m: 2 }}>                   
                        <DataGrid rows={LicitacionDetalle} columns={columnsLicDetalle} initialState={{pagination: {paginationModel: {pageSize: 5,},},}} pageSizeOptions={[5]} disableRowSelectionOnClick getRowId={(row) => row.Id_Lic_Det} sx={{boxShadow: 2,border: 1,"& .MuiDataGrid-cell:hover": {color: "primary.main"}}}/>
                    </Box>
                </Box>
            </Modal>  
            <Modal open={ModalModLicitacion} onClose={AbrirCerrarModalModLicitacion} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Box sx={{ m: 2 }} fontStyle={"italic"}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Modificar Licitación
                        </Typography>
                    </Box>
                    <Box sx={{ m: 2 }}>
                        <TextField id="outlined-start-adornment" value={LicitacionesM.RSSocioNegocioM}  label="Cliente*"  size="small" InputProps={{endAdornment: <InputAdornment position="end"><IconButton onClick={()=>{}}><SearchIcon/></IconButton></InputAdornment>}} sx={{mr:1, mb:2, width: '30ch' }} disabled/>  
                        <TextField id="outlined-helperText" label="Número Licitacion*"  size="small" value={LicitacionesM.Nro_LicitacionM} name="Nro_LicitacionM" onChange={onChangeLicitacionM} sx={{mr:1, mb:2, width: '20ch' }} autoComplete='off'/>                           
                        <TextField id="outlined-select-currency" select label="Estado*" defaultValue="1" size="small" name="Estado_LicitacionM" onChange={onChangeLicitacionM} sx={{mr:1, mb:2, width: '20ch' }}>
                            {EstadoLic.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                </MenuItem>
                            ))}
                        </TextField> 
                        <TextField id="outlined-select-currency" select label="Tipo Licitación*" size="small" name="Fk_Id_Tipo_LicitacionM" onChange={onChangeLicitacionM} sx={{mr:1, mb:2, width: '20ch' }}>
                            {TipoLicitaciones.map((option) => (
                                <MenuItem key={option.Id_LicitacionTipo} value={option.Id_LicitacionTipo}>
                                {option.Descrip_LicitacionTipo}
                                </MenuItem>
                            ))}
                        </TextField> 
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker label="Fecha Inicio*" slotProps={{ textField: { size: 'small' } }} value={LicitacionesM.FechIni_LicitacionM} onChange={(newValue) =>setLicitacionesM({...LicitacionesM,FechIni_LicitacionM:newValue!})}  sx={{mr:1, mb:2, width: '20ch' }}/>
                            <DatePicker label="Fecha Fin*" slotProps={{ textField: { size: 'small' } }} value={LicitacionesM.FechFin_LicitacionM} onChange={(newValue2) =>setLicitacionesM({...LicitacionesM,FechFin_LicitacionM:newValue2!})}  sx={{mr:1, mb:2, width: '20ch' }}/>
                        </LocalizationProvider> 
                        <TextField id="outlined-multiline-flexible" label="Lugar Entrega*" value={LicitacionesM.LugarEntrega_LicitacionM} size="small" multiline maxRows={4} name="LugarEntrega_LicitacionM" onChange={onChangeLicitacionM} sx={{mr:1, mb:2, width: '20ch' }} autoComplete='off'/>         
                        <TextField id="outlined-select-currency" select label="Sujeto Variación*" defaultValue="0" size="small" name="SujetoVarPrecio_LicitacionM" onChange={onChangeLicitacionM} sx={{mr:1, mb:2, width: '20ch' }}>
                            {Variacion.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField id="outlined-start-adornment" label="Monto Total*" value={LicitacionesM.Monto_LicitacionM} size="small" InputProps={{startAdornment: <InputAdornment position="start">S/.</InputAdornment>}} type="number" name="Monto_LicitacionM" onChange={(e)=>{setLicitacionesM({...LicitacionesM,Monto_LicitacionM:Number(e.target.value)})}} sx={{mr:1, mb:2, width: '20ch' }} autoComplete='off'/>  
                        <TextField id="outlined-multiline-obs" label="Observación" value={LicitacionesM.Observacion_LicitacionM}  size="small" multiline maxRows={4} name="Observacion_LicitacionM"  onChange={onChangeLicitacionM} sx={{mb:2, width: '20ch' }} autoComplete='off'/> 
                        
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{'& .MuiTextField-root': { m: 2, width: '25ch' },}}>
                        <div>
                            <Button variant="contained" color="success" onClick={ModificarLicitacion} startIcon={<SaveIcon />} className='Buttons'>Modificar</Button>
                            <Button type="submit" variant="contained" onClick={AbrirCerrarModalModLicitacion} color="error" startIcon={<CleaningServicesIcon />} className='Buttons'>Cerrar</Button>
                        </div>
                    </Box> 
                </Box>
            </Modal>  

            <Modal open={ModalVariacion} onClose={AbrirCerrarModalVariacion} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style2}>
                    <Box sx={{ m: 2 }} fontStyle={"italic"}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Variación De Precio
                        </Typography>
                    </Box>
                    <Box sx={{ m: 2 }}>
                        <TextField id="outlined-start-adornment" label="Producto*" value={LicDetalleVarC.ProductoVariacion}  size="small" sx={{mr:1, mb:2, width: '20ch' }} disabled/>  
                        <TextField id="outlined-start-adornment" label="Nuevo Precio Unitario*" size="small" InputProps={{startAdornment: <InputAdornment position="start">S/.</InputAdornment>}} onChange={(e)=>{setLicDetalleVarC({...LicDetalleVarC,Precio_Lic_Det:Number(e.target.value)})}} sx={{mr:1, mb:2, width: '20ch' }}/>                              
                    </Box>
                    <Box sx={{ m: 2 }}>
                          <FormControl>
                            <FormLabel id="demo-controlled-radio-buttons-group">Tipo Variación</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                onChange={(e)=>{setLicDetalleVarC({...LicDetalleVarC,Tipo_Lic_Det:Number(e.target.value)})}}
                            >
                                <FormControlLabel value="1" control={<Radio />} label="Galonaje" />
                                <FormControlLabel value="2" control={<Radio />} label="Precio" />
                            </RadioGroup>
                            </FormControl>                  
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{'& .MuiTextField-root': { m: 2, width: '25ch' },}}>
                        <div>
                            <Button variant="contained" color="success" onClick={CrearLicDetalleVar} startIcon={<SaveIcon />} className='Buttons'>Guardar</Button>
                            <Button type="submit" variant="contained" onClick={AbrirCerrarModalVariacion} color="error" startIcon={<CleaningServicesIcon />} className='Buttons'>Cerrar</Button>
                        </div>
                    </Box> 
                </Box>
            </Modal> 
            <Modal open={ModalConfirElimLicitacion} onClose={AbrirCerrarModalConfirElimLicitacion} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style2}>
                    <Box sx={{ m: 2 }} fontStyle={"italic"}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            ¿Eliminar Licitacion {LicitacionesE.Nro_LicitacionE}?
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{'& .MuiTextField-root': { m: 2, width: '25ch' },}}>
                        <div>
                            <Button variant="contained" color="success" onClick={EliminarLicitacion} startIcon={<SaveIcon />} className='Buttons'>Eliminar</Button>
                            <Button type="submit" variant="contained" onClick={AbrirCerrarModalConfirElimLicitacion} color="error" startIcon={<CleaningServicesIcon />} className='Buttons'>Cancelar</Button>
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