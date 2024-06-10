// config.js
const config = {
    virusTotal: {
      apiKey: "e32d706ddc76727559f6891f49fd915010029cb662eb110a9a1cfc0431a3b568",
      postUrl: "https://www.virustotal.com/api/v3/urls",
      getUrl: (id) => `https://www.virustotal.com/api/v3/analyses/${id}`
    },
    bitly: {
      apiKey: "c46d9bc50d7d73df3acce33edbe612fd6f305f31",
      shortenUrl: "https://api-ssl.bitly.com/v4/shorten"
    }
  };
  
  export default config;
  