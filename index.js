#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2))
var bencode = require('bencode')
var path = require('path')
var fs = require('fs')

function onerror () {
  console.error('usage: rtorrent-session-rectify --old [string] --new [string] --from [path] --to [path]\n')
  console.error('    --old   Exact string to be replaced in old .rtorrent session files')
  console.error('            (i.e. /home/bt/).\n')
  console.error('    --new   New path to replace in .rtorrent session files')
  console.error('            (i.e. /home/bt/).\n')
  console.error('    --from  Directory containing .rtorrent session files to update.\n')
  console.error('    --to    Directory to output updated .rtorrent session files.\n')
  console.error('    --help  Show this help message.\n')
  console.error('    -v      Show verbose output.')

  process.exit(1)
}

if (argv.help || !argv.old || !argv.new || !argv.from || !argv.to) {
  onerror()
}

var oldDir = argv.old
var newDir = argv.new
var fromDir = path.resolve(argv.from)
var toDir = path.resolve(argv.to)

var isVerbose = argv.v
var hasError = false

try {
  fs.statSync(fromDir).isDirectory()
} catch (err) {
  hasError = true
  console.error(err.message)
}

try {
  fs.statSync(toDir).isDirectory()
} catch (err) {
  hasError = true
  console.error(err.message)
}

if (hasError) process.exit(1)

fs.readdir(fromDir, function (err, files) {
  if (err) throw err

  var filtered = files.filter(function (name) {
    return /rtorrent$/.test(name)
  })

  console.log('Found ' + filtered.length + ' session files in ' + fromDir)

  function update (val, len) {
    if (val === undefined) throw err
    val = val.toString()

    if (!len) len = oldDir.length

    return new Buffer(path.join(newDir, val.slice(len)))
  }

  filtered.map(function (name) {
    var torrent = bencode.decode(fs.readFileSync(path.join(fromDir, name)))

    torrent.directory = update(torrent.directory)
    torrent.loaded_file = update(torrent.loaded_file)
    torrent.tied_to_file = Buffer.concat([new Buffer('/'), update(torrent.tied_to_file, oldDir.length + 1)])

    return torrent
  })
  .map(bencode.encode)
  .forEach(function (bencodedStr, i) {
    var filename = filtered[i]
    if (isVerbose) console.log('Updated ' + filename)
    fs.writeFileSync(path.join(toDir, filename), bencodedStr)
  })

  console.log('Successfully updated ' + filtered.length + ' files.')
})
