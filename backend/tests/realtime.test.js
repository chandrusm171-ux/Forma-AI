
const { test } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { io: createClient } = require("socket.io-client");
const Y = require("yjs");
process.env.AUTH_TOKEN_SECRET = "test-secret-for-forma-ai-realtime-suite-32chars-minimum";
const { signToken } = require("../utils/authTokens");
const { createSocketServer } = require("../realtime/socketServer");

async function createTestServer() {
  const httpServer = http.createServer();
  const io = createSocketServer(httpServer);

  await new Promise((resolve) => {
    httpServer.listen(0, "127.0.0.1", resolve);
  });

  const address = httpServer.address();
  const url = `http://127.0.0.1:${address.port}`;

  return {
    io,
    url,
    async close() {
      await new Promise((resolve) => io.close(resolve));
    },
  };
}

function connectClient(url) {
  return new Promise((resolve, reject) => {
    const token = signToken({ _id: "test-user", email: "tester@example.com", role: "user" });
    const socket = createClient(url, {
      auth: { token },
      transports: ["websocket"],
      reconnection: false,
      timeout: 3000,
    });

    socket.once("connect", () => resolve(socket));
    socket.once("connect_error", reject);
  });
}

function waitForEvent(socket, eventName, timeoutMs = 2000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off(eventName, handler);
      reject(new Error(`Timed out waiting for ${eventName}`));
    }, timeoutMs);

    function handler(data) {
      clearTimeout(timer);
      resolve(data);
    }

    socket.once(eventName, handler);
  });
}

test("isolates cursor updates between rooms", async () => {
  const server = await createTestServer();
  let first;
  let second;

  try {
    first = await connectClient(server.url);
    second = await connectClient(server.url);

    first.emit("room:join", { roomId: "team-a", username: "Alice" });
    second.emit("room:join", { roomId: "team-b", username: "Bob" });

    await waitForEvent(first, "document:sync");
    await waitForEvent(second, "document:sync");

    let received = false;
    second.on("cursor:update", () => {
      received = true;
    });

    first.emit("cursor:move", { x: 20, y: 40 });

    await new Promise((resolve) => setTimeout(resolve, 150));
    assert.equal(received, false);
  } finally {
    first?.disconnect();
    second?.disconnect();
    await server.close();
  }
});

test("broadcasts cursor updates to members of the same room", async () => {
  const server = await createTestServer();
  let first;
  let second;

  try {
    first = await connectClient(server.url);
    second = await connectClient(server.url);

    first.emit("room:join", { roomId: "shared-room", username: "Alice" });
    await waitForEvent(first, "document:sync");

    second.emit("room:join", { roomId: "shared-room", username: "Bob" });
    await waitForEvent(second, "document:sync");

    const updatePromise = waitForEvent(first, "cursor:update");
    second.emit("cursor:move", { x: 12, y: 34 });

    const update = await updatePromise;
    assert.equal(update.x, 12);
    assert.equal(update.y, 34);
    assert.equal(update.socketId, second.id);
  } finally {
    first?.disconnect();
    second?.disconnect();
    await server.close();
  }
});

test("synchronizes Yjs document updates within the same room", async () => {
  const server = await createTestServer();
  let first;
  let second;

  try {
    first = await connectClient(server.url);
    second = await connectClient(server.url);

    first.emit("room:join", { roomId: "document-room" });
    await waitForEvent(first, "document:sync");

    second.emit("room:join", { roomId: "document-room" });
    await waitForEvent(second, "document:sync");

    const receivedUpdate = waitForEvent(second, "document:update");

    const document = new Y.Doc();
    document.getText("content").insert(0, "Hello Forma-AI");

    first.emit("document:update", Y.encodeStateAsUpdate(document));

    const update = await receivedUpdate;
    const remoteDocument = new Y.Doc();
    Y.applyUpdate(remoteDocument, update);

    assert.equal(remoteDocument.getText("content").toString(), "Hello Forma-AI");

    document.destroy();
    remoteDocument.destroy();
  } finally {
    first?.disconnect();
    second?.disconnect();
    await server.close();
  }
});

test("rejects invalid document updates without crashing", async () => {
  const server = await createTestServer();
  let client;

  try {
    client = await connectClient(server.url);
    client.emit("room:join", { roomId: "validation-room" });
    await waitForEvent(client, "document:sync");

    const errorPromise = waitForEvent(client, "room:error");
    client.emit("document:update", { invalid: true });

    const error = await errorPromise;
    assert.equal(error.message, "Invalid document update");
  } finally {
    client?.disconnect();
    await server.close();
  }
});

test("isolates Yjs document updates between rooms", async () => {
  const server = await createTestServer();
  let first;
  let second;

  try {
    first = await connectClient(server.url);
    second = await connectClient(server.url);

    const firstSync = waitForEvent(first, "document:sync");
    first.emit("room:join", { roomId: "document-team-a" });
    await firstSync;

    const secondSync = waitForEvent(second, "document:sync");
    second.emit("room:join", { roomId: "document-team-b" });
    const snapshot = await secondSync;

    const receivedForeignUpdate = new Promise((resolve) => {
      second.once("document:update", resolve);
    });

    const document = new Y.Doc();
    document.getText("content").insert(0, "Private team A data");

    first.emit("document:update", Y.encodeStateAsUpdate(document));

    const result = await Promise.race([
      receivedForeignUpdate.then(() => true),
      new Promise((resolve) => setTimeout(() => resolve(false), 200)),
    ]);

    assert.equal(result, false);

    const remoteDocument = new Y.Doc();
    Y.applyUpdate(remoteDocument, snapshot.update);
    assert.equal(remoteDocument.getText("content").toString(), "");

    document.destroy();
    remoteDocument.destroy();
  } finally {
    first?.disconnect();
    second?.disconnect();
    await server.close();
  }
});
