var graph = require('@microsoft/microsoft-graph-client');

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken.accessToken);
    }
  });

  return client;
}

export async function getUserDetails(accessToken) {
  const client = getAuthenticatedClient(accessToken);
  const user = await client.api('/me').get();
  return user;
}

export async function getPhoto(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  var avatar = await new Promise(function (resolve, reject) {
    client.api('/me/photo/$value').get((res)=>{
      if(res.statusCode === 200){
        resolve(client.api('/me/photo/$value').get());
      }
      else{
        resolve(null);
      }
    }).then(console.log, reject);
  });
  return avatar;
}