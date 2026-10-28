
const { Server } = require("socket.io");
const Y = require("yjs");
const { verifyToken } = require("../utils/authTokens");

function createSocketServer(httpServer) {
  const allowedOrigin =
    process.env.FRONTEND_ORIGIN || "http://localhost:5173";

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigin,
      methods: ["GET", "POST"],
    },
  });

  const rooms = new Map();

  // Every realtime connection must present a valid signed session token.
  // User identity is derived from the token, never from client-supplied userId.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    try {
      const user = verifyToken(token);
      if (!user) return next(new Error("Authentication required"));
      socket.data.user = user;
      return next();
    } catch {
      return next(new Error("Realtime authentication is not configured"));
    }
  });

  function getRoomDocument(roomId) {
    if (!rooms.has(roomId)) {
      const doc = new Y.Doc();
      rooms.set(roomId, { doc, users: new Map() });
    }

    return rooms.get(roomId);
  }

  function emitUsers(roomId) {
    const room = rooms.get(roomId);
    if (!room) return;

    io.to(roomId).emit(
      "room:users",
      Array.from(room.users.values())
    );
  }

  function leaveRoom(socket) {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);

    socket.leave(roomId);
    socket.data.roomId = null;

    if (room) {
      room.users.delete(socket.id);
      emitUsers(roomId);

      if (room.users.size === 0) {
        room.doc.destroy();
        rooms.delete(roomId);
      }
    }
  }

  io.on("connection", (socket) => {
    socket.on("room:join", ({ roomId, username } = {}) => {
      if (
        typeof roomId !== "string" ||
        roomId.trim().length === 0 ||
        roomId.length > 100
      ) {
        socket.emit("room:error", { message: "Invalid roomId" });
        return;
      }

      leaveRoom(socket);

      const normalizedRoomId = roomId.trim();
      const room = getRoomDocument(normalizedRoomId);

      socket.join(normalizedRoomId);
      socket.data.roomId = normalizedRoomId;

      room.users.set(socket.id, {
        socketId: socket.id,
        userId: socket.data.user.id,
        username:
          typeof username === "string" && username.trim()
            ? username.trim().slice(0, 50)
            : (socket.data.user.email || "Signed-in user").slice(0, 50),
      });

      socket.emit("document:sync", {
        update: Y.encodeStateAsUpdate(room.doc),
      });

      emitUsers(normalizedRoomId);
    });

    socket.on("cursor:move", ({ x, y } = {}) => {
      const roomId = socket.data.roomId;

      if (
        !roomId ||
        !Number.isFinite(x) ||
        !Number.isFinite(y)
      ) {
        return;
      }

      socket.to(roomId).emit("cursor:update", {
        socketId: socket.id,
        x,
        y,
      });
    });

    socket.on("document:update", (update) => {
      const roomId = socket.data.roomId;
      if (!roomId) return;

      const room = rooms.get(roomId);
      if (!room) return;

      try {
        const bytes =
          update instanceof ArrayBuffer
            ? new Uint8Array(update)
            : ArrayBuffer.isView(update)
              ? new Uint8Array(
                  update.buffer,
                  update.byteOffset,
                  update.byteLength
                )
              : null;

        if (!bytes || bytes.byteLength === 0) {
          socket.emit("room:error", {
            message: "Invalid document update",
          });
          return;
        }

        Y.applyUpdate(room.doc, bytes);

        socket.to(roomId).emit("document:update", bytes);
      } catch {
        socket.emit("room:error", {
          message: "Could not apply document update",
        });
      }
    });

    socket.on("room:leave", () => leaveRoom(socket));

    socket.on("disconnect", () => leaveRoom(socket));
  });

  return io;
}

module.exports = { createSocketServer };
