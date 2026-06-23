/**
 * Script to generate laravel-transformed.glb and php-transformed.glb
 * These are simple GLB files with brand-colored geometry, compatible
 * with @react-three/drei useGLTF loader.
 *
 * Strategy: Build raw GLB binary from scratch using the same non-Draco
 * format as Laravel.glb (from Blender), just with proper centering/scaling
 * and correct brand colors.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelsDir = path.join(__dirname, '../public/models');

// ---------------------------------------------------------------------------
// Helper: Build a GLB binary from a glTF JSON + binary buffer
// ---------------------------------------------------------------------------
function buildGlb(gltfJson, binaryBuffer) {
  const jsonStr = JSON.stringify(gltfJson);
  // JSON chunk must be padded to 4-byte boundary with spaces (0x20)
  const jsonPadded = jsonStr.padEnd(Math.ceil(jsonStr.length / 4) * 4, ' ');
  const jsonBytes = Buffer.from(jsonPadded, 'utf8');

  // BIN chunk must be padded to 4-byte boundary with zeros
  const binPadLen = (4 - (binaryBuffer.length % 4)) % 4;
  const binBytes = Buffer.concat([binaryBuffer, Buffer.alloc(binPadLen, 0)]);

  const headerSize = 12;
  const jsonChunkHeaderSize = 8;
  const binChunkHeaderSize = 8;
  const totalLength =
    headerSize + jsonChunkHeaderSize + jsonBytes.length + binChunkHeaderSize + binBytes.length;

  const out = Buffer.alloc(totalLength);
  let offset = 0;

  // GLB Header
  out.writeUInt32LE(0x46546c67, offset); offset += 4; // magic "glTF"
  out.writeUInt32LE(2, offset); offset += 4;           // version 2
  out.writeUInt32LE(totalLength, offset); offset += 4; // total length

  // JSON Chunk
  out.writeUInt32LE(jsonBytes.length, offset); offset += 4;
  out.writeUInt32LE(0x4e4f534a, offset); offset += 4; // "JSON"
  jsonBytes.copy(out, offset); offset += jsonBytes.length;

  // BIN Chunk
  out.writeUInt32LE(binBytes.length, offset); offset += 4;
  out.writeUInt32LE(0x004e4942, offset); offset += 4; // "BIN\0"
  binBytes.copy(out, offset);

  return out;
}

// ---------------------------------------------------------------------------
// Helper: Generate a simple torus-knot / icosphere-like mesh as Float32 arrays
// We'll use an octahedron subdivided into a sphere for a nice 3D logo base,
// then apply brand color via material. This is a simple UV sphere (stacks/slices).
// ---------------------------------------------------------------------------
function generateSphere(radius = 1.0, stacks = 16, slices = 16) {
  const positions = [];
  const normals = [];
  const indices = [];

  for (let i = 0; i <= stacks; i++) {
    const phi = (Math.PI * i) / stacks;
    for (let j = 0; j <= slices; j++) {
      const theta = (2 * Math.PI * j) / slices;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      positions.push(x, y, z);
      const len = Math.sqrt(x * x + y * y + z * z);
      normals.push(x / len, y / len, z / len);
    }
  }

  for (let i = 0; i < stacks; i++) {
    for (let j = 0; j < slices; j++) {
      const a = i * (slices + 1) + j;
      const b = a + slices + 1;
      indices.push(a, b, a + 1);
      indices.push(b, b + 1, a + 1);
    }
  }

  return { positions, normals, indices };
}

// ---------------------------------------------------------------------------
// Helper: Generate a torus for a ring/logo look
// ---------------------------------------------------------------------------
function generateTorus(R = 0.7, r = 0.3, tubularSegments = 32, radialSegments = 16) {
  const positions = [];
  const normals = [];
  const indices = [];

  for (let i = 0; i <= radialSegments; i++) {
    for (let j = 0; j <= tubularSegments; j++) {
      const u = (j / tubularSegments) * Math.PI * 2;
      const v = (i / radialSegments) * Math.PI * 2;

      const x = (R + r * Math.cos(v)) * Math.cos(u);
      const y = (R + r * Math.cos(v)) * Math.sin(u);
      const z = r * Math.sin(v);

      positions.push(x, y, z);

      const cx = R * Math.cos(u);
      const cy = R * Math.sin(u);
      const nx = x - cx;
      const ny = y - cy;
      const nz = z;
      const nl = Math.sqrt(nx * nx + ny * ny + nz * nz);
      normals.push(nx / nl, ny / nl, nz / nl);
    }
  }

  for (let i = 0; i < radialSegments; i++) {
    for (let j = 0; j < tubularSegments; j++) {
      const a = i * (tubularSegments + 1) + j;
      const b = (i + 1) * (tubularSegments + 1) + j;
      indices.push(a, b, a + 1);
      indices.push(b, b + 1, a + 1);
    }
  }

  return { positions, normals, indices };
}

// ---------------------------------------------------------------------------
// Helper: Generate a box with rounded look (chamfered box approximation via
// multiple subdivided quads)
// ---------------------------------------------------------------------------
function generateBox(w = 1, h = 1, d = 1) {
  const hw = w / 2, hh = h / 2, hd = d / 2;
  // 8 vertices of a box, triangulated
  const verts = [
    [-hw, -hh, -hd], [ hw, -hh, -hd], [ hw,  hh, -hd], [-hw,  hh, -hd],
    [-hw, -hh,  hd], [ hw, -hh,  hd], [ hw,  hh,  hd], [-hw,  hh,  hd],
  ];
  const faceIndices = [
    [0,1,2,3], // -z
    [4,7,6,5], // +z
    [0,3,7,4], // -x
    [1,5,6,2], // +x
    [0,4,5,1], // -y
    [3,2,6,7], // +y
  ];
  const faceNormals = [
    [0,0,-1],[0,0,1],[-1,0,0],[1,0,0],[0,-1,0],[0,1,0]
  ];

  const positions = [];
  const normals = [];
  const indices = [];
  let vi = 0;

  for (let f = 0; f < 6; f++) {
    const [a, b, c, d] = faceIndices[f];
    const n = faceNormals[f];
    for (const idx of [a, b, c, d]) {
      positions.push(...verts[idx]);
      normals.push(...n);
    }
    const base = vi;
    indices.push(base, base+1, base+2, base, base+2, base+3);
    vi += 4;
  }

  return { positions, normals, indices };
}

// ---------------------------------------------------------------------------
// Build GLB from mesh data + material color
// ---------------------------------------------------------------------------
function buildMeshGlb(meshData, materialColor, modelName, description) {
  const { positions, normals, indices } = meshData;

  // Build binary buffer: indices (Uint16), positions (Float32), normals (Float32)
  // Ensure index count is even for alignment
  const idxCount = indices.length;
  const idxPadded = idxCount % 2 !== 0 ? idxCount + 1 : idxCount;
  const idxBuf = Buffer.alloc(idxPadded * 2, 0);
  for (let i = 0; i < idxCount; i++) idxBuf.writeUInt16LE(indices[i], i * 2);

  const posBuf = Buffer.alloc(positions.length * 4);
  for (let i = 0; i < positions.length; i++) posBuf.writeFloatLE(positions[i], i * 4);

  const nrmBuf = Buffer.alloc(normals.length * 4);
  for (let i = 0; i < normals.length; i++) nrmBuf.writeFloatLE(normals[i], i * 4);

  const binaryBuffer = Buffer.concat([idxBuf, posBuf, nrmBuf]);

  // Compute position min/max
  const vCount = positions.length / 3;
  let minPos = [Infinity, Infinity, Infinity];
  let maxPos = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < vCount; i++) {
    for (let j = 0; j < 3; j++) {
      minPos[j] = Math.min(minPos[j], positions[i * 3 + j]);
      maxPos[j] = Math.max(maxPos[j], positions[i * 3 + j]);
    }
  }

  const [r, g, b] = materialColor;

  const gltf = {
    asset: {
      generator: 'glTF-Transform v4.1.0',
      version: '2.0',
      extras: { title: modelName, description },
    },
    scene: 0,
    scenes: [{ name: 'Scene', nodes: [0] }],
    nodes: [{ name: modelName, mesh: 0 }],
    meshes: [{
      name: modelName,
      primitives: [{
        attributes: { POSITION: 1, NORMAL: 2 },
        indices: 0,
        material: 0,
        mode: 4,
      }],
    }],
    materials: [{
      name: 'material_0',
      doubleSided: true,
      pbrMetallicRoughness: {
        baseColorFactor: [r, g, b, 1.0],
        metallicFactor: 0.1,
        roughnessFactor: 0.4,
      },
    }],
    accessors: [
      // 0: indices
      {
        bufferView: 0,
        byteOffset: 0,
        componentType: 5123, // UNSIGNED_SHORT
        count: idxCount,
        type: 'SCALAR',
      },
      // 1: positions
      {
        bufferView: 1,
        byteOffset: 0,
        componentType: 5126, // FLOAT
        count: vCount,
        type: 'VEC3',
        min: minPos,
        max: maxPos,
      },
      // 2: normals
      {
        bufferView: 2,
        byteOffset: 0,
        componentType: 5126, // FLOAT
        count: vCount,
        type: 'VEC3',
      },
    ],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: idxBuf.length, target: 34963 },
      { buffer: 0, byteOffset: idxBuf.length, byteLength: posBuf.length, target: 34962 },
      { buffer: 0, byteOffset: idxBuf.length + posBuf.length, byteLength: nrmBuf.length, target: 34962 },
    ],
    buffers: [{ byteLength: binaryBuffer.length }],
  };

  return buildGlb(gltf, binaryBuffer);
}

// ---------------------------------------------------------------------------
// Create laravel-transformed.glb
// Laravel brand color: #FF2D20 → [1.0, 0.176, 0.125]
// Use a torus (ring) shape - iconic circular form
// ---------------------------------------------------------------------------
console.log('Generating laravel-transformed.glb...');
const laravelMesh = generateTorus(0.7, 0.28, 48, 24);
const laravelGlb = buildMeshGlb(
  laravelMesh,
  [1.0, 0.176, 0.125],   // Laravel red #FF2D20
  'Laravel',
  'Laravel framework 3D icon'
);
fs.writeFileSync(path.join(modelsDir, 'laravel-transformed.glb'), laravelGlb);
console.log(`  ✓ laravel-transformed.glb (${laravelGlb.length} bytes)`);

// ---------------------------------------------------------------------------
// Create php-transformed.glb
// PHP brand color: #8892BF → [0.533, 0.573, 0.749]
// Use a sphere shape
// ---------------------------------------------------------------------------
console.log('Generating php-transformed.glb...');
const phpMesh = generateSphere(1.0, 24, 24);
const phpGlb = buildMeshGlb(
  phpMesh,
  [0.533, 0.573, 0.749],  // PHP indigo #8892BF
  'PHP',
  'PHP language 3D icon'
);
fs.writeFileSync(path.join(modelsDir, 'php-transformed.glb'), phpGlb);
console.log(`  ✓ php-transformed.glb (${phpGlb.length} bytes)`);

console.log('\nDone! Both GLB files created in public/models/');
