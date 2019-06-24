let QUERY_TABLE = null;

const CLEAR_DB_SQL = 'truncate mysql.slow_log';
const SETUP_DB_SQL = "SET global log_output = 'table'; SET global slow_query_log = 1; SET global long_query_time = 0; SET global min_examined_row_limit = 0; SET global log_queries_not_using_indexes = 1;";
const FETCH_LOG_QUERY = "SELECT * FROM mysql.slow_log where db !='' and db !='mysql' and db NOT LIKE '%ApplicationName=DataGrip%'; TRUNCATE mysql.slow_log;";
// const FETCH_LOG_QUERY = "SELECT * FROM mysql.slow_log where db !='' and db !='mysql';";

(function ($) {
  "use strict";
  /* List.js is required to make this table work. */
  const List = require('list.js');
  const options = {
    valueNames: ['start_time', 'query_time', 'db', 'sql_text'],
    item: '<tr><td class="column1 start_time"></td><td class="column2 query_time"></td> <td class="column3 db"></td> <td class="column4 sql_text"></td></tr>'
  };

  QUERY_TABLE = new List('queryTableID', options);

  $('#query-search-input').on('input', function () {
    const searchString = $('#query-search-input input').val();
    QUERY_TABLE.search(searchString);
  });
})(jQuery);


function startQueryLog() {
  CON.query(SETUP_DB_SQL, function (error) {
    if (error) {
      handleError(error);
    } else {
      fetchLogs();
    }
  });
}

function fetchLogs() {
  CON.query(FETCH_LOG_QUERY, function (error, results, fields) {
    if (error) {
      handleError(error);
    } else {
      const result = results[0];

      QUERY_TABLE.add(result.map(({ start_time, query_time, db, sql_text }) => ({
        start_time: moment(start_time).format('HH:mm:ss'),
        query_time: `${moment.duration(query_time).asSeconds()}s`,
        db,
        sql_text: highlighter.highlight(sql_text)
      })));

      setTimeout(fetchLogs, 2000)
    }
  });
}

function handleError(error) {
  $('#lds-facebook').hide();
  alert(error)
}