const config = {
    host: 'bix-tecnologia.us.qlikcloud.com',
    prefix: '/',
    port: '443',
    isSecure: true,
    webIntegrationId: process.env.REACT_APP_BIX_KEY
};

const baseUrl = (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"

async function login() {
    function isLoggedIn() {
        return fetch("https://"+config.host+"/api/v1/users/me", {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'qlik-web-integration-id': config.webIntegrationId,
            },
        }).then(response => {
            return response.status === 200;
        });
    }
    return isLoggedIn().then(loggedIn =>{
        if (!loggedIn) {
            window.location.href = "https://"+config.host+"/login?qlik-web-integration-id=" + config.webIntegrationId + "&returnto=" + window.location.href;
            throw new Error('not logged in');
        }
    });
}



export default new Promise((resolve) => {
    login().then(() => {
        window.require.config({
            baseUrl: baseUrl,
            webIntegrationId: config.webIntegrationId,
            paths:{
                qlik: baseUrl + '/js/qlik',
            }
        });
    
        window.require(["js/qlik"], (qlik) => {
            qlik.on('error', (e) => {
                console.error('Erro na Engine do Qlik:', e)
            })
            console.log('Conexão feita', qlik)
            let app = qlik.openApp(process.env.REACT_APP_APP_ID, config)
            console.log('Aplicativo aberto', app)
            resolve(app)
        })
    })
})