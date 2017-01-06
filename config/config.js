exports.config = function(){
 return {
   getSecret:function(){
    return process.env.apiSecret;
};
};
};