/**
 * Read data exported from the Slack API and process it into a user-friendly
 * CSV file filterable to a specific user if provided
 */

'use strict'

const _ = require('lodash'),
      path = require('path'),
      json2csv = require('json2csv'),
      fs = require('fs'),
      { URL } = require('url'),
      config = require('./config'),
      inquirer = require('inquirer'),
      newLine = '\r\n'

class CreateCsv {

  /**
   * Initialize variables and begin the process by prompting
   */
  constructor() {
    this.prompt.bind(this)
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
      message: 'Enter the URL you want to convert',
      validate: (input) => {
        try {
          this.url = new URL(input)
        }
        catch(err) {
          return false
        }

      }
    }]

    return inquirer.prompt(questions)
      .then(this.processInput.bind(this))
  }

  /**
   * Prepare the export CSV and Begin processing Slack data
   * by looping through data directories defined in the config file
   *
   * @param  {Object}   answers Answers object from the inquirer function
   * @return {Function}         The async.each function
   */
  processInput(answers) {
    this.promptAnswers = answers

    const exportFile = path.join(__dirname, config.files.export)

    // Create or re-create the export file
    if(fs.existsSync(exportFile)) {
      fs.unlinkSync(exportFile)
    }
    fs.writeFileSync(exportFile, config.columns + newLine)

    const params = this.url.searchParams()

    console.log(params)

    /*msgArr.push({
          time: moment.unix(message.ts).format('M/D/Y h:m:s A'),
          type: dir,
          location: file.slice(0, -5),
          message: message.text ? message.text.cleanSlackCharacters() : ''
        })
      })

      const toCsv = {
        data: msgArr,
        fields: config.columns,
        hasCSVColumnTitle: false
      }

      const csv = json2csv(toCsv) + newLine

      fs.appendFile(config.files.export, csv, (err) => {
        if (err) this.handleError(err)
        console.log(`Added ${messages.length} messages from ${file} in ${dir}`)
        return callback()
      })*/

  }

  /**
   * Function called when all processing operations are complete
   *
   * @param  {Object} err  Error passed from async.each
   * @return {[type]}     [description]
   */
  onComplete(err) {
    if (err) this.handleError(err)
    this.emit('complete', this)
  }
}

const run = new CreateCsv()

