#! /usr/bin/env node
var shell = require('shelljs')
var minimist = require('minimist')
var colors = {
  Bold: '\x1b[1m',
  Black: '\x1b[0;30m',
  Red: '\x1b[0;31m',
  Green: '\x1b[0;32m',
  Yellow: '\x1b[0;33m',
  Blue: '\x1b[0;34m',
  Purple: '\x1b[0;35m',
  Cyan: '\x1b[0;36m',
  White: '\x1b[0;37m',
  off: '\x1b[0m'

}

function msg (color, msg) {
  shell.echo(color + msg + colors.off)
}
try {
  const argts = process.argv.slice(2)
  const args = minimist(argts)
  if (!argts.length) {
    throw new Error('Empty Arguments Specify something!')
  }
  let response
  switch (args._[0].toLowerCase()) {
    case 'controller':
      response = require('./Controller')(shell, args._[1], args)
      break
    case 'request':
      response = require('./Request')(shell, args._[1], args)
      break
    case 'service':
      response = require('./Service')(shell, args._[1], args)
      break
    case 'model':
      response = require('./Model')(shell, args._[1], args)
      break
    case 'resource':
      response = require('./Resource')(shell, args._[1], args)
      break
    default:
      throw new TypeError('You need to specify one of those arguments (controller, service, request) !')
  }

  msg(colors.Green, args._[0] + ' was created Successfully!')
  msg(colors.Cyan + colors.Bold, response)
} catch (err) {
  console.log(err)
  let color = colors.Red
  if (err instanceof TypeError) {
    color = colors.Yellow
  }
  msg(color, err.message)
  shell.exit()
}
msg(colors.Purple, 'done!')
