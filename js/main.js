import Node from "./node.js";
import visualizeBFS from "./algorithms/BFS.js";
import visualizeDFS from "./algorithms/DFS.js";
import visualizeBBFS from "./algorithms/B-BFS.js";

const grid_array = [];
var srcNode;
var destNode;
var mouseDown = false;
var selectedButton = "select-src";
var algo = "bfs";

const buildGrid = function () {
  const gridContinaer = document.querySelector(".grid-container");
  for (var i = 0; i < 1750; i++) {
    var node = document.createElement("div");
    var squareID = "square" + i;
    node.setAttribute("class", "square");
    node.setAttribute("type", "not-selected");
    node.setAttribute("id", squareID);
    var curr = new Node(i);
    gridContinaer.appendChild(node);
    //Left
    if (i - 1 >= 0 && i % 70 != 0) {
      curr.addNi(i - 1);
    }
    //Right
    if (i + 1 >= 0 && (i + 1) % 70 != 0) {
      curr.addNi(i + 1);
    }
    //Buttom Center
    if (i + 70 < 1750) {
      curr.addNi(i + 70);
    }
    //Top Center
    if (i - 70 >= 0) {
      curr.addNi(i - 70);
    }
    grid_array[i] = curr;
  }
};
buildGrid();

$(".square").on("click", function (elem) {
  switch (selectedButton) {
    case "select-src":
      selectSrc(elem);
      break;
    case "select-dest":
      selectDest(elem);
      break;
    case "add-block":
      addBlock(elem);
      break;
    default:
      selectSrc(elem);
      break;
  }
});

const selectSrc = function (elem) {
  const clickedNode = elem.target;
  if (srcNode) {
    srcNode.classList.remove("src");
    clickedNode.setAttribute("type", "not-selected");
  }
  clickedNode.classList.add("src");
  clickedNode.setAttribute("type", "selected");
  srcNode = clickedNode;
};

const selectDest = function (elem) {
  const clickedNode = elem.target;
  if (destNode) {
    destNode.classList.remove("dest");
    clickedNode.setAttribute("type", "not-selected");
  }
  clickedNode.classList.add("dest");
  clickedNode.setAttribute("type", "selected");
  destNode = clickedNode;
};

$(".option-button").on("click", function (elem) {
  const clickedButton = elem.target;
  selectedButton = clickedButton.id;
  switch (selectedButton) {
    case "visualize":
      visualize();
      break;
    case "clean-board":
      cleanBoard();
      break;
    case "random-maze":
      createRandomMaze();
      break;
    case "select-algo":
      let list = document.querySelector(".algo-list");
      if (list.style.display === "none" || !list.style.display) {
        list.style.display = "block";
      } else {
        list.style.display = "none";
      }
      break;
    default:
      break;
  }
});

$("#visualize >*").click(function (elem) {
  if (!document.querySelector("#visualize").disabled) {
    visualize();
  }
});
$(".algo-button").on("click", function (elem) {
  const clickedButton = elem.target;
  algo = clickedButton.id;
  document.querySelector(".algo-list").style.display = "none";
});

const addBlock = function (elem) {
  const clickedNode = elem.target;
  if (
    !clickedNode.classList.contains("src") &&
    !clickedNode.classList.contains("dest")
  ) {
    clickedNode.classList.add("block");
    clickedNode.setAttribute("type", "selected");
  }
};

$(".square").mousedown(function () {
  mouseDown = true;
});
$(document).mouseup(function () {
  mouseDown = false;
});

$(".square").hover(function (elem) {
  if (mouseDown && selectedButton === "add-block") {
    addBlock(elem);
  }
});

