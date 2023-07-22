// // const axios = require('axios');

// // // Define the PromQL query
// // const query = 'sum(rate(container_cpu_usage_seconds_total{container_name="mynodered"}[1m])) by (container_name)';

// // // Define the Prometheus API endpoint
// // const url = 'http://localhost:9090/api/v1/query';

// // // Send a GET request to the Prometheus API
// // axios.get(url, {
// //   params: {
// //     query: query
// //   }
// // })
// // .then(response => {
// //   // Extract the CPU usage from the response
// //   const result = response.data.data.result;
// //   if (result) {
// //     const cpuUsage = result[0].value[1];
// //     console.log(`Node-RED CPU usage: ${cpuUsage}`);
// //   } else {
// //     console.log('No data found');
// //   }
// // })
// // .catch(error => {
// //   console.error(error);
// // });



// const Prometheus = require('prom-client');

// // Initialize Prometheus with the Prometheus endpoint URL
// // Prometheus.collectDefaultMetrics({ timeout: 5000 });
// // const prometheusEndpoint = 'http://localhost:9090';
// // const prometheus = new Prometheus.Prometheus(prometheusEndpoint);

// // // Define the PromQL query to fetch the metrics
// // const query = 'sum(rate(http_requests_total{status_code="200"}[5m])) by (job)';

// // // Fetch the metrics using the PromQL query
// // prometheus.query(query)
// //   .then(result => {
// //     console.log('Query result:', result);
// //   })
// //   .catch(error => {
// //     console.error('Query failed:', error);
// //   });

// // const client = require('prom-client');

// // const collectDefaultMetrics = client.collectDefaultMetrics;

// // const x = collectDefaultMetrics();

// // console.log(x);

// const http = require('http')
// const url = require('url')
// const client = require('prom-client')

// // Create a Registry which registers the metrics
// const register = new client.Registry()

// // Add a default label which is added to all metrics
// register.setDefaultLabels({
//   app: 'example-nodejs-app'
// })

// // Enable the collection of default metrics
// client.collectDefaultMetrics({ register })

// // Define the HTTP server
// const server = http.createServer(async (req, res) => {
//   // Retrieve route from request object
//   const route = url.parse(req.url).pathname

//   if (route === '/metrics') {
//     // Return all metrics the Prometheus exposition format
//     res.setHeader('Content-Type', register.contentType)
//     res.end(register.metrics())
//   }
// })

// // Start the HTTP server which exposes the metrics on http://localhost:8080/metrics
// server.listen(8080)


const express = require('express');
const app = express();
const promBundle = require("express-prom-bundle");

// Add the options to the prometheus middleware most option are for http_request_duration_seconds histogram metric
const metricsMiddleware = promBundle({
    includeMethod: true, 
    includePath: true, 
    includeStatusCode: true, 
    includeUp: true,
    customLabels: {project_name: 'hello_world', project_type: 'test_metrics_labels'},
    promClient: {
        collectDefaultMetrics: {
        }
      }
});
// add the prometheus middleware to all routes
app.use(metricsMiddleware)

// default endpoint 
app.get("/",(req,res) => res.json({
    "GET /": "All Routes", 
    "GET /hello": "{hello:world}", 
    "GET /metrics": "Metrics data",
    "POST /bye": "POST Request: + post data"
}));
// hello world rest endpoint 
app.get("/hello", (req,res) => res.json({hello:"world"}));
app.post("/bye", (req,res) => res.send("POST Request : "+ req));

const server = app.listen(8008, function () {    
    console.log('Listening at http://localhost:8008');  
  });

process.on('SIGINT', () => {
    console.log('Received SIGINT signal. Shutting down server gracefully.');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });