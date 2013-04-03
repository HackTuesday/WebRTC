$(function() {
  var brokerSession = null;
  var brokerUrl = 'http://wrtcb.jit.su:80';
  var hosting = true;
  var options;

  // make a connection
  console.log('broker', brokerUrl);
  var peer = new Peer(brokerUrl, {video: false, audio: false});
  window.connections = {};
  
  peer.onconnection = function(connection) {
    console.log('connected: ' + connection.id);
    connections[connection.id] = connection;
    connection.ondisconnect = function() {
      console.log('disconnected: ' + connection.id);
      delete connections[connection.id];
    };
    connection.onerror = function(error) {
      console.error(error);
    };

    connection.onmessage = function(label, msg) {
      $("ul").append("<li>" + msg.data + "</li>");
    };
  };

  peer.onerror = function(error) {
    console.error(error);
  };

  peer.onroute = function(route) {
    console.log('route ' + route);
    $("#route").val(route);
  }

  $("#host").click(function() {
    console.log('hosting');
    peer.listen({metadata:{name:'data-demo'}});
  });

  $("#client").click(function(){
    console.log('client');
    peer.connect( $("#route").val() );
  });

  $("#sendtext").submit(function() {
    var send = $("#send").val();

    $("ul").append("<li>" + send + "</li>");

    var ids = Object.keys(connections);
    ids.forEach(function(id) {
      connections[id].send('reliable', send);
    });



    $("#send").val("");
    return false;
  });

  // close open connections
  window.onbeforeunload = function() {
    var ids = Object.keys(connections);
    ids.forEach(function(id) {
      connections[id].close();
    });
    peer.close();
  };
});
