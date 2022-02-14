const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const os = require('os').platform;

/* Default behavior is to check for the existence of files
 * in client's build directory, packages (node_modules) and package.json.
 *
 * If packages and package.json exists and build directory is not empty,
 * client will be cleaned and rebuilt again.
 *
 * If build directory is empty and packages are installed,
 * and package.json exists, program will call `npm run build`
 * in the client's directory to build the client into build
 * directory.
 *
 * If build directory is not empty and packages are not installed,
 * and package.json exists, program will first call `npm install`
 * to install the packages and their dependencies and will call
 * `npm run build` after succesful installation to build the client.
 *
 * If build directory is empty and package.json exists,
 * program will always call for `npm run build` first.
 *
 * If package.json is missing in all the cases, program won't do anything.
 *
 * takes in --remove-modules as argument for removing client's packages.
 * takes in --all-tests as arguments for running all tests on API and client. */

/* check that platform is unix, exit otherwise */
if (os().match(/^(linux|freebsd|openbsd)$/gi) === null) {
  console.log(os())
  process.exit(1);
}

/* paths */
const relativePath = 'client/';
const files = path.resolve(__dirname, relativePath);

console.log(`PATH: ${files}`)

/* flags */
let package_json_exists = false;
let node_modules_exists = false;
let build_dir_empty = false;

/* -------------- */
/* Sets the flags */
/* -------------- */

/* checks for the existence of package.json and node_modules */
fs.readdirSync(files).forEach((file) => {
  /* marks the flag */
  if (file === 'package.json') {
    package_json_exists = true;
  }
  /* cleans node_modules from the client directory */
  if (file === 'node_modules') {
    node_modules_exists = true;
  }
});

/* checks for the existence of files in client's build directory */
if (!fs.readdirSync(files + '/dist/').length) {
  build_dir_empty = true;
}

/* ----------------- */
/* helper functions */
/* ----------------- */

/**
 * Cleans the client build directory
 */
async function cleanDir() {
  console.log(`Cleaning of the client build directory started...`);
  const clean = cp.spawn('npm', ['run', 'clean'], { cwd: files });
  clean.stdout.on('data', (data) => console.log(`stdout: ${data}`));
  clean.on('err', (err) => console.log(`error ${err}`));
  clean.on('close', (exitCode) => {
    if (exitCode === 0) {
      console.log(`Build directory cleaned at ${files + '/dist/'}`);
    }
    console.log(`exited with ${exitCode}`);
    return exitCode;
  });
  return clean;
}

/**
 * Builds the client
 */
async function buildDir() {
  /* calls webpack to build for production */
  console.log(`Building of the client started...`);
  const build = cp.spawn('npm', ['run', 'build'], { cwd: files });
  build.stdout.on('data', (data) => console.log(`stdout: ${data}`));
  build.on('err', (err) => console.log(`error ${err}`));
  build.on('close', (exitCode) => {
    if (exitCode === 0) {
      console.log(`Client built at ${files + '/dist/'}`);
    }
    console.log(`exited with ${exitCode}`);
  });
  return build;
}

/**
 * Install packages
 */
async function installPackages() {
  const install = cp.spawn('npm', ['i'], { cwd: files });
  console.log(`Installing packages for the client...`);
  install.stdout.on('data', (data) => console.log(`stdout: ${data}`));
  install.on('err', (err) => console.log(`error ${err}`));
  install.on('close', (exitCode) => {
    // upon succesful install, builds the client
    //if (exitCode === 0) {
    //  console.log(`Packages succesfully installed`);
    //  if (build_dir_empty && buildAfter === true) {
    //    /* calls webpack to build for production */
    //    const build = cp.spawn('npm', ['run', 'build'], { cwd: files });
    //    build.stdout.on('data', (data) => console.log(`stdout: ${data}`));
    //    build.on('err', (err) => console.log(`error ${err}`));
    //    build.on('close', (code) => console.log(`exited with ${code}`));
    //  } else if (!build_dir_empty) {
    //  }
    //}
    //console.log(`exited with ${exitCode}`);
    return exitCode;
  });
  return install;
}

