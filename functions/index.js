// import {
//     onDocumentWritten,
//     // onDocumentCreated,
//     // onDocumentUpdated,
//     // onDocumentDeleted,
//     Change,
//     FirestoreEvent
// } from 'firebase-functions/v2/firestore';

const {onDocumentWritten} = require("firebase-functions/v2/firestore");
const {log, error} = require("firebase-functions/logger");
const {client} = require("./utils/elasticsearch/index.js");

// import { log, error } from 'firebase-functions/logger';

// import { client } from './utils/elasticsearch/index.js';

/**
 * @param {string} index
 * @param {*} event
 */
async function writeToIndex(index, event) {
  const snapshot = event.data.after.data();

  if (!snapshot) {
    log("No new data associated with the event");

    const previousSnapshot = event.data.before.data();

    if (previousSnapshot) {
      log("Deleting document from index");
      try {
        // try deleting in index
        const result = await client.delete({
          index,
          id: previousSnapshot.id,
        });
        log(result);
      } catch (e) {
        error(e);
      }
    }
    return;
  }

  const data = snapshot.data();

  try {
    const result = await client.index({
      index,
      id: snapshot.id,
      document: {
        docId: snapshot.id,
        ...data,
      },
    });
    log(result);
  } catch (e) {
    error(e);
  }
}

exports.itemWritten = onDocumentWritten({
  document: "items/{id}",
  region: "asia-southeast1",
}, async (event) => writeToIndex("items", event));

exports.supplierWritten = onDocumentWritten({
  document: "suppliers/{id}",
  region: "asia-southeast1",
}, async (event) => writeToIndex("suppliers", event));

exports.purchaseOrderWritten = onDocumentWritten({
  document: "purchase-orders/{id}",
  region: "asia-southeast1",
}, async (event) => writeToIndex("purchase-orders", event));

exports.locationWritten = onDocumentWritten({
  document: "locations/{id}",
  region: "asia-southeast1",
}, async (event) => writeToIndex("locations", event));

exports.userWritten = onDocumentWritten({
  document: "users/{id}",
  region: "asia-southeast1",
}, async (event) => writeToIndex("users", event));
