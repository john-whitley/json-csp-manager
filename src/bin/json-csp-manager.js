#!/usr/bin/env node

import cli from 'cli';
import CliTable from 'cli-table';
import fs from 'fs';
import {JsonCspManager, JsonCspDocument} from '../index';

cli.setUsage('app [options] json-csp-filename1 [json-csp-filename2 [json-csp-filename3 [...]]]');

cli.parse({
  csp: ['c', 'Show the CSP response header'],
  json: ['j', 'Show the JSON CSP output'],
  table: ['t', 'Show tabular output of where the CSP rules came from']
});

/**
 * Manages the CLI JSON CSP manager
 */
class JsonCspManagerCli {

  /**
   * Build the JsonCspManagerCli class
   *
   * @param {string[]} filenames the filenames to merge
   * @param {object} options the options that were passed in by the CLI
   */
  constructor(filenames, options) {
    /**
     * @property {Promise[JsonCspDocument[]]} files the JsonCspDocument files to merge
     */
    this.files = [];
    /**
     * @property {object} options the options from the cli class
     */
    this.options = options;

    filenames.forEach((filename) => {
      this.files.push(
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
  }

  /**
   * Indicator that states whether the JSON output should be shown.
   *
   * @return {boolean} true if the JSON output should be shown.
   */
  get showJson() {
    return this.options.json;
  }

  /**
   * Indicator that states whether the CSP HTTP response header output should be shown.
   *
   * @return {boolean} true if the CSP HTTP response header output should be shown.
   */
  get showCsp() {
    return this.options.csp;
  }

  /**
   * Indicator that states whether the table explaining the merge should be shown.
   *
   * @return {boolean} true if the table explaining the merge should be shown.
   */
  get showTable() {
    return this.options.table;
  }

  /**
   * get all the JsonCspDocuments to be merged
   *
   * @return {Promise} the JsonCspDocuments
   */
  get jsonCspDocuments() {
    return Promise.all(this.files);
  }

  /**
   * get all JsonCspManager to manage the merging of the documents.
   *
   * @return {Promise} the JsonCspDocuments
   */
  get jsonCspManager() {
    if (this.manager instanceof Promise) {
      return this.manager;
    }

    this.manager = this.jsonCspDocuments.then((jsonCspDocuments) => {
      const manager = new JsonCspManager();

      manager.jsonCspDocuments = jsonCspDocuments;

      return manager;
    });

    return this.manager;
  }

  /**
   * get all JsonCspManager to manage the merging of the documents.
   *
   * @return {Promise} the JsonCspDocuments
   */
  get mergedDocument() {
    return this.jsonCspManager.then((manager) => {
      const mergedDocument = manager.mergedJsonCspDocument;

      return mergedDocument;
    });
  }

  /**
   * get the CliTable of the explainations of the merge
   *
   * @return {CliTable} the table with the merge explanations in it
   */
  get cliTable() {
    const promises = [
      this.jsonCspManager,
      this.mergedDocument
    ];

    return Promise.all(promises).then((resolvedPromises) => {
      const manager = resolvedPromises.shift();
      const mergedDocument = resolvedPromises.shift();
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

      return table;
    });
  }

  /**
   * get the CSP HTTP response header value from the merged documents
   *
   * @return {string} the CSP HTTP response header value
   */
  get cspOutput() {
    return this.mergedDocument.then((mergedDocument) => {
      const cspOutput = mergedDocument.toCsp();

      return cspOutput;
    });
  }

  /**
   * get the JSON CSP value from the merged documents
   *
   * @return {string} the JSON CSP value
   */
  get jsonOutput() {
    return this.mergedDocument.then((mergedDocument) => {
      const jsonOutput = mergedDocument.toJson();

      return jsonOutput;
    });
  }


  /**
   * get all the required outputs
   *
   * @return {Promise} the string of all the outputs
   */
  get allOutputs() {
    const outputPromises = [];

    if (this.showTable) {
      const tablePromise = this.cliTable.then((table) => {
        const tableOutput = table.toString();

        return `${tableOutput}\n`;
      });

      outputPromises.push(tablePromise);
    }

    if (this.showJson) {
      const jsonPromise = this.jsonOutput;

      outputPromises.push(jsonPromise);
    }

    if (this.showCsp) {
      const cspPromise = this.cspOutput;

      outputPromises.push(cspPromise);
    }

    return Promise.all(outputPromises).then((outputs) => {
      const output = outputs.join(`\n`);

      return output;
    });
  }

  /**
   * Display all the outputs on the terminal
   *
   * @return {void}
   */
  showAll() {
    this.allOutputs.then((output) => {
      process.stdout.write(`${output}\n`);
    });

    return;
  }
}

cli.main((args, options) => {
  const engine = new JsonCspManagerCli(args, options);

  engine.showAll();
});
