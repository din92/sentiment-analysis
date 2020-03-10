"use strict";

var socket = io('http://127.0.0.1:5000/logicio'
/*,{ forceNew: true }*/
);

var __send = function __send(socketObj, endpoint, data, onProgress) {
  return new Promise(function (resolve, reject) {
    var reqId = 'r' + Math.random();
    socketObj.emit(endpoint, {
      reqId: reqId,
      data: data
    });
    socketObj.once(endpoint + ':' + reqId + ':reply', function (data) {
      resolve(data);
      socketObj.off(endpoint + ':' + reqId + ':progress');
    });
    socketObj.on(endpoint + ':' + reqId + ':progress', function (data) {
      // console.log('received progress',data,onProgress)
      if (onProgress) {
        onProgress(data);
      }
    });
    socketObj.once(endpoint + ':' + reqId + ':error', function (data) {
      reject(data, reqId);
      socketObj.off(endpoint + ':' + reqId + ':progress');
    });
  });
};

var send = function send(endpoint, data, onProgress) {
  console.log('sendData->' + endpoint, data);
  return __send(socket, endpoint, data, onProgress);
};