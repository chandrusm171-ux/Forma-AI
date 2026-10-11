
import "dotenv/config";
import dns from "node:dns/promises";
import tls from "node:tls";

const uri = process.env.MONGODB_URI; // Adjust if your variable has another name.

if (!uri) {
  console.error("MongoDB URI environment variable was not found.");
  process.exit(1);
}

function testTls(host, port, version) {
  return new Promise((resolve) => {
    console.log(`Testing ${version}: ${host}:${port}`);

    const socket = tls.connect({
      host,
      port,
      servername: host,
      minVersion: version,
      maxVersion: version,
      rejectUnauthorized: true,
      timeout: 10000,
    });

    let finished = false;

    function finish(result) {
      if (finished) return;
      finished = true;
      socket.destroy();
      resolve(result);
    }

    socket.once("secureConnect", () => {
      console.log(
        `SUCCESS: ${version}, negotiated ${socket.getProtocol()}, ` +
        `certificate authorized: ${socket.authorized}`
      );
      finish(true);
    });

    socket.once("error", (error) => {
      console.log(`FAILED: ${version}, ${error.code}: ${error.message}`);
      finish(false);
    });

    socket.once("timeout", () => {
      console.log(`TIMEOUT: ${version}, ${host}`);
      finish(false);
    });
  });
}

async function main() {
  const url = new URL(uri);
  const nodes = await dns.resolveSrv(
    `_mongodb._tcp.${url.hostname}`
  );

  console.log(`Atlas nodes found: ${nodes.length}`);
  console.log(`Node.js: ${process.version}`);
  console.log(`OpenSSL: ${process.versions.openssl}`);

  for (const node of nodes) {
    for (const version of ["TLSv1.2", "TLSv1.3"]) {
      await testTls(node.name, node.port, version);
    }
  }
}

main().catch((error) => {
  console.error("Diagnostic failed:", error.message);
  process.exitCode = 1;
});
