// @ts-nocheck
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const math = require('mathjs');

var calculator = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Homepage.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('new calculation', (expression) => {
    var validation = validate(expression);
    if(validation === 'Success'){
      calculator = getCalculations(expression);
      io.emit('new calculation', calculator);
    }
    else{
      io.emit('error',validation);
    }
  });
  socket.on('clear calculation', () => {
    calculator = [];
    io.emit('new calculation', calculator);
  });
});

function getCalculations(expression) {

  var calculations = {
    expression:expression,
    result:math.evaluate(expression),
    time:new Date().toLocaleString()
  }

  calculator.push(calculations);
  return calculator;
}

function validate(expression) {
  var regExp = /[a-zA-Z,'";:`~!@#$%^&()_=]/g;
  if(regExp.test(expression)){
    return 'Please enter only numerical values and math operators (+, -, /, * and .).';
  }
  return 'Success';
  
}

http.listen(process.env.PORT || 3000, () => {
  console.log('listening on ',process.env.PORT);
});