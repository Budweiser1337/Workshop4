import bodyParser from "body-parser";
import express from "express";
import { REGISTRY_PORT } from "../config";

export type Node = { nodeId: number; pubKey: string };

export type RegisterNodeBody = {
  nodeId: number;
  pubKey: string;
};

export type GetNodeRegistryBody = {
  nodes: Node[];
};

const registeredNodes: Node[] = [];

export async function launchRegistry() {
  const _registry = express();
  _registry.use(express.json());
  _registry.use(bodyParser.json());

  // TODO implement the status route
  _registry.get("/status", (req, res) => {
    res.send("live")
  });

  _registry.post("/registerNode", (req, res) => {
    const { nodeId, pubKey } = req.body as RegisterNodeBody;
    const newNode: Node = { nodeId, pubKey };
    registeredNodes.push(newNode);
    res.json({ success: true });
  });

  _registry.get("/getPrivateKey/:nodeId", (req, res) => {
    const nodeId = parseInt(req.params.nodeId, 10);
    const node = registeredNodes.find((n) => n.nodeId === nodeId);

    if (node) {
      res.json({ result: node.pubKey });
    } else {
      res.status(404).json({ error: "Node not found" });
    }
  });

  _registry.get("/getNodeRegistry", (req, res) => {
    const nodeRegistry: GetNodeRegistryBody = { nodes: registeredNodes };
    res.json(nodeRegistry);
  });

  const server = _registry.listen(REGISTRY_PORT, () => {
    console.log(`registry is listening on port ${REGISTRY_PORT}`);
  });

  return server;
}
