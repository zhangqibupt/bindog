# bindog
A MySQL binlog/query log listener running on Electron

[DEMO](https://youtu.be/D9C-eu26A9w)

## To Use
Download from https://github.com/zhangqibupt/bindog/releases

## NOTE
This is based on [Zongji](https://github.com/nevill/zongji), if you cannot see binlog output or encounter `Error: ER_NO_BINARY_LOGGING: You are not using binary logging`, please make sure
* Enable MySQL binlog in `my.cnf`, restart MySQL server.
  ```
  [mysqld]
  server-id        = 1
  binlog_format    = row
  # Directory must exist. This path works for Linux.
  log_bin          = /var/log/mysql/mysql-bin.log
  ```

  For docker image, it may be located in
  - /etc/mysql/my.cnf
  - /etc/my.cnf

Note that, if you specify mysql options `binlog-ignore-db` or `binlog-ignore-db`, some tables would be ingored and won't trigger binlog events accordingly.
