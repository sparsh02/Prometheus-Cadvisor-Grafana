// // // const Prometheus = require('prom-client');
// // // const express = require('express');

// // // // Initialize Prometheus with the default registry
// // // Prometheus.collectDefaultMetrics();

// // // // Create a new Express.js app
// // // const app = express();

// // // // Define routes for each metrics endpoint
// // // app.get('/metrics/cadvisor', async (req, res) => {
// // //   try {
// // //     const registry = await Prometheus.register.getSingleMetric('container_cpu_user_seconds_total');
// // //     res.set('Content-Type', Prometheus.register.contentType);
// // //     res.send(registry.metrics());
// // //   } catch (err) {
// // //     res.status(500).send(err);
// // //   }
// // // });

// // // app.get('/metrics/prometheus', async (req, res) => {
// // //   try {
// // //     const registry = await Prometheus.register.getSingleMetric('promhttp_metric_handler_requests_total');
// // //     res.set('Content-Type', Prometheus.register.contentType);
// // //     res.send(registry.metrics());
// // //   } catch (err) {
// // //     res.status(500).send(err);
// // //   }
// // // });

// // // app.get('/metrics/node_exporter', async (req, res) => {
// // //   try {
// // //     const registry = await Prometheus.register.getSingleMetric('node_cpu_seconds_total');
// // //     res.set('Content-Type', Prometheus.register.contentType);
// // //     res.send(registry.metrics());
// // //   } catch (err) {
// // //     res.status(500).send(err);
// // //   }
// // // });

// // // // Start the Express.js app
// // // app.listen(8008, () => {
// // //   console.log('Server started on port 8008');
// // // });



// // import fs from 'fs' 
// // import { Registry, collectDefaultMetrics, register } from 'prom-client';

// // // import { Registry, collectDefaultMetrics} from 'prom-client'
// // import promCadvisor from 'prom-client'
// // import promNodeExporter from 'prom-client'
// // import pkg from 'prom-client';
// // const {push} = pkg;
// // // const fs = require('fs');
// // // const { Registry, collectDefaultMetrics } = require('prom-client');
// // // const promCadvisor = require('prom-client/lib/client').register;
// // // const promNodeExporter = require('prom-client/lib/metricNames').metrics;
// // // const { push } = require('prom-client');

// // // Create a new Prometheus registry
// // const registry = new Registry();

// // // Register default metrics (e.g. CPU usage, memory usage)
// // collectDefaultMetrics({ register: registry });

// // // Register metrics from cAdvisor and Node Exporter
// // register({ registry });
// // promNodeExporter.forEach(name => registry.registerMetric(new name()));

// // // Set up a Pushgateway client
// // const pushgateway = new push.Pushgateway('http://localhost:9091');

// // // Fetch metrics from Prometheus and cAdvisor
// // const prometheusMetrics = await registry.getMetricsAsText();
// // const cadvisorMetrics = await promCadvisor.metrics();

// // // Fetch metrics from Node Exporter
// // const nodeExporterMetrics = fs.readFileSync('/metrics', 'utf8');

// // // Create a metrics text file
// // const metricsFile = 'metrics.txt';

// // // Write metrics to the text file
// // fs.writeFileSync(metricsFile, prometheusMetrics + cadvisorMetrics + nodeExporterMetrics);

// // // Push metrics to the Pushgateway
// // pushgateway.pushAdd({ jobName: 'my-job', groupings: { instance: 'localhost' }, metrics: registry.getMetrics() });





// const fs = require('fs');
// const { Registry, collectDefaultMetrics } = require('prom-client');
// // const promCadvisor = require('prom-client/lib/client').register;
// // const promNodeExporter = require('prom-client/lib/metricNames').metrics;
// // const { push } = require('prom-client');

// // Create a new Prometheus registry
// const registry = new Registry();

// // Register default metrics (e.g. CPU usage, memory usage)
// collectDefaultMetrics({ register: registry });

// // Register metrics from cAdvisor and Node Exporter
// // promCadvisor({ registry });
// // promNodeExporter.forEach(name => registry.registerMetric(new name()));

// // Set up a Pushgateway client
// // const pushgateway = new push.Pushgateway('http://localhost:9091');

// // Fetch metrics from Prometheus and cAdvisor
// const prometheusMetrics = registry.getMetricsAsText();
// // const cadvisorMetrics = promCadvisor.metrics();

// // // Fetch metrics from Node Exporter
// // const nodeExporterMetrics = fs.readFileSync('/metrics', 'utf8');

// // Create a metrics text file
// const metricsFile = 'metrics.txt';

// // Write metrics to the text file
// fs.writeFileSync(metricsFile, prometheusMetrics + cadvisorMetrics + nodeExporterMetrics);

// // Push metrics to the Pushgateway
// // pushgateway.pushAdd({ jobName: 'my-job', groupings: { instance: 'localhost' }, metrics: registry.getMetrics() });


const fs = require('fs');
const { register, collectDefaultMetrics } = require('prom-client');

// Register all the default metrics
collectDefaultMetrics();

// Fetch all the metrics from the register
register.metrics().then(metrics => {
  // Write the metrics to a text file
  fs.writeFile('prometheus_metrics.txt', metrics, (err) => {
    if (err) throw err;
    console.log('Metrics written to prometheus_metrics.txt');
  });
}).catch(err => {
  console.error('Error fetching metrics:', err);
});

