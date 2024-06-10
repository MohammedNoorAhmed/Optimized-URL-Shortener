// config.js
const config = {
    virusTotal: {
      apiKey: "write your api key here",
      postUrl: "https://www.virustotal.com/api/v3/urls",
      getUrl: (id) => `https://www.virustotal.com/api/v3/analyses/${id}`
    },
    bitly: {
      apiKey: "write your api key here",
      shortenUrl: "https://api-ssl.bitly.com/v4/shorten"
    }
  };
  
  export default config;
  
