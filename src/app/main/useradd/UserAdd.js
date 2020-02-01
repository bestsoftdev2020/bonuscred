import React, { Component } from 'react';
import { withStyles, Button, InputAdornment, Icon, MenuItem } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import classNames from 'classnames';
import { SelectFormsy, TextFieldFormsy } from '@fuse';
import Formsy from 'formsy-react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from 'app/store/actions';
import { API_URL } from '../constans';

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
        margin: '20px',
    },

    gridcontainerStyle: {
        placeContent: 'center',
    },

    dateFont: {
        fontSize: '13px',
        paddingLeft: '3px',
    },
});

class UserAdd extends Component {
    state = {
        actionType: '',
        canSubmit: false,
        user: '',
        name: '',
        password: '',
        status: '',
        permission: '',
        selectedid: '',
    };

    form = React.createRef();

    componentWillMount() {
        this.setState({ actionType: this.props.location.state.action });
        if (this.props.location.state.action === 'edit') {
            this.setState({ selectedid: this.props.location.state.id });
            fetch(API_URL + 'usuario/' + this.props.location.state.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': window.localStorage.getItem('jwt_access_token'),
                },
            })
                .then(response => response.json())
                .then(json => {
                    console.log(json);
                    this.setState({
                        selectedid: json['id'],
                        name: json['nome'],
                        user: json['usuario'],
                        status: json['status'],
                        permission: json['permissoes_acesso'],
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    disableButton = () => {
        this.setState({ canSubmit: false });
    };

    enableButton = () => {
        this.setState({ canSubmit: true });
    };

    UserAction = () => {
        if (this.state.actionType === 'edit') {
            fetch(API_URL + 'usuario/' + this.state.selectedid, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': window.localStorage.getItem('jwt_access_token'),
                },
                body: JSON.stringify({
                    nome: this.state.name,
                    usuario: this.state.user,
                    senha: this.state.password,
                    status: this.state.status,
                    permissoes_acesso: this.state.permission,
                })
            })
                .then(response => response.json())
                .then(json => {
                    if(json === "Atualizado") {
                        this.props.dispatch(
                            Actions.showMessage({
                                message     : 'O usuário foi atualizado com sucesso!',//text or html
                                autoHideDuration: 4000,//ms
                                anchorOrigin: {
                                    vertical  : 'top',//top bottom
                                    horizontal: 'center'//left center right
                                },
                                variant: 'success'//success error info warning null
                            }))
                        this.props.history.push('/userlist');
                    }
                    if(json.error) {
                        this.props.dispatch(
                            Actions.showMessage({
                                message     : json.error,//text or html
                                autoHideDuration: 4000,//ms
                                anchorOrigin: {
                                    vertical  : 'top',//top bottom
                                    horizontal: 'center'//left center right
                                },
                                variant: 'error'//success error info warning null
                            }))
                        this.props.history.push('/userlist');
                    }
                })
                .catch((error) => {
                    this.props.dispatch(
                        Actions.showMessage({
                            message     : error,//text or html
                            autoHideDuration: 4000,//ms
                            anchorOrigin: {
                                vertical  : 'top',//top bottom
                                horizontal: 'center'//left center right
                            },
                            variant: 'error'//success error info warning null
                        }))
                });
        }

        else {
            fetch(API_URL + 'usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': window.localStorage.getItem('jwt_access_token'),
                },
                body: JSON.stringify({
                    nome: this.state.name,
                    usuario: this.state.user,
                    senha: this.state.password,
                    status: this.state.status,
                    permissoes_acesso: this.state.permission,
                })
            })
                .then(response => response.json())
                .then(json => {
                    if(json.message === "Registro criado") {
                        this.props.dispatch(
                            Actions.showMessage({
                                message     : 'Um usuário foi adicionado com sucesso!',//text or html
                                autoHideDuration: 4000,//ms
                                anchorOrigin: {
                                    vertical  : 'top',//top bottom
                                    horizontal: 'center'//left center right
                                },
                                variant: 'success'//success error info warning null
                        }))
                        this.props.history.push('/userlist');
                    }
                    if(json === "Usuário já existe para esta empresa"){
                        this.props.dispatch(
                            Actions.showMessage({
                                message     : 'Usuário já existe para esta empresa!',//text or html
                                autoHideDuration: 4000,//ms
                                anchorOrigin: {
                                    vertical  : 'top',//top bottom
                                    horizontal: 'center'//left center right
                                },
                                variant: 'warning'//success error info warning null
                        }))
                    }
                    if(json.error) {
                        this.props.dispatch(
                            Actions.showMessage({
                                message     : json.error,//text or html
                                autoHideDuration: 4000,//ms
                                anchorOrigin: {
                                    vertical  : 'top',//top bottom
                                    horizontal: 'center'//left center right
                                },
                                variant: 'error'//success error info warning null
                        }))
                    }
                })
                .catch((error) => {
                    this.props.dispatch(
                        Actions.showMessage({
                            message     : error,//text or html
                            autoHideDuration: 4000,//ms
                            anchorOrigin: {
                                vertical  : 'top',//top bottom
                                horizontal: 'center'//left center right
                            },
                            variant: 'error'//success error info warning null
                    }))
                });
        }
    }

