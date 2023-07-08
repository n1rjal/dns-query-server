const http = require("http");
const dns = require("dns");
const url = require("url");

const ALL_DNS_ENTRY_TYPES = ["A", "AAAA", "CNAME", "MX", "TXT", "NS"];

const resolveDns = (host, type) => {
  return new Promise((resolve, reject) => {
    switch (type) {
      case "A": {
        dns.resolve4(host, (err, address) => {
          return resolve({
            err,
            address,
          });
        });
        break;
      }
      case "AAAA": {
        dns.resolve6(host, (err, address) => {
          return resolve({
            err,
            address,
          });
        });
        break;
      }

      case "CNAME": {
        dns.resolveCname(host, (err, address) => {
          resolve({
            err,
            address,
          });
        });
        break;
      }

      case "MX": {
        dns.resolveMx(host, (err, address) => {
          return resolve({
            err,
            address,
          });
        });
        break;
      }

      case "TXT": {
        dns.resolveTxt(host, (err, address) => {
          return resolve({
            err,
            address,
          });
        });
        break;
      }

      case "NS": {
        dns.resolveNs(host, (err, address) => {
          resolve({
            err,
            address,
          });
        });
        break;
      }

      default: {
        return resolve({
          err: "Invalid DNS entry type",
        });
      }
    }
  });
};

const handler = async (req, res) => {
  const query = url.parse(req.url, true).query;
  const host = query.host;
  const type = query.type;

  res.setHeader("Content-Type", "application/json");
  if (!host) {
    res.writeHead(400);
    return res.end(
      JSON.stringify({
        error: "host query parameter is required",
      })
    );
  }

  if (!type) {
    res.writeHead(400);
    return res.end(
      JSON.stringify({
        error: `type query parameter is required. Values are one of ${ALL_DNS_ENTRY_TYPES.join(
          ", "
        )}`,
      })
    );
  }

  const { err, address } = await resolveDns(host, type.toUpperCase());

  if (err) {
    res.writeHead(500);
    return res.end(
      JSON.stringify({
        error: err.message,
      })
    );
  } else {
    return res.end(JSON.stringify({ address }));
  }
};

const server = http.createServer(handler);
const PORT = 27777;
const HOST = "0.0.0.0";

server.listen(PORT, HOST, () => {
  console.log(`Listening to server at ${HOST}:${PORT}`);
});
