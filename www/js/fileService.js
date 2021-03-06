(function () {

    angular.module('starter')
        .service('FileSys', ['$cordovaFile', '$q', FileSys]);

    function FileSys($cordovaFile, $q) {

        return {
            insertData: insertData,
            getData: getData,
            checkFile: checkFile,
        };


        function checkFile(fileName) {
            return $q(function (resolve, reject) {
                $cordovaFile.checkFile(cordova.file.dataDirectory, fileName)
                    .then(function (success) {
                        resolve(true);
                        console.log("check file success");
                    }, function (error) {
                        reject(false);
                        console.log("check file error");
                    });
            })
        }


        function insertData(fileName, data) {
            $cordovaFile.writeFile(cordova.file.dataDirectory, fileName, JSON.stringify(data), true)
                .then(function (success) {
                    // success
                    console.log("inserted success");
                }, function (error) {
                    // error
                    console.log("inserted fails");

                });
        }

        function getData(fileName) {
            return $q(function (resolve, reject) {
                $cordovaFile.readAsText(cordova.file.dataDirectory, fileName).then(
                    function (success) {
                        resolve(success);
                        console.log("read success");
                    }, function (error) {
                        reject(error);
                        console.log("read error \n"+JSON.stringify(error)+"\n");
                    }
                )
            })
        }

    }

})();