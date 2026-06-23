/**
 * Generate laravel-transformed.glb and php-transformed.glb
 * by manually parsing SVG path data and extruding it with Three.js.
 * Preserves SVG scale and multi-color features.
 *
 * Run with: node scripts/create-logo-glbs.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

// Polyfill DOMParser for Node.js
const { DOMParser, XMLSerializer } = new JSDOM('').window;
global.DOMParser = DOMParser;
global.XMLSerializer = XMLSerializer;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelsDir = path.join(__dirname, '../public/models');

function buildGlb(gltfJson, binaryBuffer) {
  const jsonStr = JSON.stringify(gltfJson);
  const jsonPadded = jsonStr.padEnd(Math.ceil(jsonStr.length / 4) * 4, ' ');
  const jsonBytes = Buffer.from(jsonPadded, 'utf8');
  const binPadLen = (4 - (binaryBuffer.length % 4)) % 4;
  const binBytes = Buffer.concat([binaryBuffer, Buffer.alloc(binPadLen, 0)]);
  const totalLength = 12 + 8 + jsonBytes.length + 8 + binBytes.length;
  const out = Buffer.alloc(totalLength);
  let o = 0;
  out.writeUInt32LE(0x46546c67, o); o += 4;
  out.writeUInt32LE(2, o); o += 4;
  out.writeUInt32LE(totalLength, o); o += 4;
  out.writeUInt32LE(jsonBytes.length, o); o += 4;
  out.writeUInt32LE(0x4e4f534a, o); o += 4;
  jsonBytes.copy(out, o); o += jsonBytes.length;
  out.writeUInt32LE(binBytes.length, o); o += 4;
  out.writeUInt32LE(0x004e4942, o); o += 4;
  binBytes.copy(out, o);
  return out;
}

// items is an array of { geometry, color: [r,g,b] }
function buildGlbFromGeometries(items, modelName) {
  let totalIdxCount = 0;
  let totalVCount = 0;

  // Process geometries
  const processed = items.map(item => {
    const nonIndexed = item.geometry.toNonIndexed();
    nonIndexed.computeVertexNormals();
    const vCount = nonIndexed.getAttribute('position').count;
    totalVCount += vCount;
    totalIdxCount += vCount;
    return {
      geo: nonIndexed,
      vCount,
      color: item.color
    };
  });

  const idxPad = totalIdxCount % 2 !== 0 ? totalIdxCount + 1 : totalIdxCount;
  const idxBuf = Buffer.alloc(idxPad * 2, 0);
  const posBuf = Buffer.alloc(totalVCount * 12, 0);
  const nrmBuf = Buffer.alloc(totalVCount * 12, 0);

  const gltf = {
    asset: { generator: 'glTF-Transform v4.1.0', version: '2.0' },
    scene: 0,
    scenes: [{ name: 'Scene', nodes: [] }],
    nodes: [],
    meshes: [],
    materials: [],
    accessors: [],
    bufferViews: [],
    buffers: []
  };

  let idxOffset = 0;
  let vOffset = 0;
  let accIndex = 0;

  processed.forEach((item, i) => {
    const { geo, vCount, color } = item;
    const posAttr = geo.getAttribute('position');
    const nrmAttr = geo.getAttribute('normal');

    let minPos = [Infinity, Infinity, Infinity];
    let maxPos = [-Infinity, -Infinity, -Infinity];

    for (let j = 0; j < vCount; j++) {
      idxBuf.writeUInt16LE(j, (idxOffset + j) * 2);

      const x = posAttr.getX(j), y = posAttr.getY(j), z = posAttr.getZ(j);
      posBuf.writeFloatLE(x, (vOffset + j) * 12);
      posBuf.writeFloatLE(y, (vOffset + j) * 12 + 4);
      posBuf.writeFloatLE(z, (vOffset + j) * 12 + 8);
      
      minPos[0] = Math.min(minPos[0], x);
      minPos[1] = Math.min(minPos[1], y);
      minPos[2] = Math.min(minPos[2], z);
      maxPos[0] = Math.max(maxPos[0], x);
      maxPos[1] = Math.max(maxPos[1], y);
      maxPos[2] = Math.max(maxPos[2], z);

      nrmBuf.writeFloatLE(nrmAttr.getX(j), (vOffset + j) * 12);
      nrmBuf.writeFloatLE(nrmAttr.getY(j), (vOffset + j) * 12 + 4);
      nrmBuf.writeFloatLE(nrmAttr.getZ(j), (vOffset + j) * 12 + 8);
    }

    gltf.materials.push({
      name: `mat_${i}`,
      doubleSided: true,
      pbrMetallicRoughness: {
        baseColorFactor: [...color, 1],
        metallicFactor: 0.1,
        roughnessFactor: 0.4
      }
    });

    const idxAcc = accIndex++;
    const posAcc = accIndex++;
    const nrmAcc = accIndex++;

    gltf.accessors.push(
      { bufferView: 0, byteOffset: idxOffset * 2, componentType: 5123, count: vCount, type: 'SCALAR' },
      { bufferView: 1, byteOffset: vOffset * 12, componentType: 5126, count: vCount, type: 'VEC3', min: minPos, max: maxPos },
      { bufferView: 2, byteOffset: vOffset * 12, componentType: 5126, count: vCount, type: 'VEC3' }
    );

    gltf.meshes.push({
      name: `${modelName}_mesh_${i}`,
      primitives: [{ attributes: { POSITION: posAcc, NORMAL: nrmAcc }, indices: idxAcc, material: i, mode: 4 }]
    });

    gltf.nodes.push({ name: `${modelName}_node_${i}`, mesh: i });
    gltf.scenes[0].nodes.push(i);

    idxOffset += vCount;
    vOffset += vCount;
  });

  const binaryBuffer = Buffer.concat([idxBuf, posBuf, nrmBuf]);

  gltf.bufferViews.push(
    { buffer: 0, byteOffset: 0, byteLength: idxBuf.length, target: 34963 },
    { buffer: 0, byteOffset: idxBuf.length, byteLength: posBuf.length, target: 34962 },
    { buffer: 0, byteOffset: idxBuf.length + posBuf.length, byteLength: nrmBuf.length, target: 34962 }
  );
  gltf.buffers.push({ byteLength: binaryBuffer.length });

  console.log(`  ${modelName}: ${totalVCount} vertices total, ${processed.length} parts`);
  return buildGlb(gltf, binaryBuffer);
}

function svgToGeometries(svgString, extrudeDepth = 10) {
  const loader = new SVGLoader();
  const svgData = loader.parse(svgString);

  const extrudeSettings = {
    depth: extrudeDepth,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 2,
    curveSegments: 4,
  };

  const items = [];
  
  // Calculate bounding box across all shapes to center them
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  let pathIndex = 0;
  for (const svgPath of svgData.paths) {
    const shapes = SVGLoader.createShapes(svgPath);
    
    // Convert THREE.Color to [r,g,b]
    const color = svgPath.color.toArray();
    
    // Is inner path (like PHP letters)
    const isInner = pathIndex > 0;
    const settings = {
      ...extrudeSettings,
      depth: isInner ? extrudeDepth * 1.5 : extrudeDepth
    };

    for (const shape of shapes) {
      try {
        const geo = new THREE.ExtrudeGeometry(shape, settings);
        if (isInner) {
          geo.translate(0, 0, extrudeDepth * 0.25);
        }
        
        geo.computeBoundingBox();
        const b = geo.boundingBox;
        minX = Math.min(minX, b.min.x); minY = Math.min(minY, b.min.y);
        maxX = Math.max(maxX, b.max.x); maxY = Math.max(maxY, b.max.y);
        
        items.push({ geometry: geo, color });
      } catch (e) { /* skip */ }
    }
    pathIndex++;
  }

  // Center all geometries based on global bounding box
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  
  // Normalize to 2-unit max dimension
  const maxDim = Math.max(maxX - minX, maxY - minY);
  const scale = 2.0 / maxDim;

  items.forEach(item => {
    item.geometry.translate(-cx, -cy, 0);
    // Flip Y to match 3D space, and scale to normalize size
    item.geometry.scale(scale, -scale, scale);
  });

  return items;
}

const laravelSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path fill="#f0513f" d="M27.271.11c-.2.078-5.82 3.28-12.487 7.112-8.078 4.644-12.227 7.09-12.449 7.32-.19.225-.34.482-.438.76-.167.564-.179 82.985-.01 83.578.061.23.26.568.44.754.436.46 48.664 28.19 49.25 28.324.272.065.577.054.88-.03.658-.165 48.76-27.834 49.188-28.286.175-.195.375-.532.44-.761.084-.273.115-4.58.115-13.655v-13.26l11.726-6.735c11.056-6.357 11.733-6.755 12.017-7.191l.29-.47V43.287c0-15.548.03-14.673-.585-15.235-.165-.146-5.798-3.433-12.53-7.31L100.89 13.71h-1.359l-11.963 6.87c-6.586 3.788-12.184 7.027-12.457 7.203-.272.18-.597.512-.73.753l-.242.417-.054 13.455-.048 13.46-9.879 5.69c-5.434 3.124-9.957 5.71-10.053 5.734-.175.049-.187-1.232-.187-25.966V15.293l-.26-.447c-.326-.545 1.136.324-13.544-8.114C27.803-.348 28.098-.2 27.27.11zm11.317 10.307c5.15 2.955 9.364 5.4 9.364 5.43 0 .031-4.516 2.641-10.035 5.813l-10.041 5.765-10.023-5.764c-5.507-3.173-10.02-5.783-10.02-5.814 0-.03 4.505-2.64 10.013-5.805l9.999-5.752.69.376c3.357 1.907 6.708 3.824 10.053 5.751zm71.668 13.261c5.422 3.122 9.908 5.702 9.95 5.744.114.103-19.774 11.535-20.046 11.523-.272-.008-19.915-11.335-19.907-11.473.01-.157 19.773-11.527 19.973-11.496.091.022 4.607 2.59 10.03 5.702zM16.3 25.328l9.558 5.503.055 27.247.05 27.252.233.368c.122.194.352.459.52.581.158.115 5.477 3.146 11.818 6.724l11.52 6.506v11.527c0 6.326-.043 11.516-.097 11.516-.041 0-10-5.699-22.124-12.676L5.793 97.201l-.03-38.966-.019-38.954.49.271c.283.15 4.807 2.748 10.065 5.775zm33.754 19.18v25.109l-.387.253c-.525.332-19.667 11.335-19.732 11.335-.03 0-.054-11.336-.054-25.193l.012-25.182 10-5.752c5.499-3.165 10.034-5.733 10.088-5.714.039.024.073 11.34.073 25.144zm38.15-5.775 10.023 5.763V55.92c0 10.838-.011 11.42-.176 11.357-.107-.041-4.642-2.64-10.083-5.774l-9.91-5.69v-11.42c0-6.287.032-11.424.062-11.424.043 0 4.577 2.592 10.084 5.764zm34.164 5.587c0 6.254-.042 11.412-.084 11.462-.072.115-19.896 11.538-20.022 11.538-.031 0-.062-5.135-.062-11.423v-11.42l10-5.756c5.507-3.16 10.042-5.752 10.084-5.752.053 0 .084 5.105.084 11.351zM95.993 70.933 52.005 96.04 32.056 84.693S76 59.277 76.176 59.343zm2.215 14.827-.034 11.442-22.028 12.676c-12.12 6.976-22.082 12.675-22.132 12.675-.053 0-.095-4.658-.095-11.516V99.51l22.08-12.592c12.132-6.923 22.101-12.59 22.154-12.602.043 0 .062 5.148.054 11.443z"/></svg>`;

const phpSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<ellipse cx="64" cy="64" rx="61.5" ry="31.167" fill="#777bb3"/>
<path fill="#fff" d="M34.19 55.826h3.891c3.107 0 4.186.682 4.553 1.089.607.674.723 2.097.331 4.112-.439 2.257-1.253 3.858-2.42 4.756-1.194.92-3.138 1.386-5.773 1.386h-2.786l2.205-11.342zm6.674-8.1H26.731a1.39 1.39 0 0 0-1.364 1.123L18.81 82.588a1.39 1.39 0 0 0 1.363 1.653h7.35a1.39 1.39 0 0 0 1.363-1.124l1.525-7.846h5.151c2.912 0 5.364-.318 7.287-.944 1.977-.642 3.796-1.731 5.406-3.237a16.522 16.522 0 0 0 3.259-4.087c.831-1.487 1.429-3.147 1.775-4.931.86-4.423.161-7.964-2.076-10.524-2.216-2.537-5.698-3.823-10.349-3.823z"/>
<path fill="#fff" d="M65.31 38.755h-7.291a1.39 1.39 0 0 0-1.364 1.124l-6.557 33.738a1.39 1.39 0 0 0 1.363 1.654h7.291a1.39 1.39 0 0 0 1.364-1.124l3.537-18.205h4.682c2.168 0 2.624.463 2.641.484.132.14.305.795.019 2.264l-2.9 14.927a1.39 1.39 0 0 0 1.364 1.654h7.408a1.39 1.39 0 0 0 1.363-1.124l3.051-15.7c.715-3.686.103-6.45-1.82-8.217-1.836-1.686-4.91-2.505-9.398-2.505h-4.81l1.421-7.315a1.39 1.39 0 0 0-1.364-1.655z"/>
<path fill="#fff" d="M91.555 55.826h3.891c3.107 0 4.186.682 4.552 1.089.61.674.724 2.097.333 4.112-.44 2.257-1.254 3.858-2.421 4.756-1.195.92-3.139 1.386-5.773 1.386h-2.786l2.204-11.342zm6.674-8.1H84.096a1.39 1.39 0 0 0-1.363 1.123l-6.558 33.739a1.39 1.39 0 0 0 1.364 1.653h7.35a1.39 1.39 0 0 0 1.363-1.124l1.525-7.846h5.15c2.911 0 5.364-.318 7.286-.944 1.978-.642 3.797-1.731 5.408-3.238a16.52 16.52 0 0 0 3.258-4.086c.832-1.487 1.428-3.147 1.775-4.931.86-4.423.162-7.964-2.076-10.524-2.216-2.537-5.697-3.823-10.35-3.823z"/>
</svg>`;

async function main() {
  console.log('Generating colored logo GLB files at original SVG scale...\n');

  const laravelParts = svgToGeometries(laravelSvg, 15);
  const laravelGlb = buildGlbFromGeometries(laravelParts, 'Laravel');
  fs.writeFileSync(path.join(modelsDir, 'laravel-transformed.glb'), laravelGlb);
  console.log(`  ✓ laravel-transformed.glb written (${laravelGlb.length} bytes)\n`);

  const phpParts = svgToGeometries(phpSvg, 10);
  const phpGlb = buildGlbFromGeometries(phpParts, 'PHP');
  fs.writeFileSync(path.join(modelsDir, 'php-transformed.glb'), phpGlb);
  console.log(`  ✓ php-transformed.glb written (${phpGlb.length} bytes)\n`);

  console.log('Done!');
}

main().catch(console.error);
