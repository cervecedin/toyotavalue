import * as React from 'react'
import { useRouter } from 'next/router'
import { Avatar, Button, CssBaseline, TextField, Box, Container, createTheme, ThemeProvider, Snackbar} from '@mui/material';
import Axios from 'axios';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Image from 'next/image'
import logo from '../../../public/logo.png'
import { indigo } from '@mui/material/colors';
import Home from '../index';

const theme = createTheme();
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function SignIn(){
  const router = useRouter()
  
  const [Correo_acceso, setCorre_acceso] = React.useState('');
  const [Contrasena_acceso, setContrasena_acceso] = React.useState('');

    /*SnackBar Alertas Material ui*/
    const [OpenSnackBar, setOpenSnackBar] = React.useState(false);
    const [PropSnackbar, setSnackbar] = React.useState({
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
    

  const IniciarSesion = (event:any) => {
    event.preventDefault();
    /*const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });*/
    if (!Correo_acceso || !Contrasena_acceso) {
      setSnackbar({ Color: 'error', Mensaje: 'Complete Los Datos' });
      setOpenSnackBar(true);
    }
    else {
      Axios.post('http://192.168.25.167:4000/api/singin', {
        Correo_acceso: Correo_acceso,
        Contrasena_acceso: Contrasena_acceso
      }).then((response) => {
        if (response.data === "Correo No Registrado") {
          setSnackbar({ Color: 'error', Mensaje: 'Correo No Registrado' });
          setOpenSnackBar(true);
        }
        else if (response.data === "Acceso Deshabilitado") {
          setSnackbar({ Color: 'warning', Mensaje: 'Acceso Deshabilitado' });
          setOpenSnackBar(true);
        }
        else if (response.data === "Contraseña Incorrecta") {
          setSnackbar({ Color: 'error', Mensaje: 'Contraseña Incorrecta' });
          setOpenSnackBar(true);
        }
        else {Axios.post('https://192.168.1.244:50000/b1s/v2/Login', {
                CompanyDB: "SBO_CORASUR",
                UserName: "manager",
                Password: "prod123"
              }, {withCredentials: true}).then((response2) => {                
                localStorage.setItem("IdServiceLayer", response2.data.SessionId);
                console.log(response2.data);
                router.push("/SubModulo");
              });  
              
              localStorage.setItem("Acceso", response.data.Id_acceso);
              localStorage.setItem("Colaborador", response.data.Id_fk_colaborador);
              localStorage.setItem("Privilegio", response.data.Id_fk_privilegio);
              localStorage.setItem("Token", response.data.Generatetoken);
              router.push("/Modulos");
        }

      });
    }
  };


  return(
    <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: indigo[700] }} style={{backgroundColor:'#af191b'}}>            
        </Avatar>
        <Image src={logo} alt='logo'/>
        <Box component="form" onSubmit={IniciarSesion} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Addres"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => {
              setCorre_acceso(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => {
              setContrasena_acceso(e.target.value);
            }}
          />           
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{backgroundColor:'#af191b'}}
          >
            Ingresar
          </Button>        
        </Box>
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

    </Container>
  </ThemeProvider>
  )
}