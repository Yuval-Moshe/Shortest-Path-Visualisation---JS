async function visualizeBBFS(grid_array, srcIndex, destIndex) {
  const queueSrc = [];
  let prevSrc = [];
  const stateSrc = []; // 0 - White, 1 Gray, 2 Black
  const queueDest = [];
  let prevDest = [];
  const stateDest = []; // 0 - White, 1 Gray, 2 Black
  let q_indexSrc = 0;
  let q_indexDest = 0;
  queueSrc[q_indexSrc++] = srcIndex;
  stateSrc[srcIndex] = 1;
  queueDest[q_indexDest++] = destIndex;
  stateDest[destIndex] = 1;
  let crossNode = -1;
  let flag = true;
  while (!queueSrc.length == 0 && flag) {
    let nodeIndexSrc = queueSrc[0];
    let nodeDivSrc = grid_array[nodeIndexSrc];
    queueSrc.shift();
    q_indexSrc--;
    if (stateSrc[nodeIndexSrc] == 2) continue;
    stateSrc[nodeIndexSrc] = 2;
    let nodeNeiSrc = nodeDivSrc.getNei();
    for (let neiIndex in nodeNeiSrc) {
      let nei = nodeNeiSrc[neiIndex];
      if (nei == destIndex) {
        prevSrc[nei] = nodeIndexSrc;
        flag = false;
        break;
      }
      let neiNode = grid_array[nei];
      let neiDiv = document.querySelector("#square" + neiNode.id);
      if (
        typeof stateSrc[nei] === "undefined" &&
        !neiDiv.classList.contains("block")
      ) {
        if (nei != srcIndex && nei != destIndex) {
          $("#square" + nei).attr("type", "check");
        }
        await sleep(1);
        prevSrc[nei] = nodeIndexSrc;
        stateSrc[nei] = 1;
        queueSrc[q_indexSrc++] = nei;
      }
    }
    let nodeIndexDest = queueDest[0];
    let nodeDivDest = grid_array[nodeIndexDest];
    queueDest.shift();
    q_indexDest--;
    if (stateDest[nodeIndexDest] == 2) continue;
    stateDest[nodeIndexDest] = 2;
    let nodeNeiDest = nodeDivDest.getNei();
    for (let neiIndex in nodeNeiDest) {
      let nei = nodeNeiDest[neiIndex];
      if (nei == srcIndex) {
        prevDest[nei] = nodeIndexDest;
        flag = false;
        break;
      }
      let neiNode = grid_array[nei];
      let neiDiv = document.querySelector("#square" + neiNode.id);
      if (
        typeof stateDest[nei] === "undefined" &&
        !neiDiv.classList.contains("block")
      ) {
        if (nei != srcIndex && nei != destIndex) {
          $("#square" + nei).attr("type", "check");
        }
        await sleep(1);
        prevDest[nei] = nodeIndexDest;
        stateDest[nei] = 1;
        queueDest[q_indexDest++] = nei;
      }
    }
    if (typeof stateSrc[nodeIndexDest] !== "undefined") {
      crossNode = nodeIndexDest;
      break;
    }
  }
  //   for (let i in prevDest) {
  //     if (typeof prevSrc[prevDest[i]] === "undefined") {
  //       prevSrc[prevDest[i]] = i;
  //     }
  //   }
  return [prevSrc, prevDest, crossNode];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export default visualizeBBFS;
