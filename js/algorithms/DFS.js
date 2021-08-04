// var flag = true;
// async function visualizeDFS(grid_array, srcIndex, destIndex) {
//   const prev = [];
//   const state = [];
//   state[srcIndex] = 1;
//   let srcDiv = grid_array[srcIndex];
//   let srcNei = srcDiv.getNei();
//   for (let neiIndex = 0; neiIndex < srcNei.length && flag; neiIndex++) {
//     let nei = srcNei[neiIndex];
//     if (nei == destIndex) {
//       prev[nei] = srcIndex;
//       flag = false;
//       break;
//     }
//     let neiNode = grid_array[nei];
//     let neiDiv = document.querySelector("#square" + neiNode.id);
//     if (
//       typeof state[nei] === "undefined" &&
//       !neiDiv.classList.contains("block")
//     ) {
//       if (nei != srcIndex && nei != destIndex) {
//         $("#square" + nei).attr("type", "check");
//       }
//       await sleep(1);
//       prev[nei] = srcIndex;
//       state[nei] = 1;
//       DFS_visit(grid_array, nei, destIndex, state, prev);
//     }
//   }
//   return prev;
// }

// async function DFS_visit(grid_array, srcIndex, destIndex, state, prev) {
//   console.log(`In DFS Visit with ${srcIndex}`);
//   let srcDiv = grid_array[srcIndex];
//   let srcNei = srcDiv.getNei();
//   for (let neiIndex = 0; neiIndex < srcNei.length && flag; neiIndex++) {
//     let nei = srcNei[neiIndex];
//     if (nei == destIndex) {
//       prev[nei] = srcIndex;
//       flag = false;
//       break;
//     }
//     let neiNode = grid_array[nei];
//     let neiDiv = document.querySelector("#square" + neiNode.id);
//     if (
//       typeof state[nei] === "undefined" &&
//       !neiDiv.classList.contains("block")
//     ) {
//       if (nei != srcIndex && nei != destIndex) {
//         $("#square" + nei).attr("type", "check");
//       }
//       await sleep(1);
//       prev[nei] = srcIndex;
//       state[nei] = 1;
//       DFS_visit(grid_array, nei, destIndex, state, prev);
//     }
//   }
// }

async function visualizeDFS(grid_array, srcIndex, destIndex) {
  const stack = [];
  const prev = [];
  const state = []; // 0 - White, 1 Gray, 2 Black
  stack[0] = srcIndex;
  state[srcIndex] = 1;
  let flag = true;
  while (!stack.length == 0 && flag) {
    let nodeIndex = stack[0];
    let nodeDiv = grid_array[nodeIndex];
    stack.shift();
    if (state[nodeIndex] == 2) continue;
    let nodeNei = nodeDiv.getNei();
    let nei = -1;
    for (let currNeiIndex in nodeNei) {
      let currNei = nodeNei[currNeiIndex];
      let neiNode = grid_array[currNei];
      let neiDiv = document.querySelector("#square" + neiNode.id);
      if (
        typeof state[currNei] === "undefined" &&
        !neiDiv.classList.contains("block")
      ) {
        stack.unshift(nodeIndex);
        nei = currNei;
        break;
      }
    }
    if (nei !== -1) {
      if (nei == destIndex) {
        prev[nei] = nodeIndex;
        flag = false;
        break;
      }
      if (nei != srcIndex && nei != destIndex) {
        $("#square" + nei).attr("type", "check");
      }
      await sleep(1);
      prev[nei] = nodeIndex;
      state[nei] = 1;
      stack.unshift(nei);
    }
  }
  return prev;
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default visualizeDFS;
