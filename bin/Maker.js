#! /usr/bin/env node
var shell = require("shelljs");
var minimist = require('minimist')
var colors = {
    Bold: "\033[1m",
    Black :"\033[0;30m",        
    Red :'\033[0;31m',          
    Green :'\033[0;32m',        
    Yellow :'\033[0;33m',       
    Blue :'\033[0;34m',         
    Purple :'\033[0;35m',       
    Cyan :'\033[0;36m',         
    White :'\033[0;37m' ,
    off:'\033[0m'  

}
function msg(color, msg) {
    shell.echo(color+msg+colors.off)
}
try {
const arguments = process.argv.slice(2)
const args = minimist(arguments);
if(!arguments.length) {
    throw new Error("Empty Arguments Specify something!")

}
let response
switch(args._[0].toLowerCase()) {
    case 'controller': 
    response = require('./Controller')(shell, args._[1], args)
    break;
    case 'request':
    response = require('./Request')(shell, args._[1], args)
    break;
    case 'service':
    response = require('./Service')(shell, args._[1], args)
    break;
    default:
        throw new TypeError('You need to specify one of those arguments (controller, service, request) !')
}
msg(colors.Cyan+colors.Bold, response)

msg(colors.Green, args._[1]+' was created Successfully!')
} catch(err) {
    //console.log(err)
    let color = colors.Red
    if(err instanceof TypeError) {
        color = colors.Yellow
    }
    msg(color, err.message)
    shell.exit()
}
msg(colors.Purple, 'done!')

    



