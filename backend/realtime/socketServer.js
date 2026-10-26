
const { Server } = require("socket.io");
const Y = require("yjs");

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
    socket.on("room:join", ({ roomId, userId, username } = {}) => {
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
        userId: typeof userId === "string" ? userId.slice(0, 100) : socket.id,
        username:
          typeof username === "string" && username.trim()
            ? username.trim().slice(0, 50)
            : "Anonymous",
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