    handleClose = () => {

    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.divStyle}>
                <Grid container item xs={9} className={classes.gridcontainerStyle}>
                    <Typography variant="h4" color="inherit" className={classNames(classes.h4Style, "font-light")}>
                        {this.state.actionType === 'add' ? 'Adicionar usuário' : 'Editar usuário'}
                    </Typography>
                    <div className="w-full">
                        <Formsy
                            onValidSubmit={this.onSubmit}
                            onValid={this.enableButton}
                            onInvalid={this.disableButton}
                            ref={(form) => this.form = form}
                            className="flex flex-wrap justify-center w-full"
                        >
                            <Grid item xs={6}>
                                <TextFieldFormsy
                                    className={classNames(classes.xs6Style, "mb-16")}
                                    type="text"
                                    name="Name"
                                    label="Nome"
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

                            <Grid item xs={6}>
                                <TextFieldFormsy
                                    className={classNames(classes.xs6Style, "mb-16")}
                                    type="text"
                                    name="User"
                                    label="Usuario"
                                    value={this.state.user}
                                    onChange={(event) => { this.setState({ user: event.target.value }); }}
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

                            <Grid item xs={6}>
                                <TextFieldFormsy
                                    className={classNames(classes.xs12Style, "mb-16")}
                                    type="password"
                                    name="password"
                                    label="Senha"
                                    value={this.state.password}
                                    onChange={(event) => { this.setState({ password: event.target.value }); }}
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

                            <Grid item xs={3}>
                                <SelectFormsy
                                    className={classNames(classes.xs12Style, "mb-16")}
                                    name="status"
                                    label="Status"
                                    value={this.state.status}
                                    onChange={(event) => { this.setState({ status: event.target.value }); }}
                                    validationError="Must not be None"
                                    variant="outlined"
                                    required
                                >
                                    <MenuItem value="1">Active</MenuItem>
                                    <MenuItem value="0">Deactive</MenuItem>
                                </SelectFormsy>
                            </Grid>

                            <Grid item xs={3}>
                                <SelectFormsy
                                    className={classNames(classes.xs12Style, "mb-16")}
                                    name="permission"
                                    label="Permissoes"
                                    value={this.state.permission}
                                    onChange={(event) => { this.setState({ permission: event.target.value }); }}
                                    validations={{
                                        minLength: 1
                                    }}
                                    validationError="Must not be None"
                                    variant="outlined"
                                    required
                                >
                                    <MenuItem value="admin">Admin</MenuItem>
                                    <MenuItem value="user">User</MenuItem>
                                </SelectFormsy>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className="w-full mx-auto mt-16 normal-case"
                                    aria-label="add"
                                    disabled={!this.state.canSubmit}
                                    value="legacy"
                                    onClick={this.UserAction}
                                >
                                    {this.state.actionType === 'add' ? 'Adicionar usuário' : 'Editar usuário'}
                                </Button>
                            </Grid>
                        </Formsy>
                    </div>
                </Grid>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        showMessage: Actions.showMessage
    }, dispatch);
}

export default withStyles(styles, { withTheme: true })(connect(mapDispatchToProps)(UserAdd));
