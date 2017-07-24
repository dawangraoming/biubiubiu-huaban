/*!
 * @author xueyangchu
 * @date 2017/7/18
 */
"use strict";


(function () {
    const {ipcRenderer} = require('electron');
    const $ = document.querySelector.bind(document);

    const $msg = $("#msg");

    ipcRenderer.on('start-callback', function (e, arg) {
        $msg.innerText = arg.msg;
    });

    ipcRenderer.on('stop-callback', function (e, arg) {
        $msg.innerText = arg.msg;
    });

    $('#start').onclick = function () {
        ipcRenderer.send('start', {
            path: $("#savePath").value
        });
    };

    $('#stop').onclick = function () {
        ipcRenderer.send('stop');
    };

    document.ondragover = document.ondrop = (ev) => {
        ev.preventDefault()
    };

    document.body.ondrop = (ev) => {
        $("#savePath").value = ev.dataTransfer.files[0].path;
        ev.preventDefault()
    }

})();