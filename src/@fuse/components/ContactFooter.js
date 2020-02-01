import React from 'react';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';

const contactStyle = {
    fontSize : '13px',
};


const ContactFooter = () => {
    return (
        <div className="text-center">
            <Typography variant="h6" color="inherit" className="font-light" style={contactStyle}>
                <b>Dirección</b> : José Hernandez 1024, Buenos Aires, Argentina
            </Typography>
            <Typography variant="h6" color="inherit" className="font-light" style={contactStyle}>
                <b>Teléfono</b> : (011) 4298-4912
            </Typography>
            <Typography variant="h6" color="inherit" className="font-light" style={contactStyle}>
                <b>Horario de Atención</b> : Todos los días, 24hs
            </Typography>
            <Link className="normal-case" variant="contained" color="primary" aria-label="Send Message" to="/contact" style={contactStyle}>Contáctanos</Link>
        </div>
    );
};

export default ContactFooter;
