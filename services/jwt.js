var crypto = require('crypto');

exports.encode = function(payload, secret ) {

  var header = {
    typ: 'JWT',
    alg: 'HS256'
  };

  var jwt = base64Encoding(JSON.stringify(header)) + '.' + base64Encoding(JSON.stringify(payload));
  return jwt + '.' + sign(jwt, secret);
}

function sign(str, key) {
  return crypto.createHmac('sha256', key).update(str).digest('base64');
}

function base64Encoding(str) {
  return Buffer.from(str).toString('base64');
}


function base64Decode(str) {
  return new Buffer(str,'base64').toString();
}



function verify(raw, secret, signature) {
  return signature === sign(raw,secret);
}


exports.decode = function(token,secret ) {
    var tokenArray =  token.split(' ');
    var payload;
    if(tokenArray.length === 2)
        {
    token = tokenArray[1];
        
    var segments = token.split('.');
    if(segments.length !== 3){
        throw new Error("Invalid token structure.");        
    }
    
    var header= JSON.parse(base64Decode(segments[0]));
            payload= JSON.parse(base64Decode(segments[1]));
        }
    
    var rawSignature = segments[0] + '.' + segments[1];
    if( !verify(rawSignature,secret,segments[2])){
        throw new Error("signature verification failed");
    }
    return payload;
};
