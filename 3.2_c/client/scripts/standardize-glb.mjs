import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { metalRough } from '@gltf-transform/functions';
import fs from 'fs';

const INPUT_FILE = './public/models/Hospital_Room_2.glb'; 
const OUTPUT_FILE = './public/models/Hospital_Room_2_converted.glb';

async function convertModel() {
  // initialize NodeIO and register the legacy extension
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);

  console.log("Reading asset...");
  const doc = await io.read(INPUT_FILE);

  console.log("Converting...");
  await doc.transform(metalRough());

  // output the standardized GLB file
  const glbBuffer = await io.writeBinary(doc);
  fs.writeFileSync(OUTPUT_FILE, glbBuffer);
  
  console.log(`Clean model saved to: ${OUTPUT_FILE}`);
}

convertModel().catch(console.error);
