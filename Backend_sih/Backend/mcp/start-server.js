#!/usr/bin/env node

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Start MCP server as a separate process
const serverPath = path.join(__dirname, "server.js");

console.log("Starting MCP Server...");

const serverProcess = spawn("node", [serverPath], {
  stdio: ["pipe", "pipe", "pipe"],
  detached: false,
});

serverProcess.stdout.on("data", (data) => {
  console.log(`MCP Server: ${data}`);
});

serverProcess.stderr.on("data", (data) => {
  console.error(`MCP Server Error: ${data}`);
});

serverProcess.on("close", (code) => {
  console.log(`MCP Server process exited with code ${code}`);
});

serverProcess.on("error", (err) => {
  console.error("Failed to start MCP Server:", err);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down MCP Server...");
  serverProcess.kill("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Shutting down MCP Server...");
  serverProcess.kill("SIGTERM");
  process.exit(0);
});

export default serverProcess;

