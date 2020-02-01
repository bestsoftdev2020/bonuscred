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
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { Icon } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import 'rc-datepicker/lib/style.css';
import { DatePickerInput } from 'rc-datepicker';
import * as Actions from 'app/store/actions';
import { CSVLink } from 'react-csv'
import jsPDF from "jspdf";
import "jspdf-autotable";
import 'moment/locale/pt.js'
import { API_URL } from '../constans';

let counter = 0;
function createData(cliente, documento, data_emissao, hora_emissao, valor_venda, valor_liquido) {
  counter += 1;
  return { id: counter, cliente, documento, data_emissao, hora_emissao, valor_venda, valor_liquido };
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
  { id: 'cliente', numeric: true, disablePadding: false, label: 'Cliente' },
  { id: 'documento', numeric: true, disablePadding: false, label: 'Documento' },
  { id: 'data_emissao', numeric: true, disablePadding: false, label: 'Data Emissao' },
  { id: 'hora_emissao', numeric: true, disablePadding: false, label: 'Hora Emissao' },
  { id: 'valor_venda', numeric: true, disablePadding: false, label: 'Valor Venda' },
  { id: 'valor_liquido', numeric: true, disablePadding: false, label: 'Valor Liquido' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
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
  onRequestSort: PropTypes.func.isRequired,
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
  xs6Styledate: {
    width: '160px',
  },
  exportButton: {
    height: '48px',
  },
  progressBar: {
    width: '32px !important',
    height: '32px !important',
    marginLeft: '16px',
    marginTop: '4px',
  }
});

let EnhancedTableToolbar = props => {
  const { classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: true,
      })}
    >
      <div className={classes.title}>
        <Typography variant="h6" id="tableTitle">
          Relatório de vendas
          </Typography>
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        <DatePickerInput
          onChange={(date) => {props.onStart(date);}}
          value={props.start}
          className={classNames(classes.xs6Styledate, 'my-custom-datepicker-component')}
        />
      </div>
      &nbsp;~&nbsp;
      <div className={classes.actions}>
        <DatePickerInput
          onChange={(date) => {props.onEnd(date);}}
          value={props.end}
          className={classNames(classes.xs6Styledate, 'my-custom-datepicker-component')}
        />
      </div>
      <div className={classes.actions}>
          {props.isLoading && (
            <CircularProgress color="secondary" className={classes.progressBar}/>
          )}
          {!props.isLoading && (
            <Tooltip title="Filtrar dados">
              <IconButton aria-label="Filter" onClick={props.onDataFilter}>
                <Icon className="text-30" color="action">filter_list</Icon>
              </IconButton>
            </Tooltip>
          )}
      </div>

      <div className={classes.spacer} />
      <div className={classes.actions}>
        <Tooltip title="Exportar para Excel">
          <IconButton aria-label="Excel" className={classes.exportButton}>
            <CSVLink data={props.mainData} filename={props.makeFileName()+'.xls'}><Icon className="text-30" color="action">table_chart</Icon></CSVLink>
          </IconButton>
        </Tooltip>
      </div>
      <div className={classes.actions}>
        <Tooltip title="Exportar para PDF">
          <IconButton aria-label="PDF" onClick={props.onExportPDF}>
            <Icon className="text-30" color="action">picture_as_pdf</Icon>
          </IconButton>
        </Tooltip>
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
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

class SalesReport extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    data: [],
    page: 0,
    rowsPerPage: 5,
    openDialog: false,
    startdate: new Date(),
    enddate: new Date(),
    isLoading: false,
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  componentWillMount = () => {
  }

  onDataFilter = async () => {
    var startTemp = this.state.startdate.getFullYear() + '-' + (this.state.startdate.getMonth() + 1) + '-' + this.state.startdate.getDate();
    var endTemp = this.state.enddate.getFullYear() + '-' + (this.state.enddate.getMonth() + 1) + '-' + this.state.enddate.getDate();
    this.setState({isLoading:true}) ;
    await fetch(API_URL + 'relatorios/vendas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': window.localStorage.getItem('jwt_access_token'),
      },
      body: JSON.stringify({
        data_inicial : startTemp,
        data_final : endTemp,
     })
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          this.props.dispatch(
            Actions.showMessage({
              message: json.error,//text or html
              autoHideDuration: 4000,//ms
              anchorOrigin: {
                vertical: 'top',//top bottom
                horizontal: 'center'//left center right
              },
              variant: 'error'//success error info warning null
            }))
        }
        else {
          json.forEach(element => {
            var temp = this.state.data;
            temp.push(createData(element['cliente'], element['documento'], element['data_emissao'], element['hora_emissao'], element['valor_venda'], element['valor_liquido']));
            this.setState({
              data: temp,
            });
          });
        }
      })
      .catch((error) => {
        this.props.dispatch(
          Actions.showMessage({
            message: error,//text or html
            autoHideDuration: 4000,//ms
            anchorOrigin: {
              vertical: 'top',//top bottom
              horizontal: 'center'//left center right
            },
            variant: 'error'//success error info warning null
          }))
      });

      this.setState({isLoading:false})
  }

  onChnageStart = (date) => {
    if(date !== 'Invalid date')
      this.setState({startdate:date})
  }

  onChangeEnd = (date) => {
    if(date !== 'Invalid date')
      this.setState({enddate:date})
  }

  onExportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Sales Report";
    var tempHeader = [];
    rows.map(item => tempHeader.push(item.label))
    const headers = [tempHeader] ;
    
    const data = this.state.data.map(item=> [item.cliente, item.documento, item.data_emissao, item.hora_emissao, item.valor_venda, item.valor_liquido]);
    let content = {
      startY: 50,
      head: headers,
      body: data
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save(this.makeFileName()+'.pdf')
  }

  makeFileName = () => {
    var startTemp = this.state.startdate.getFullYear() + '.' + (this.state.startdate.getMonth() + 1) + '.' + this.state.startdate.getDate();
    var endTemp = this.state.enddate.getFullYear() + '.' + (this.state.enddate.getMonth() + 1) + '.' + this.state.enddate.getDate();
    return startTemp+'__'+endTemp ;
  }

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar isLoading={this.state.isLoading} makeFileName={this.makeFileName} mainData={this.state.data} onDataFilter={this.onDataFilter} onExportXLS={this.onExportXLS} onExportPDF={this.onExportPDF} start={this.state.startdate} end={this.state.enddate} onStart={this.onChnageStart} onEnd={this.onChangeEnd} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={n.documento}
                    >
                      <TableCell align="left">{n.cliente}</TableCell>
                      <TableCell align="left">{n.documento}</TableCell>
                      <TableCell align="left">{n.data_emissao}</TableCell>
                      <TableCell align="left">{n.hora_emissao}</TableCell>
                      <TableCell align="left">{n.valor_venda}</TableCell>
                      <TableCell align="left">{n.valor_liquido}</TableCell>
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
      </Paper>
    );
  }
}

SalesReport.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    showMessage: Actions.showMessage
  }, dispatch);
}

export default withStyles(styles)(connect(mapDispatchToProps)(SalesReport));