/**
 * Read in a URL, validate it and turn the data into a CSV
 */

'use strict'

const path = require('path'),
      json2csv = require('json2csv'),
      fs = require('fs'),
      { URL } = require('url'),
      config = require('./config'),
      inquirer = require('inquirer')

class CreateCsv {

  /**
   * Initialize variables and begin the process by prompting
   */
  constructor() {
    this.prompt()
  }

  /**
   * Collect user input for use down the line
   *
   * @return {Function}       The inquirer function
   */
  prompt() {

    const questions = [{
      type: 'input',
      name: 'url',
      message: 'Enter the URL you want to convert:',
      validate: (input) => {
        try {
          this.url = new URL(input)
        }
        catch(err) {
          return 'The URL you have entered is invalid!'
        }
        return true
      }
    }]

    return inquirer
            .prompt(questions)
            .then(this.processInput.bind(this))
  }

  /**
   * Create export CSV
   */
  processInput() {

    const params = this.url.searchParams,
          csvData = []

    this.url.searchParams.forEach((value, name, searchParams) => {
      csvData.push({ Field : name, Value: value.toString() })
    })

    const toCsv = {
      data: csvData,
      fields: config.columns
    }

    const csv = json2csv(toCsv)


    const exportFile = path.join(__dirname, config.files.export)

    fs.writeFile(exportFile, csv, (err) => {
      if(err) throw err
      console.log(`${config.files.export} successfully created!`)
    })
  }
}

const run = new CreateCsv()

