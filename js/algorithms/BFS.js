async function visualizeBFS(grid_array, srcIndex, destIndex) {
  const queue = [];
  const prev = [];
  const state = []; // 0 - White, 1 Gray, 2 Black
  let q_index = 0;
  queue[q_index++] = srcIndex;
  state[srcIndex] = 1;
  let flag = true;
  while (!queue.length == 0 && flag) {
    let nodeIndex = queue[0];
    let nodeDiv = grid_array[nodeIndex];
    queue.shift();
    q_index--;
    if (state[nodeIndex] == 2) continue;
    let nodeNei = nodeDiv.getNei();
    for (let neiIndex in nodeNei) {
      let nei = nodeNei[neiIndex];
      if (nei == destIndex) {
        prev[nei] = nodeIndex;
        flag = false;
        break;
      }
      let neiNode = grid_array[nei];
      let neiDiv = document.querySelector("#square" + neiNode.id);
      if (
        typeof state[nei] === "undefined" &&
        !neiDiv.classList.contains("block")
      ) {
        if (nei != srcIndex && nei != destIndex) {
          $("#square" + nei).attr("type", "check");
        }
        await sleep(1);
        prev[nei] = nodeIndex;
        state[nei] = 1;
        queue[q_index++] = nei;
      }
    }
  }
  return prev;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default visualizeBFS;
