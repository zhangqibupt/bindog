const mysql = require('mysql');
let CON = null;
const ZongJi = require('@rodrigogs/zongji');
const { shell } = require('electron');
const COLUMNS = ['Column Name', 'Value'];
let TABLE = null;
let ZONG_JI = null;

(function ($) {
  "use strict";
  /* List.js is required to make this table work. */
  const List = require('list.js');

  const options = {
    valueNames: ['timestamp', 'operation_type', 'db_name', 'table_name', 'summary', 'detail'],
    item: '<tr><td class="column1 timestamp"></td><td class="column2 operation_type"></td> <td class="column3 db_name"></td> <td class="column4 table_name"></td><td class="column5"><div><div class="summary"></div><div class="detail"></div></div></td>'
  };

  TABLE = new List('tableID', options);

  $('#search-input').on('input', function () {
    const searchString = $('#search-input input').val();
    const searchType = $("label.btn.btn-secondary.active input").val();
    TABLE.search(searchString, searchType && [searchType]);
  });

  $("label.btn.btn-secondary").on('mouseup', function () {
    const searchString = $('#search-input input').val();
    const searchType = $(this).find('input').val();
    TABLE.search(searchString, searchType && [searchType]);
  });

  $(".table-list tbody.list").on('click', 'tr', function (e) {
    $(e.target).closest("tr").find('div.detail').toggle();
  });
})(jQuery);

function clickStart() {
  $('#start').prop('disabled', true);
  startListen();
  setTimeout(function () {
    $('#start').prop('disabled', false);
  }, 1000)
}

function getDBInfo() {
  return {
    host: $("#host").val() || '127.0.0.1',
    port: $("#port").val() || 3306,
    user: $("#username").val() || 'root',
    password: $("#password").val() || 'root'
  }
}

function startListen() {
  $('#lds-facebook').hide();
  if (ZONG_JI !== null) {
    ZONG_JI.stop();
  }

  ZONG_JI = new ZongJi(getDBInfo());
  mysql.createConnection(getDBInfo());

  ZONG_JI.on('binlog', function (evt) {
    handleEvt(evt)
  });

  ZONG_JI.on('error', function (error) {
    if (error.code !== 'ETIMEDOUT') {
      alert(error);
      $('#lds-facebook').hide();
    }
  });

  ZONG_JI.start({
    startAtEnd: true,
    includeEvents: ['tablemap', 'writerows', 'updaterows', 'deleterows', 'rotate'],
    // excludeEvents: ['rotate'],
    includeSchema: { 'mysql': true, 'fwmrm_oltp': true }
  });

  CON = mysql.createConnection({
    ...getDBInfo(),
    multipleStatements: true
  });

  startQueryLog();

  $('#lds-facebook').show();
}

const TYPE = {
  DELETE_ROWS: 'DeleteRows',
  WRITE_ROWS: 'WriteRows',
  UPDATE_ROWS: 'UpdateRows'
};

function handleEvt(evt) {
  switch (evt.getTypeName()) {
    case TYPE.DELETE_ROWS:
      handleDelete(evt);
      refreshSummary();
      break;
    case TYPE.WRITE_ROWS:
      handleInsert(evt);
      refreshSummary();
      break;
    case TYPE.UPDATE_ROWS:
      handleUpdate(evt);
      refreshSummary();
      break;
  }
}

function handleDelete(evt) {
  const item = getDefaultItem(evt);
  item.operation_type = 'DELETE';
  item.detail = evt.rows.map(row => createTable({ columns: COLUMNS, rows: Object.keys(row).map(key => [key, row[key]]) })).join('');
  TABLE.add(item);
}

function handleInsert(evt) {
  const item = getDefaultItem(evt);
  item.operation_type = 'INSERT';
  item.detail = evt.rows.map(row => createTable({ columns: COLUMNS, rows: Object.keys(row).map(key => [key, row[key]]) })).join('');
  TABLE.add(item);
}

function handleUpdate(evt) {
  const item = getDefaultItem(evt);
  const equal = (a, b) => ((a + '') === (b + ''));
  item.operation_type = 'UPDATE';
  item.detail = evt.rows.map(row => {
    const tableRows = Object.keys(row.before).map(key => {
      const valueChanged = !equal(row.before[key], row.after[key]);
      const formattedKey = valueChanged ? `<p class='changed-key'>${key}</p>` : `<p class='unchanged-key'>${key}</p>`;
      const formattedValue = valueChanged ? `<p><span class="changed-value">${row.before[key]}</span>  =>  <span>${row.after[key]}</span></p>` : `<p class='unchanged-value'>${row.after[key]}</p>`;
      return [formattedKey, formattedValue];
    });
    return createTable({ columns: COLUMNS, rows: tableRows })

  }).join('');
  TABLE.add(item);
}

function refreshSummary() {
  const showAll = $("#show_full_summary").is(":checked");
  showAll ? $(".unchanged-value").parentsUntil('tbody').show() : $(".unchanged-value").parentsUntil('tbody').hide()
}

function handleClear() {
  TABLE.clear();
  QUERY_TABLE.clear();
}

function handleToggleAll() {
  $('div.detail').is(':visible') ? $('div.detail').hide() : $('div.detail').show()
}

function getDefaultItem(evt) {
  var moment = require('moment');
  const tableInfo = evt.tableMap[evt.tableId];
  return {
    timestamp: moment(evt.timestamp).format('YYYY-MM-DD HH:mm:ss'),
    db_name: tableInfo.parentSchema,
    table_name: tableInfo.tableName,
    summary: `<p class="detail-summary">${evt.rows.length} Change(s)</p>`,
  }
}


function getCells(data, type) {
  return data.map(cell => `<${type}>${cell}</${type}>`).join('');
}

function createBody(data) {
  return data.map(row => `<tr>${getCells(row, 'td')}</tr>`).join('');
}

function createTable({ columns, rows }) {
  return `
    <table class='detail-table'>
      <thead>
        <th class='column-key'>Key</th>
        <th class='column-value'>Value</th>
      </thead>
      <tbody>${createBody(rows)}</tbody>
    </table>
  `;
}


function reportIssue() {
  shell.openExternal('https://github.com/zhangqibupt/bindog/issues/new')
}
