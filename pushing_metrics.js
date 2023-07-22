const winston = require('winston');
const { Pushgateway, Registry } = require('prom-client');

// Create a registry and a Pushgateway instance
const registry = new Registry();
const pushgateway = new Pushgateway('http://localhost:9091');

// Define a custom logger
const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs.log' }),
  ],
});

// Register the logger as a gauge metric
const logMetric = new winston.transports.Prometheus({
  name: 'my_app_logs',
  level: 'info',
  gauge: true,
  registry,
});

// Start the pushgateway and push the metrics every 5 seconds
pushgateway.pushAdd({ jobName: 'my_app' }, (err) => {
  if (err) {
    console.error('Error pushing metrics:', err);
  }
});
setInterval(() => {
  pushgateway.push({ jobName: 'my_app' }, (err) => {
    if (err) {
      console.error('Error pushing metrics:', err);
    }
  });
}, 5000);

// Use the logger to log some data
logger.info('Hello, world!');
