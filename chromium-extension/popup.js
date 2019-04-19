var PopupController = function() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, async function(
    tabs
  ) {
    const url = tabs[0].url.match(
      /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
    )[2];
    document.getElementById("url").innerHTML = "URL: " + url;

    const lookupResponse = await fetch(
      "https://iplookup.azurewebsites.net/api/iplookup?host=" +
        url +
        "&code=<API_KEY>",
      { method: "GET" }
    );
    console.log(lookupResponse);

    const ips = await lookupResponse.json();
    console.log(ips);
    document.getElementById("ip").innerHTML = "IP: " + ips;

    document.getElementById("isp").innerHTML = "ISP: ";
    document.getElementById("host").innerHTML = "Host: ";
    document.getElementById("country").innerHTML = "Country: ";

    ips.forEach(ip => getIpInfo(ip));
  });
};

var getIpInfo = async function(ip) {
  const response = await fetch("https://ipinfo.io/" + ip + "?token=<API_KEY>", {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });
  console.log(response);

  const ipinfo = await response.json();
  console.log(ipinfo);

  document.getElementById("isp").innerHTML += ipinfo.org + ", ";
  document.getElementById("host").innerHTML += ipinfo.hostname + ", ";
  document.getElementById("country").innerHTML += ipinfo.country + ", ";
};

PopupController.prototype = {
  /**
   * A cached reference to the url element.
   *
   * @type {Element}
   * @private
   */
  url_: null,

  /**
   * A cached reference to the IP element.
   *
   * @type {Element}
   * @private
   */
  ip_: null,

  /**
   * A cached reference to the ISP element.
   *
   * @type {Element}
   * @private
   */
  isp_: null,

  /**
   * A cached reference to the host element.
   *
   * @type {Element}
   * @private
   */
  host_: null,

  /**
   * A cached reference to the country element.
   *
   * @type {Element}
   * @private
   */
  country_: null
};

document.addEventListener("DOMContentLoaded", function() {
  window.PC = new PopupController();
});
