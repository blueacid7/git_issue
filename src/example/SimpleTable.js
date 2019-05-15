import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
});

function SimpleTable(props) {
  const { classes, issues } = props;

  return (
    <Paper className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell >Total Issues</TableCell>
            <TableCell align="right">In 24 Hrs</TableCell>
            <TableCell align="right">In 7 Days</TableCell>
            <TableCell align="right">After 7 Days</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={1}>
            <TableCell>{issues.totalIssues}</TableCell>
            <TableCell align="right">{issues.noOfIssueIn24Hrs}</TableCell>
            <TableCell align="right">{issues.noOfIssueIn7Days}</TableCell>
            <TableCell align="right">{issues.noOfIssueAfter7Days}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);