import React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';
import {ContactFooter} from '@fuse';
import {Link} from 'react-router-dom';

const divStyle = {
    placeContent: 'center',
    display: 'flex',
};

const h4Style = {
    margin : '20px',
};

const h6Style = {
    fontSize : '14px',
    marginBottom : "10px",
};

const buttonStyle = {
    width : '50%',
    margin : 30,
};

const dividerStyle = {
    marginLeft : '30%',
    marginRight : '30%',
    height : 2,
    marginBottom : 50,
    marginTop : 20,
};

const listStyle = {
    textAlignLast: 'left',
    marginLeft: '40%',
}

const styles = theme => ({
    grid: {
        padding : 20,
    },
    card: {
        maxWidth: 345,
        marginLeft : 50,
        marginBottom : 50,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    margin: {
        margin: theme.spacing.unit,
    },
});

const DemoContent = ({classes}) => {
    return (
        <div className="text-center">
            <Typography variant="h4" color="inherit" className="font-light" style={h4Style}>
                ¡Dónde Usted nos necesita las 24 hs del día!
            </Typography>

            <Typography variant="h6" color="inherit" className="font-light" style={h6Style}>
                Eventos Sociales, Mensajería, Viajes Empresariales y de Larga Distancia
            </Typography>
            
            <div style={divStyle}>
                <Card className={classes.card}>
                    <CardMedia className={classes.media}
                        image={'assets/images/1.png'}
                        title="Paella dish"
                    />
                    <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Somos Remisería UADE, una empresa dedicada a brindar servicio de Translado profesional a todo el país .
                    </Typography>
                    </CardContent>
                </Card>
                <Card className={classes.card}>
                    <CardMedia className={classes.media}
                        image={'assets/images/2.png'}
                        title="Paella dish"
                    />
                    <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Contamos con más de 90 vehículos nuevos y en excelentes condiciones para garantizarle un viaje confortable, seguro y climatizado.
                    </Typography>
                    </CardContent>
                </Card>
                <Card className={classes.card}>
                    <CardMedia className={classes.media}
                        image={'assets/images/3.png'}
                        title="Paella dish"
                    />
                    <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Nuestros autos cuentan con seguimiento satelital. Lo que permite brindar un servicio eficaz, serio y confiable.
                    </Typography>
                    </CardContent>
                </Card>
            </div>

            <h1 className="py-16">Viajá mejor</h1>
            
            <Link className="mr-8 normal-case" variant="contained" color="secondary" aria-label="Follow" to="/booktrip"> 
            <Button variant="contained" color="secondary" className={classes.button} style={buttonStyle}>
                Nuevo viaje
            </Button></Link>

            <Divider variant="middle" style={dividerStyle}/>

            <Typography variant="h4" color="inherit" className="font-light" style={h4Style}>
                ¡En solo 3 simples pasos!
            </Typography>        
            
            <div style={listStyle}>
                <h2>
                <Fab size="medium" color="secondary" aria-label="Add" className={classes.margin}>
                    <AddIcon />
                </Fab>
                Paso 1: Introduzca sus datos</h2>

                <h2>
                <Fab size="medium" color="secondary" aria-label="Add" className={classes.margin}>
                    <AddIcon />
                </Fab>
                Paso 2: Introduzca su ubicación</h2>

                <h2>
                <Fab size="medium" color="secondary" aria-label="Add" className={classes.margin}>
                    <AddIcon />
                </Fab>
                Paso 3: Introduzca su destino</h2>
            </div>

            <Divider variant="middle" style={dividerStyle}/>

            <ContactFooter />
        </div>
    );
};

export default withStyles(styles, {withTheme: true})(DemoContent);
