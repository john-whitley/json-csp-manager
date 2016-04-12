#!/usr/bin/env node

import cli from 'cli';
import CliTable from 'cli-table';
import fs from 'fs';
import {JsonCspManager, JsonCspDocument} from '../index';

cli.setUsage('app [options] json-csp-filename1 [json-csp-filename2 [json-csp-filename3 [...]]]');

cli.parse({
  table: ['t', 'Show tabular output of where the CSP rules came from'],
  csp: ['c', 'Show the CSP response header']
});

cli.main((args, options) => {

  const files = [];

  args.forEach((filename) => {
    files.push(
      new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf-8', (err, data) => {
          if (err) {
            reject(err);
          }

          try {
            const jsonCspDocument = new JsonCspDocument(data, filename);

            if (jsonCspDocument instanceof JsonCspDocument) {
              resolve(jsonCspDocument);
            }
          } catch (exception) {
            reject(exception);
          }

          reject('unexpected error');
        });
      })
    );
  });


  Promise.all(files).then((openedDocuments) => {
    const manager = new JsonCspManager();

    manager.jsonCspDocuments = openedDocuments;

    const mergedDocument = manager.mergedJsonCspDocument;

    if (options.table) {
      const mergeReport = manager.jsonCspReport;
      const table = new CliTable({head: ['CSP Rule', 'Value', 'Included', 'File(s) it came from']});

      mergeReport.information.forEach((ruleValue, ruleName) => {
        ruleValue.forEach((jsonCspDocuments, value) => {
          jsonCspDocuments.forEach((jsonCspDocument) => {
            let included = 'merged out';

            if (mergedDocument.has(ruleName, value)) {
              included = 'PRESENT';
            }
            const ruleDetails = {};

            ruleDetails[ruleName] = [value, included, jsonCspDocument.documentId];
            table.push(ruleDetails);
          });
        });


      });

      const tableOutput = table.toString();

      process.stdout.write(`${tableOutput}\n`);
    }

    if (options.csp) {
      const cspOutput = mergedDocument.toCsp();

      process.stdout.write(`${cspOutput}\n`);
    }

  })
  .catch((errorInJsonCspDocument) => {
    process.stderr.write('Problem opening file: ', errorInJsonCspDocument.message);
  });

});
