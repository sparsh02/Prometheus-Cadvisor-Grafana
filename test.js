const fs = require('fs');
const { Registry, collectDefaultMetrics, register } = require('prom-client');
const promCadvisor = require('prom-cadvisor');

// Register all the default metrics
collectDefaultMetrics();

// Create a registry for cAdvisor metrics
const cadvisorRegistry = new Registry();
promCadvisor.collectDefaultMetrics({ register: cadvisorRegistry });

// Merge the cAdvisor registry into the main register
register.clear();
register.registerMetric(...cadvisorRegistry.getMetricsAsArray());
register.metrics();

// Fetch all the metrics from the register
const metrics = register.metrics();

// Write the metrics to a text file
fs.writeFile('prometheus_metrics.txt', metrics, (err) => {
  if (err) throw err;
  console.log('Metrics written to prometheus_metrics.txt');
});
