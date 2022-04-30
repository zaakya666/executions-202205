const spawn = require('child_process').spawn;
const fs = require('fs');
const path = require('path');

Array.prototype.forEachSync = function(func) {
    let array = this;
    let p = Promise.resolve();
    array.forEach((a) => p = p.then(() => func(a)))
}

const exec = async(opts) => {
    return new Promise((resolve) => {
        const ls = spawn('split', opts);

        ls.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        ls.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            resolve();
        });
    })
}

const currentCSV = async(dir) => {
    return new Promise((resolve) => {
        fs.readdir(dir, (err, files) => {
            if (err) throw err;
            var csvFiles = files.filter((file) => fs.statSync(dir + file).isFile() && /.*\.csv$/.test(file));
            let pathList = csvFiles.map(f => dir.concat(f));
            console.log(pathList);
            resolve(pathList);
        });
    })
}

module.exports.exec = (opts) => exec(opts);

const main = async(d) => {
    let dir = d+'/'
    let currentFiles = await currentCSV(dir);
    let maxFileSize = 46 * 2 ** 20; //50MB
    let currentOverSizeFiles = currentFiles.filter(f => fs.statSync(f).size > maxFileSize)
    currentOverSizeFiles.forEachSync(async(filePath) => {
        // let filename = dir + "2019-10-27T00:00:00+09:00.response.csv"
        let opts = ["-l", "524288", "-d", filePath, dir + path.basename(filePath, '.csv') + ".", "--additional-suffix=.csv"]
        let response = await exec(opts);
        fs.unlinkSync(filePath)
        console.log(response)
    });

}

let dir = process.argv[2]
dir = './'
main(dir);
