const latestVersion = require('latest-version');
const readJson = require('read-package-json');
const bPromise = require('bluebird');
const path = require('path');
const fs = require('fs');


const packageData = (path) => {
    return new bPromise((resolve, reject) => {
        readJson(path, console.error, false, function (er, data) {
            if (er) {
              console.error("There was an error reading the file")
              return reject (err)
            }
           
            //console.error('the package data is', typeof data);
            return resolve(data);
          });
    })
}

const writeFile  = (path, data) => {

}

packageData(path.join(__dirname, 'package.json'))
.then((data) => {
    // console.log('success');
    // console.log(Object.keys(data.dependencies))
    // const newKeys = {}
    const dependencies =  bPromise.map(Object.keys(data.dependencies), pkg => {
       // console.log('pkkk', pkg)
        return latestVersion(pkg)
        .then(version => {
            const x = {};
            x[pkg.toString()] = "^" + version;
            return x;
        })
    });

    const devDep =  bPromise.map(Object.keys(data.devDependencies), pkg => {
        // console.log('pkkk', pkg)
         return latestVersion(pkg)
         .then(version => {
             const x = {};
             x[pkg.toString()] = "^" + version;
             return x;
         })
     });

     const fullData = bPromise.resolve(data);

     return bPromise.all([dependencies, devDep, fullData])
})
.then(newPkgs => {
    // console.log('neww', newPkgs)
    let newPkg = newPkgs[0].reduce((a, c) => ({...a, ...c}), Object.create(null));
    let newDevPkg = newPkgs[1].reduce((a, c) => ({...a, ...c}), Object.create(null));

    newPkgs[2].dependencies = newPkg;
    newPkgs[2].devDependencies = newDevPkg;
    
   //console.log(newPkgs[2]);

   return new bPromise((resolve, reject) => {
       fs.writeFile(path.join(__dirname, 'new-package.json'), (JSON.stringify(newPkgs[2])), (err) => {
           if(err){
               return reject(err)
           }
           return resolve()
       })
   })
})
.then(() => {
    console.log('created successfully');
})
.catch(err => {
    console.log('err', err);
})
 

// (async () => {
//     console.log(await latestVersion('ava'));
//     //=> '0.18.0'
 
//     console.log(await latestVersion('@sindresorhus/df'));
//     //=> '1.0.1'
 
//     // Also works with dist-tags and semver ranges
//     console.log(await latestVersion('npm', {version: 'latest-5'}));
//     //=> '5.5.1'
// })();