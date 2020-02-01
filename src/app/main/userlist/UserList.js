import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';  
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import {Icon} from '@material-ui/core';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as Actions from 'app/store/actions';
import {API_URL} from '../constans' ;       

let counter = 0;
function createData(idd, name, user, status, permission) {
  counter += 1;
  status = (status ? 'Ativo' : 'Desativado') ;
  return { id: counter, idd, name, user, status, permission };
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'idd', numeric: false, disablePadding: true, label: 'Eu iria' },
  { id: 'name', numeric: true, disablePadding: false, label: 'Nome' },
  { id: 'user', numeric: true, disablePadding: false, label: 'Usuario' },
  { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
  { id: 'permission', numeric: true, disablePadding: false, label: 'Permissão' },
  { id: 'action', numeric: true, disablePadding: false, label: 'Açao' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                align={row.numeric ? 'left' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selecionado
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Lista de usuários
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete" onClick={props.onDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Adicionar usuário">
            <IconButton aria-label="+" onClick={props.onNewuser}>
              <Icon className="text-30" color="action">add</Icon>
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar> 
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class UserList extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: 5,
    openDialog: false,
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  newUser = () => {
    this.props.history.push({
      pathname: '/useradd',
      state: { action: 'add' }
    })
  }

  onConfirmDelete = () => {
    this.setState({openDialog:false})
    var flag = 1 ;
    this.state.selected.map(id => {  
      fetch(API_URL+'usuario/'+id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization' : window.localStorage.getItem('jwt_access_token'),
        },
      })
      .then(response => response.json())
      .then(json => {
          if(json !== 'Deletado'){
            flag = 0 ;
          }
          else {
            var tempArray = this.state.data ;
            this.state.data.map((item,index) => {
              if(item.idd === id)
                tempArray.splice(index) ;
              return true ;
            })

            this.setState({data:tempArray}) ;
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
      return true ;
    });
    if(flag) {
      this.props.dispatch(
        Actions.showMessage({
            message     : "Os usuários foram excluídos com sucesso!",//text or html
            autoHideDuration: 4000,//ms
            anchorOrigin: {
                vertical  : 'top',//top bottom
                horizontal: 'center'//left center right
            },
            variant: 'success'//success error info warning null
      }))

      this.setState({selected:[]})
    }
    else {
      this.props.dispatch(
        Actions.showMessage({
            message     : "Os usuários não são excluídos com sucesso!",//text or html
            autoHideDuration: 4000,//ms
            anchorOrigin: {
                vertical  : 'top',//top bottom
                horizontal: 'center'//left center right
            },
            variant: 'error'//success error info warning null
      }))
    }
  }

  onDelete = () => {
    this.setState({openDialog:true})
  }

  editUser = (idd) => {
    this.props.history.push({
      pathname: '/useradd',
      state: { 
        action: 'edit',
        id : idd,
      }
    })
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  componentWillMount = () => {
    fetch(API_URL+'usuarios?page=0&pageSize=1000', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization' : window.localStorage.getItem('jwt_access_token'),
        },
    })
    .then(response => response.json())
    .then(json => {
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
        else {
          json.forEach(element => {
              var temp = this.state.data ;
              temp.push(createData(element['id'],element['nome'],element['usuario'],element['status'],element['permissoes_acesso'])) ;
              this.setState({
                  data : temp,
              });  
          });
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

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length} onNewuser={this.newUser} onDelete={this.onDelete}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.idd);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.idd)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.idd}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.idd}
                      </TableCell>
                      <TableCell align="left">{n.name}</TableCell>
                      <TableCell align="left">{n.user}</TableCell>
                      <TableCell align="left">{n.status}</TableCell>
                      <TableCell align="left">{n.permission}</TableCell>
                      <TableCell align="left"><Icon className="text-20" color="action" onClick={()=>{this.editUser(n.idd)}}>edit</Icon></TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />

        <Dialog
          open={this.state.openDialog}
          onClose={() => this.setState({openDialog:false})}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Deseja realmente excluir esses usuários?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({openDialog:false})} color="primary">
              Disagree
            </Button>
            <Button onClick={this.onConfirmDelete} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

UserList.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        showMessage: Actions.showMessage
    }, dispatch);
}

export default withStyles(styles)(connect(mapDispatchToProps)(UserList));