/**
 * Cleans node_modules/
 */
async function cleanPackages() {
  console.log(`Cleaning node_modules for the client...`);
  const clean_modules = cp.spawn('rm', ['-rfv', 'node_modules/'], { cwd: files });
  clean_modules.stdout.on('data', (data) => console.log(`stdout ${data}`));
  clean_modules.on('err', (err) => console.log(`error: ${err}`));
  clean_modules.on('close', (exitCode) => {
    /* upon success */
    if (exitCode === 0) {
      console.log(`client node_modules cleaned at ${files + '/'}`);
    }
    console.log(`exited with ${exitCode}`);
  });
  return clean_modules;
}

/**
 * Cleans node_modules/
 */
async function runAllTests() {
  console.log(`Running all tests for the API and client...`);
  async function client_tests() {
    const client_test = cp.spawn('npm', ['run', 'test'], { cwd: files });
    console.log(`Starting client\'s tests`);
    client_test.stdout.on('data', (data) => console.log(`stdout ${data}`));
    client_test.on('err', (err) => console.log(`error: ${err}`));
    client_test.on('close', (exitCode) => {
      /* upon success */
      if (exitCode === 0) {
        console.log(`Client's tests succesful`);
      }
      console.log(`Client exited with ${exitCode}`);
    });
    return client_test;
  }

  async function api_tests() {
    const api_test = cp.spawn('npm', ['run', 'test'], { cwd: './' });
    api_test.stdout.on('data', (data) => console.log(`stdout ${data}`));
    api_test.on('err', (err) => console.log(`error: ${err}`));
    api_test.on('close', (exitCode) => {
      if (exitCode === 0) {
        console.log(`API tests succesful.`);
      }
      console.log(`API exited with ${exitCode}`);
    });
    return api_test;
  }

  client_tests().then((process) => {
    process.on('close', (exitCode) => {
      if (exitCode === 0) {
        console.log("Client's tests succesful");
        api_tests();
      } else {
        console.error(exitCode);
      }
    });
  });
}

/* prerequisite for any further steps */
function main() {
  if (package_json_exists) {
    const argv = process.argv.slice(2);
    /* if arguments have been provided, return out of the function */
    if (argv[0] != null) {
      return;
    }
    /* install packages and build */
    if (!node_modules_exists) {
      installPackages().then((process) => {
        process.on('close', (exitCode) => {
          /* successful install */
          if (exitCode === 0) {
            console.log(`Packages succesfully installed`);

            /* build the client if /dist is empty,
             * otherwise clean it first */
            if (build_dir_empty) {
              buildDir().then((process) => {
                process.on('close', (exitCode) => {
                  exitCode === 0
                    ? console.log('Client succesfully built')
                    : console.error(exitCode);
                });
              });
            } else if (!build_dir_empty) {
              cleanDir().then((process) => {
                process.on('close', (exitCode) => {
                  if (exitCode === 0) {
                    console.log(`Build directory succesfully cleaned`);
                    buildDir().then((process) => {
                      process.on('close', (exitCode) => {
                        exitCode === 0
                          ? console.log('Client succesfully built')
                          : console.error(exitCode);
                      });
                    });
                  }
                });
              });
            }
          }
        });
      });
    } else if (node_modules_exists) {
      /* same build process but skips installation */
      if (build_dir_empty) {
        buildDir().then((process) => {
          process.on('close', (exitCode) => {
            exitCode === 0 ? console.log('Client succesfully built') : console.error(exitCode);
          });
        });
      } else if (!build_dir_empty) {
        cleanDir().then((process) => {
          process.on('close', (exitCode) => {
            if (exitCode === 0) {
              console.log(`Build directory succesfully cleaned`);
              buildDir().then((process) => {
                process.on('close', (exitCode) => {
                  exitCode === 0
                    ? console.log('Client succesfully built')
                    : console.error(exitCode);
                });
              });
            }
          });
        });
      }
    }
  }
}
main();

/* handle opts */
const args = process.argv.slice(2);

if (args[0] == '--remove-modules') {
  cleanPackages();
}

if (args[0] == '--all-tests') {
  runAllTests();
}
