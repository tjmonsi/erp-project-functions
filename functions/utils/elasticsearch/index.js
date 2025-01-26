// import { Client } from '@elastic/elasticsearch'
require("dotenv/config");
const {Client} = require("@elastic/elasticsearch");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const {
  ELASTICSEARCH_IP,
  ELASTICSEARCH_PORT,
  ELASTICSEARCH_API_ID,
  ELASTICSEARCH_API_KEY,
} = process.env;
const client = new Client({
  node: `https://${ELASTICSEARCH_IP}:${ELASTICSEARCH_PORT}`, // Elasticsearch endpoint
  auth: {
    apiKey: { // API key ID and secret
      id: ELASTICSEARCH_API_ID,
      api_key: ELASTICSEARCH_API_KEY,
    },
  },
});


module.exports = {client};
