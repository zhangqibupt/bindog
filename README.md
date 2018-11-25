# bindog
A MySQL binlog listener running on [Electron](https://github.com/electron/electron)

[![b03IsTARFL.md.gif](https://www.z4a.net/images/2018/11/26/b03IsTARFL.md.gif)](https://www.z4a.net/image/78lV7b)

## To Use
Download from https://github.com/zhangqibupt/bindog/releases

## NOTE
This is based on [Zongji](https://github.com/nevill/zongji), if you cannot see binlog output or encounter `Error: ER_NO_BINARY_LOGGING: You are not using binary logging`, please make sure
* Enable MySQL binlog in `my.cnf`, restart MySQL server.
  ```
  [mysqld]
  server-id        = 1
  binlog_format    = row
  # Directory must exist. This path works for Linux. Other OS may require
  log_bin          = /var/log/mysql/mysql-bin.log
  ```

  For docker image, it's usually located in `/etc/mysql/my.cnf`.

## License
MIT
