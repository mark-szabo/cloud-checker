#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using System.Text;

public static async Task<string[]> Run(HttpRequest req, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string host = req.Query["host"];

    List<string> collectedIP = new List<string>();
    IPAddress[] ipaddresses = null;
    if (!string.IsNullOrWhiteSpace(host))
    {
        try
        {
            ipaddresses = Dns.GetHostAddresses(host);
        }
        catch (Exception)
        {
            log.LogInformation("Did not resolve IP from: " + host);
        }

        if (ipaddresses != null)
        {
            // Multiple IPs could be returned for a record
            foreach (IPAddress ip in ipaddresses)
            {
                log.LogInformation("Resolved " + host + " to " + ip.ToString());
                // Add the resolved IP to the list
                collectedIP.Add(ip.ToString());
            }
        }
    }
    else
    {
        log.LogInformation("No IP passed In");
    }

    // Return the string list as an array to the calling entity
    return collectedIP.Distinct().ToArray();
}
