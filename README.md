## County Coverage
A prototype for producing a map of retsly's vendor coverage by county.

## Install

`npm install`
##Usage
To generate county data in db and create csv for map (based on your db data):

`$ bin/init`

Options:
```bash
    -h, --help     output usage information
    -V, --version  output the version number
    --cron [time]  human readable time schedule eg. "4 hours"
    --dsn [dsn]    mongo dsn
    --limit [num]  property limit per vendor
    --out [path]   output path for csv file
```
Example `$ bin/init --dsn "mongodb://mydb:pa55w3rd@127.0.0.1:27017/myusr" --cron "6 hours" --limit 1000 --out "public/fips.csv"` 

To serve up a map on your localhost:

From root: `bin/serve`

![](https://github.com/Retsly/county-coverage/blob/master/screenshot/screenshot.png)