const visualize = async function () {
  console.log("Visualize");
  if (!srcNode) {
    alert("Missing Source Node");
    return;
  } else if (!destNode) {
    alert("Missing Destination Node");
  }
  if (document.querySelector(".square[type='check']")) {
    console.log("Check");
    cleanPathAndCheck();
  }
  document.querySelectorAll(".option-button").forEach((elem) => {
    elem.disabled = true;
  });
  const srcNodeDiv = document.querySelector(".src");
  const destNodeDiv = document.querySelector(".dest");
  const srcIndex = srcNodeDiv.id.substring(6);
  const destIndex = destNodeDiv.id.substring(6);
  let prev = [];
  let path = [];
  switch (algo) {
    case "bfs":
      // await visualizeBFS(srcIndex, destIndex).then((result) => {
      //   prev = result;
      // });
      await visualizeBFS(grid_array, srcIndex, destIndex).then((result) => {
        prev = result;
      });
      break;

    case "dfs":
      // await visualizeBFS(srcIndex, destIndex).then((result) => {
      //   prev = result;
      // });
      await visualizeDFS(grid_array, srcIndex, destIndex).then((result) => {
        prev = result;
      });
      break;
    case "b-bfs":
      // await visualizeBFS(srcIndex, destIndex).then((result) => {
      //   prev = result;
      // });
      let cross;
      await visualizeBBFS(grid_array, srcIndex, destIndex).then(
        (result) => {
          cross = result[2];
          let pathReverse = reconstructPath(result[1], destIndex, cross);
          prev = result[0];
          console.log("pathReves: " + pathReverse);
          for (let i in pathReverse) {
            prev[result[1][pathReverse[i]]] = pathReverse[i];
          }
        }
      );
      break;
  }
  console.log(prev);
  path = await reconstructPath(prev, srcIndex, destIndex);
  console.log(path);
  await visualizePath(path);
  document.querySelectorAll(".option-button").forEach((elem) => {
    elem.disabled = false;
  });
};

const reconstructPath = function (prev, srcIndex, destIndex) {
  var path_temp = [];
  var path = [];
  path_temp.push(destIndex);
  for (var i = destIndex; typeof prev[i] != "undefined"; i = prev[i]) {
    console.log("pushing: " + path_temp[i]);
    path_temp.push(prev[i]);
  }
  if (!(path_temp.length == 0) && path_temp[path_temp.length - 1] == srcIndex) {
    for (var i = path_temp.length - 1; i >= 0; i--) {
      console.log("pushing: " + path_temp[i]);
      path.push(path_temp[i]);
    }
  }
  console.log("path Inside " + path);
  return path;
};

const visualizePath = async function (path) {
  console.log("Here 2");
  console.log(path);
  for (var i = 1; i < path.length - 1; i++) {
    await sleep(15);
    console.log(".square" + path[i]);
    $("#square" + path[i]).attr("type", "path");
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const cleanBoard = function () {
  for (let node in grid_array) {
    const nodeid = grid_array[node].id;
    const nodeDiv = document.querySelector("#square" + nodeid);
    nodeDiv.classList = "square";
    nodeDiv.setAttribute("type", "not-selected");
  }
  srcNode = null;
  destNode = null;
};

const cleanPathAndCheck = function () {
  for (let node in grid_array) {
    const nodeid = grid_array[node].id;
    const nodeDiv = document.querySelector("#square" + nodeid);
    if (
      !nodeDiv.getAttribute("type") == "check" &&
      !nodeDiv.getAttribute("type") == "path"
    )
      nodeDiv.classList = "square";
    nodeDiv.setAttribute("type", "not-selected");
  }
};

const cleanBoardWithouSrcAndDest = function () {
  for (let node in grid_array) {
    const nodeid = grid_array[node].id;
    const nodeDiv = document.querySelector("#square" + nodeid);
    if (
      !nodeDiv.classList.contains("src") &&
      !nodeDiv.classList.contains("dest")
    )
      nodeDiv.classList = "square";
    nodeDiv.setAttribute("type", "not-selected");
  }
};

const createRandomMaze = async function () {
  cleanBoardWithouSrcAndDest();
  let numBlocks = 0;
  while (numBlocks != 500) {
    let randNode = Math.floor(Math.random() * 1750);
    const nodeid = grid_array[randNode].id;
    const nodeDiv = document.querySelector("#square" + nodeid);
    if (
      !nodeDiv.classList.contains("src") &&
      !nodeDiv.classList.contains("dest") &&
      !nodeDiv.classList.contains("block")
    ) {
      nodeDiv.classList.add("block");
      numBlocks++;
      // await sleep(1);
    }
  }
};
