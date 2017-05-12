 
 

var path = require('path')
var shell = require('shelljs')
var argv = require('yargs').argv

function noop (x) { return x }

function getPackageJsonLocations (dirname) {
  return shell.find(dirname)
    .filter(function (fname) {
      return !(fname.indexOf('node_modules') > -1 || fname[0] === '.') &&
        path.basename(fname) === 'package.json'
    })
    .map(function (fname) {
      return path.dirname(fname)
    })
}

function npmPruneDevPackages (dir) {
  shell.cd(dir)
  console.log('Removing Dev Dependecies from ' + dir + '/package.json...')
  var result = shell.exec('npm prune --production')
  console.log('')

  return {
    dirname: dir,
    exitCode: result.code
  }
}


function filterRoot (dir) {
  if (path.normalize(dir) === path.normalize(process.cwd())) {
    console.log('Skipping root package.json...')
    return false
  } else {
    return true
  }
}

if (require.main === module) {
  var exitCode = getPackageJsonLocations(process.cwd())
    .filter(argv.skipRoot ? filterRoot : noop)
    .map(npmPruneDevPackages)
    .reduce(function (code, result) {
      return result.exitCode > code ? result.exitCode : code
    }, 0)

  process.exit(exitCode)
}

module.exports = {
  getPackageJsonLocations: getPackageJsonLocations,
  npmPruneDevPackages: npmPruneDevPackages,
  filterRoot: filterRoot
};
