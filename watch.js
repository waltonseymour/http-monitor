const fs = require('fs');
const readline = require('readline');


fs.watchFile("./test.log", {interval: 100}, (curr, prev) => {
  var lineReader = readline.createInterface({
    input: fs.createReadStream('./test.log')
  });

  lineReader.on('line', (line) => {
    line = parseLine(line);
    console.log(line);
  });
});


function parseLine(line){
  const pattern = /^([\d.]+) ([\w.-]+) ([\w.-]+) \[([\w/: -]+)\] "([\w /.]+)" ([\d]{3}) ([\d]+)$/;
  const match = pattern.exec(line);
  if (match === null){
    return null;
  }
  return {
    ip: match[1],
    rfc: match[2],
    user: match[3],
    date: match[4],
    request: match[5],
    status: match[6],
    size: match[7]
  };

}
