// client/scripts/extract-mesh-names.mjs
import { NodeIO } from '@gltf-transform/core';
import fs from 'fs';
import path from 'path';

const io = new NodeIO();
const document = await io.read('./public/models/room.glb');
const root = document.getRoot();

const nodes = root.listNodes();
const meshes = root.listMeshes();
const materials = root.listMaterials();

let output = `# Mesh & Node List — showroom.glb\n\nGenerated: ${new Date().toISOString()}\n\n`;

output += `## Nodes (${nodes.length})\n\n`;
nodes.forEach((n) => {
  output += `- \`${n.getName() || '(unnamed)'}\`\n`;
});

output += `\n## Meshes (${meshes.length})\n\n`;
meshes.forEach((m) => {
  output += `- \`${m.getName() || '(unnamed)'}\`\n`;
});

output += `\n## Materials (${materials.length})\n\n`;
materials.forEach((mat) => {
  output += `- \`${mat.getName() || '(unnamed)'}\`\n`;
});

fs.writeFileSync(path.resolve('./mesh-list-new.md'), output);
console.log('Mesh list written to client/mesh-list.md');