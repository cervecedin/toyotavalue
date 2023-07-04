import * as React from 'react';
import Axios from 'axios';
import { styled, useTheme } from '@mui/material/styles';
import {Box,Drawer,CssBaseline,Toolbar,List,Typography,Divider,IconButton,ListItem,Icon,ListItemIcon,ListItemText} from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Link from 'next/link'

const drawerWidth = 240;

interface Props{
    children: React.ReactNode | React.ReactNode[];
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function SideNavBar({children} : Props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  /*Estado para mostrar submodulos de un provilegio*/
  const [Submodulos, setSubmodulos] = React.useState<any[]>([]);

    /*Funcion para mostrar modulos en base a privilegio del localstorage*/
    const LeerSubmodulo = async () => {
      await Axios.post('http://192.168.25.141:4000/api/rprivilegios', {
        Fk_Id_Privilegio: parseInt(localStorage.getItem("Privilegio")!)
      }, {
        headers: {
          'Token': localStorage.getItem("Token"),
        }
      }).then((response) => {
        setSubmodulos(response.data)
        /*console.log(response.data);*/
      });
    }
     /*Hook para mostar Submodulos al cargar la pagina*/
    React.useEffect(() => {
      LeerSubmodulo();
    }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} style={{backgroundColor:'#af191b'}}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            CORASUR - Toyota VALUE
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          }
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {Submodulos.map(submodulo => (
            <Link href={`/${encodeURIComponent(submodulo.Titulo_modulo)}/${encodeURIComponent(submodulo.Titulo_submodulo)}`}  key={submodulo.Id_submodulo} className='my-link'>
              <ListItem key={submodulo.Id_submodulo} title={submodulo.Titulo_submodulo}>
                <ListItemIcon><Icon color="info">{submodulo.Icono_submodulo}</Icon></ListItemIcon>
                <ListItemText primary={submodulo.Descripcion_submodulo} />              
              </ListItem>
            </Link>
          ))}
        </List>  
      </Drawer>
      <Main open={open}>
      <DrawerHeader />
        {/*Cargamos Vista de Modulos como prop*/}
        {children}    
      </Main>
    </Box>
  );
}