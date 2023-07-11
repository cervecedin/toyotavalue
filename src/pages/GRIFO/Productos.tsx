import SideNavBar from "../Modulos/SideNavBar"
import Axios from 'axios';
import { useState,useEffect,forwardRef } from 'react'
import {TextField,Typography, Box, MenuItem,Button,IconButton,Modal, Snackbar, InputAdornment } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const EsCombustible = [
    {
      value: 0,
      label: 'No',
    },
    {
      value: 1,
      label: 'Si',
    }
  ];
  const AcceCreacion = [
    {
      value: 0,
      label: 'No',
    },
    {
      value: 1,
      label: 'Si',
    }
  ];

export default function CrudArticulos() {
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
    const [Combustible, setCombustible] = useState<any[]>([]);
    /*Estado para los registros de la tabla Articulos*/
    const [Articulos, setArticulos] = useState([]);
    /*Estado para los campos de crear Articulos*/
    const [ArticulosC, setArticulosC] = useState({
      CodigoSap_Articulo: "",
	    Descrip_Articulo: "",
	    EsCombustible_Articulo: 1, 
	    AccesoCreacion: 1,
      Fecha_Creacion: "", 
	    Xpump_Articulo: ""
    });
    /*Estado para los modificar Articulo*/
    const [ArticulosM, setArticulosM] = useState({
        Id_ArticuloM: 0,
        CodigoSap_ArticuloM: "",
        Descrip_ArticuloM: "",
        EsCombustible_Articulo: 1,
        EstadoArticuloM: 1,
        AccesoCreacionM: 1, 
        Fecha_CreacionM: dayjs(''),
        Xpump_Articulo: ""
    });

    /*Estado y Funcion para modal de Codigo SAP Articulo*/
    const [ModalCodigoSA, setModalCodigoSA] = useState(false);
    const AbrirCerrarModalSN = () => {
        setModalCodigoSA(!ModalCodigoSA);
    }
    /*Funcion Para Cambiar el estado de la variable de estado Producto directo desde los textfields */
    const onChangeArticulosC = (e:React.ChangeEvent<any>) =>{
        setArticulosC({...ArticulosC,[e.target.name]: e.target.value})
    }

    /*Funcion Para Crear Articulos */
    const CrearArticulos = async (e:any) => {
        e.preventDefault();      
        console.log(ArticulosC);
        if (!ArticulosC.CodigoSap_Articulo || !ArticulosC.Descrip_Articulo || !ArticulosC.EsCombustible_Articulo || !ArticulosC.AccesoCreacion || !ArticulosC.Xpump_Articulo) {
            setSnackbar({ Color: 'error', Mensaje: 'Complete Los Datos Obligatorios*' });
            setOpenSnackBar(true);
        } else { 
            await Axios.post('http://192.168.25.167:4000/api/signup', {
                CodigoSap_Articulo: ArticulosC.CodigoSap_Articulo,
                Descrip_Articulo: ArticulosC.Descrip_Articulo,
                EsCombustible_Articulo: ArticulosC.EsCombustible_Articulo,
                Acceso_Creacion: parseInt(localStorage.getItem("Acceso")!),
                Xpump_Articulo: ArticulosC.Xpump_Articulo
            }, {
                headers: {
                    'Token': localStorage.getItem("Token"),
                }
            }).then((response) => {
                if (response.data.id_message === 0) {
                    setSnackbar({ Color: 'success', Mensaje: response.data.message });
                    setOpenSnackBar(true);
                    LimpiarArticulosC();
                    /*LeerArticulos();*/

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
    const LimpiarArticulosC = () => {
        setArticulosC({
          CodigoSap_Articulo: "",
	        Descrip_Articulo: "",
	        EsCombustible_Articulo: 1, 
	        AccesoCreacion: 1,
          Fecha_Creacion: "", 
	        Xpump_Articulo: ""
        })

    }

    /*definicion columnas grid  */
    const columnsAccesos: GridColDef[] = [    
        { field: 'Id_Articulo', headerName: 'ID', width: 50, editable: false,},
        { field: 'CodigoSap_Articulo', headerName: 'CodSap Articulo', width: 280, editable: true,},
        { field: 'Descrip_Articulo', headerName: 'Descripción Articulo', width: 280, editable: true,},
        {
            field: 'EsCombustible', headerName:'¿Es Combustible?', width: 180,
            valueGetter: ({ row }) => {
              if (row.EsCombustible_Articulo==0) {
                return 'No';
              }
              else return 'Si';              
            },
        },
        {
            field: 'Estado_ArticuloM', headerName:'Estado Articulo', width: 150,
            valueGetter: ({ row }) => {
              if (row.Estado_ArticuloM==0) {
                return 'Deshabilitado';
              }
              else return 'Habilitado';              
            },
        },
        { 
            field: 'AcceCreacion', headerName: 'Creacion de Acceso', width: 140, 
            valueGetter: ({ row }) => {
            if (row.AccesoCreacion==0) {
              return 'No';
            }
            else return 'Si';              
            },
        },
        {
            field: 'FechaCreacion',
            headerName: 'Fecha de Creación',
            width: 150,
            valueGetter: ({ row }) => {
              /*if (row.Estado_acceso==0) {*/
                return dayjs(row.Fecha_Creacion).format('YYYY-MM-DD');
                           
            },
        },
        { field: 'Xpump_Articulo', headerName: 'Xpump Articulo', width: 200, editable: true,},
        
        // { field: 'editar', headerName: '',
        //     renderCell: (rows) => (
        //       <strong>            
        //         <IconButton style={{color:"blue"}} size="small" onClick={() => {ModificarAcceso(rows.row);}}><ModeEditIcon/></IconButton>
        //       </strong>
        //     ),
        // },
        // { field: 'elimnar', headerName: '',
        //     renderCell: (rows) => (
        //       <strong>            
        //         <IconButton style={{color:"red"}} size="small" onClick={() => {DeshabilitarAcceso(rows.row);}}><DeleteOutlineIcon/></IconButton>
        //       </strong>
        //     ),
        // }
      ]; 
    
   
      return(
        <SideNavBar>
            <Box sx={{ m: 2 }}>
                <Typography variant="h5" component="div">
                            <Box fontWeight="fontWeightBold">Artículos </Box>
                </Typography>
            </Box>
            <Box component="form" sx={{'& .MuiTextField-root': { m: 2, width: '25ch' },}} noValidate autoComplete="on" style={{textAlign:'center'}}>
                <div>                    
                    <TextField id="outlined-start-adornment" value={ArticulosC} label="Código SAP Artículo*"  size="small" InputProps={{endAdornment: <InputAdornment position="end"><SearchIcon/><IconButton onClick={()=>{AbrirCerrarModalSN}}></IconButton></InputAdornment>}} disabled/>     
                    <TextField id="outlined-helperText" label="Descripción Artículo*"  size="small" name="Descrip_Articulo" onChange={onChangeArticulosC} value={ArticulosC.Descrip_Articulo}/>  
                    <TextField id="outlined-select-currency" select label="¿Es Combustible?*" defaultValue="1" size="small" name="EsCombustible_Articulo" onChange={onChangeArticulosC}
                    style={{textAlign:'left'}}>
                        {EsCombustible.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                    </TextField>  
                    {/* <TextField id="outlined-select-currency" select label="Acceso de creación*" defaultValue="1" size="small" name="AccesoCreacion" onChange={onChangeArticulosC}>
                        {AcceCreacion.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                         <DatePicker label="Fecha Creación*" slotProps={{ textField: { size: 'small' } }} onChange={(newValue) =>setArticulosC({...ArticulosC,Fecha_Creacion:newValue as string})} />
                    </LocalizationProvider>    */}
                    <TextField id="outlined-helperText" label="Xpump Articulo*"  size="small" name="Xpump_Articulo" onChange={onChangeArticulosC} value={ArticulosC.Xpump_Articulo}/>                                            
                </div> 
            </Box>   
            <Box display="flex" justifyContent="center" alignItems="center" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}}>
                <div>
                    <Button variant="contained" color="success" style={{marginRight:'17px'}} onClick={CrearArticulos} startIcon={<SaveIcon />} className='Buttons'>Guardar</Button>
                    <Button type="submit" variant="contained" onClick={LimpiarArticulosC} color="warning" startIcon={<CleaningServicesIcon />} className='Buttons'>Limpiar</Button>
                </div>
            </Box>   
            <Box sx={{ m: 2 }}>
                <DataGrid rows={Articulos} columns={columnsAccesos} initialState={{pagination: {paginationModel: {pageSize: 5,},},}} pageSizeOptions={[5]} disableRowSelectionOnClick getRowId={(row) => row.Id_acceso}  sx={{boxShadow: 2,border: 1,"& .MuiDataGrid-cell:hover": {color: "primary.main"}}}/>
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