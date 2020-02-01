import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles, Button, InputAdornment, Icon } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import classNames from 'classnames';
import { TextFieldFormsy } from '@fuse';
import Formsy from 'formsy-react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { API_URL } from '../../../src/app/main/constans';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import DateTimePicker from 'react-datetime-picker';
import {Map,Marker,GoogleApiWrapper} from 'google-maps-react';

const BootstrapInput = withStyles(theme => ({
    root: {
        'label + &': {
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

const styles = theme => ({
    root: {
        background: 'radial-gradient(' + darken(theme.palette.primary.dark, 0.5) + ' 0%, ' + theme.palette.primary.dark + ' 80%)',
        color: theme.palette.primary.contrastText
    },

    card: {
        maxWidth: 345,
        marginRight: 50,
        minWidth: 400,
        minHeight: 600,
    },

    chip: {
        margin: theme.spacing.unit,
    },

    xs6Style: {
        width: '100%',
        paddingRight: 10,
        paddingBottom: 0,
    },

    xs6Styledate: {
        width: '100%',
        paddingRight: 10,
        paddingBottom: 15,
    },

    xs12Style: {
        width: '100%',
        paddingRight: 10,
    },

    buttonStyle: {
        backgroundColor: '#dd2c00',
    },

    divStyle: {
        marginTop: 30,
        marginLeft: '20%',
        flexGrow: 1,
    },

    h4Style: {
        marginLeft: '20px',
        marginRight: '20px',
        marginBottom: '20px',
    },

    gridcontainerStyle: {
        placeContent: 'center',
    },

    dateFont: {
        fontSize: '13px',
        paddingLeft: '3px',
    },

    inputLabelStyle: {
        fontSize: '13px',
        paddingLeft: '3px',
    },

    comboStyle: {
        alignSelf: 'center',
    },

    checkStyle: {
        paddingLeft: '80px',
        paddingTop: '10px',
    },

    googleMapStyle: {
        height: '300px',
    },

    searchInput: {
        width: '100%',
    },

    locationSearch: {
        border: '1px solid',
        borderColor: 'darkgray',
        borderRadius: '5px',
        fontSize: '20px',
        paddingLeft: '3px',
        marginTop: '15px',
        marginBottom: '15px',
    },

    mapStyle: {
        position : 'relative !important',
    },
});

class BookContent extends Component {

    static defaultProps = {
        center: { lat: -34.603722, lng: -58.381592 },
        zoom: 10
    }

    state = {
        canSubmit: false,
        date: new Date(),
        name: '',
        startcity : '',
        startaddress: '',
        phone: '',
        email: '',
        notes: '',
        passnum: 1,
        istravelnow: false,
        endcity: '',
        endaddress: '',
        startcenter: { lat: -34.603722, lng: -58.381592 },
        endcenter: { lat: -34.603722, lng: -58.381592 },
    };

    form = React.createRef();

    disableButton = () => {
        this.setState({ canSubmit: false });
    };

    enableButton = () => {
        this.setState({ canSubmit: true });
    };

    BookNow = () => {
        var tempdate = this.state.date.getFullYear() + '-' + (this.state.date.getMonth()+1) + '-' + this.state.date.getDate() +' '+ this.state.date.getHours()+':'+ this.state.date.getMinutes()+':'+ this.state.date.getSeconds();
        fetch(API_URL + 'addbook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                passenger_num : this.state.passnum,
                name : this.state.name,
                location : this.state.startaddress,
                destination : this.state.endaddress,
                book_time : tempdate,
                message : this.state.notes,
            })
        })
        .then(response => response.json())
        .then(json => {
            if (json.success) {
                alert("Successfully Added!");
                this.props.history.push('/') ;
            }
            else {
                alert("Operation failed!");
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    TravelCheck = (event) => {
        this.setState({ istravelnow: !this.state.istravelnow, date: new Date() });
    }

    handlePlaceSelect = () =>{
        const addressObject = this.startSearch.getPlace();
        const address = addressObject.address_components;

        // Check if address is valid
        if (address) {
            this.setState(
                {
                    startcity: address[0].long_name,
                    startaddress: addressObject.formatted_address,
                    startcenter : {
                        lat : addressObject.geometry.location.lat(),
                        lng : addressObject.geometry.location.lng(),
                    },
                }
            );
        }
    }

    handlePlaceSelect1 = () =>{
        const addressObject = this.endSearch.getPlace();
        const address = addressObject.address_components;

        // Check if address is valid
        if (address) {
            this.setState(
                {
                    endcity: address[0].long_name,
                    endaddress: addressObject.formatted_address,
                    endcenter : {
                        lat : addressObject.geometry.location.lat(),
                        lng : addressObject.geometry.location.lng(),
                    },
                }
            );
        }
    }

    componentDidMount() {
        /*global google*/
        this.startSearch = new google.maps.places.Autocomplete(document.getElementById('startSearch'));
        this.startSearch.setFields(['address_components','formatted_address','geometry']);
        this.startSearch.addListener('place_changed',this.handlePlaceSelect); 

        this.endSearch = new google.maps.places.Autocomplete(document.getElementById('endSearch'));
        this.endSearch.setFields(['address_components','formatted_address','geometry']);
        this.endSearch.addListener('place_changed',this.handlePlaceSelect1); 
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.divStyle}>
                <Grid container item xs={9} className={classes.gridcontainerStyle}>
                    <Typography variant="h4" color="inherit" className={classNames(classes.h4Style, "font-light")}>
                        Nuevo viaje
                    </Typography>
                    <div className="w-full">
                        <Formsy
                            onValidSubmit={this.onSubmit}
                            onValid={this.enableButton}
                            onInvalid={this.disableButton}
                            ref={(form) => this.form = form}
                            className={classNames("flex flex-wrap justify-center w-full")}
                        >
                            <Grid item xs={3} className={classes.comboStyle}>
                                <FormControl className={classNames(classes.xs6Style)}>
                                    <InputLabel htmlFor="demo-customized-select-native" className={classes.inputLabelStyle}>Pasajeros</InputLabel>
                                    <NativeSelect
                                        id="demo-customized-select-native"
                                        value={this.state.passnum}
                                        onChange={(event) => { this.setState({ passnum: event.target.value }); }}
                                        input={<BootstrapInput />}
                                    >
                                        <option value={1}>1 Pasajeros</option>
                                        <option value={2}>2 Pasajeros</option>
                                        <option value={3}>3 Pasajeros</option>
                                        <option value={4}>4 Pasajeros</option>
                                    </NativeSelect>
                                </FormControl>
                            </Grid>

                            <Grid item xs={3} className={classes.checkStyle}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={this.state.istravelnow} onChange={this.TravelCheck} value="0" />
                                    }
                                    label="En viaje?"
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <Typography variant="h6" color="inherit" className={classNames(classes.dateFont, "font-light")}>
                                    Fecha y hora
                                </Typography>
                                <DateTimePicker
                                    onChange={(date) => { this.setState({ date: date }); }}
                                    value={this.state.date}
                                    disabled={this.state.istravelnow}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextFieldFormsy
                                    className={classNames(classes.xs6Style, "mb-16")}
                                    type="text"
                                    name="name"
                                    label="Nombre"
                                    value={this.state.name}
                                    onChange={(event) => { this.setState({ name: event.target.value }); }}
                                    validations={{
                                        minLength: 4
                                    }}
                                    validationErrors={{
                                        minLength: 'Min character length is 4'
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">person</Icon></InputAdornment>
                                    }}
                                    variant="outlined"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextFieldFormsy
                                    className={classNames(classes.xs12Style, "mb-16")}
                                    type="text"
                                    name="email"
                                    label="Email"
                                    value={this.state.email}
                                    onChange={(event) => { this.setState({ email: event.target.value }); }}
                                    validations={{
                                        minLength: 4
                                    }}
                                    validationErrors={{
                                        minLength: 'Min character length is 4'
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">email</Icon></InputAdornment>
                                    }}
                                    variant="outlined"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextFieldFormsy
                                    className={classNames(classes.xs12Style, "mb-16")}
                                    type="text"
                                    name="phone"
                                    label="Teléfono"
                                    value={this.state.phone}
                                    onChange={(event) => { this.setState({ phone: event.target.value }); }}
                                    validations={{
                                        minLength: 4
                                    }}
                                    validationErrors={{
                                        minLength: 'Min character length is 4'
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">phone</Icon></InputAdornment>
                                    }}
                                    variant="outlined"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} className={classes.googleMapStyle}>
                                <Map
                                    google={this.props.google}
                                    className={classes.mapStyle}
                                    center={{ lat: this.state.startcenter.lat, lng: this.state.startcenter.lng}}
                                    zoom={11}
                                >
                                    <Marker position={{ lat: this.state.startcenter.lat, lng: this.state.startcenter.lng}} />
                                </Map>
                            </Grid>

                            <Grid item xs={12} className={classes.locationSearch}>
                                <input id="startSearch" placeholder="Ingrese su dirección" type="text" className={classes.searchInput} ></input>
                            </Grid>

                            <Grid item xs={12}>
                                <TextFieldFormsy
                                    className={classNames(classes.xs6Style, "mb-16")}
                                    type="text"
                                    name="startcity"
                                    label="Ciudad"
                                    value={this.state.startcity}
                                    disabled
                                    validations={{
                                        minLength: 4
                                    }}
                                    validationErrors={{
                                        minLength: 'Min character length is 4'
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">location_city</Icon></InputAdornment>
                                    }}
                                    variant="outlined"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextFieldFormsy
                                    className={classNames(classes.xs6Style, "mb-16")}
                                    type="text"
                                    name="startaddress"
                                    label="Dirección"
                                    value={this.state.startaddress}
                                    disabled
                                    validations={{
                                        minLength: 4
                                    }}
                                    validationErrors={{
                                        minLength: 'Min character length is 4'
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">location_on</Icon></InputAdornment>
                                    }}
                                    variant="outlined"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} className={classes.googleMapStyle}>
                                <Map
                                    google={this.props.google}
                                    className={classes.mapStyle}
                                    center={{ lat: this.state.endcenter.lat, lng: this.state.endcenter.lng}}
                                    zoom={11}
                                >
                                    <Marker position={{ lat: this.state.endcenter.lat, lng: this.state.endcenter.lng}} />
                                </Map>
                            </Grid>

                            <Grid item xs={12} className={classes.locationSearch}>
                                <input id="endSearch" placeholder="Ingrese su dirección" type="text" className={classes.searchInput} ></input>
                            </Grid>

                            <Grid item xs={12}>
                                <TextFieldFormsy
                                    className={classNames(classes.xs6Style, "mb-16")}
                                    type="text"
                                    name="endcity"
                                    label="Ciudad"
                                    value={this.state.endcity}
                                    disabled
                                    validations={{
                                        minLength: 4
                                    }}
                                    validationErrors={{
                                        minLength: 'Min character length is 4'
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">location_city</Icon></InputAdornment>
                                    }}
                                    variant="outlined"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextFieldFormsy
                                    className={classNames(classes.xs6Style, "mb-16")}
                                    type="text"
                                    name="endaddress"
                                    label="Dirección"
                                    value={this.state.endaddress}
                                    disabled
                                    validations={{
                                        minLength: 4
                                    }}
                                    validationErrors={{
                                        minLength: 'Min character length is 4'
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">location_on</Icon></InputAdornment>
                                    }}
                                    variant="outlined"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextFieldFormsy
                                    className={classNames(classes.xs6Style, "mb-16")}
                                    type="text"
                                    name="notes"
                                    label="Mensaje"
                                    value={this.state.notes}
                                    onChange={(event) => {this.setState({notes:event.target.value});}}
                                    validations={{
                                        minLength: 4
                                    }}
                                    multiline
                                    validationErrors={{
                                        minLength: 'Min character length is 4'
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">message</Icon></InputAdornment>
                                    }}
                                    variant="outlined"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className={classNames("w-full mx-auto mt-16 normal-case")}
                                    aria-label="booknow"
                                    value="legacy"
                                    disabled={!this.state.canSubmit}
                                    onClick={this.BookNow}
                                >
                                    Reservar
                                </Button>
                            </Grid>

                        </Formsy>
                    </div>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(withRouter (GoogleApiWrapper({
    apiKey: 'AIzaSyCj8yfTtePpTRFmtGJqWTADsXpS_AWZQEA',
  })(BookContent)));
