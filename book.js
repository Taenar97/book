var c = document.getElementById("graph");
c.height = c.clientHeight;
c.width = c.clientWidth;
var ctx = c.getContext("2d");
ctx.webkitImageSmoothingEnabled=true;
ctx.lineWidth = 0.3;
let graph = [];  
let r = 20;
var back = document.getElementById("back");
var finished = undefined;

//Fires when page and all resources are loaded e.g. Script should start
window.onload = (event) => {
    loadContent("markdown/Welcome.md");
    loadGraph("markdown/");
};

//Hover effect
c.addEventListener('mousemove', e => {
    x = e.offsetX;
    y = e.offsetY;
    tooltip = document.getElementById("tooltip");
    for (node of graph) {
        for( let i = 0; i < 5; i++) {//Necessary loop for clean display of nodes...
            drawNode(node.x, node.y, node.name, "white", "white");
        }
        if ((x >= node.x - r && x <= node.x + r) && (y >= node.y - r && y <= node.y + r) ) {//Nodes is selected
            drawNode(node.x, node.y, node.name, "red", "red");
            document.body.style.cursor = 'pointer';
            tooltip.style.visibility = "visible";
            tooltip.innerHTML = node.description;                       
            tooltip.style.top = (y - 42) + "px";
            tooltip.style.left = x  + "px";
            break;
        } else {//Node is not selected
            if(localStorage.getItem(localStorage.getItem("graph") +  node.path) == "true") {//Check in local storage if node is already finished, in progress or not visited
                drawNode(node.x, node.y, node.name, "green");
            } else if (localStorage.getItem(localStorage.getItem("graph") + node.path) == "false"){
                drawNode(node.x, node.y, node.name, "yellow");
            } else {
                drawNode(node.x, node.y, node.name);
            }
            document.body.style.cursor = 'default';
            tooltip.style.visibility = "hidden";
        }
    }
});

//Node click functionality
c.addEventListener('click', e => {
    x = e.offsetX;
    y = e.offsetY;
    for (node of graph) {
        
        if ((x >= node.x - r && x <= node.x + r) && (y >= node.y - r && y <= node.y + r) ) {//Nodes is selected
            for( let i = 0; i < 5; i++) {//Necessary loop for clean display of nodes...
                drawNode(node.x, node.y, node.name, "white", "white");
            }
            if ( node.type == "link") {
                loadGraph(localStorage.getItem("graph") + node.path);
                back.style.visibility = "visible";
            } else if ( node.type == "leave") {
                loadContent(localStorage.getItem("graph") + node.path);
            }
            break;
        } 
    }
});

//Back button functionality
back.addEventListener('click', e => {
    if( localStorage.getItem("graph") != "markdown/") {
        path = localStorage.getItem("graph").split("/");
        old = "";
        for (part of path.slice(0, -2)) {
            old += part;
        }
        old += "/";
        loadGraph(old);
        if ( old == "markdown/") {
            back.style.visibility = "hidden";
        }
    }
        
});

//Logo click functionality
logo = document.getElementById("logo");
logo.addEventListener('click', e => {
    loadContent("markdown/Welcome.md");
});

/**
 * Draws a graph.
 * @param {*} graph The graph to be drawn.
 */
function drawGraph(graph) {
    ctx.clearRect(0, 0, c.width, c.height);    
    drawEdges(graph);
    drawNodes(graph);
}

/**
 * Function for drawing the Nodes of a graph onto the canvas.
 * @param {*} graph Array containing all information about a graph.
 */
function drawNodes(graph) {
    for ( const node of graph ) {
        if(localStorage.getItem(localStorage.getItem("graph") +  node.path) == "true") {//Check in local storage if node is already finished, in progress or not visited
            drawNode(node.x, node.y, node.name, "green");
        } else if (localStorage.getItem(localStorage.getItem("graph") + node.path) == "false"){
            drawNode(node.x, node.y, node.name, "yellow");
        } else {
            drawNode(node.x, node.y, node.name);
        }
    }  
}

/**
 * Draws the edges of a graph onto the canvas.
 * @param {*} graph Array containing all information about a graph.
 */
function drawEdges(graph) {
    for( const node of graph ) {                
        for ( edge of node.neighbours ) {            
            neighbour = graph.find(function(node) {
                return edge == node.name;
            });            
            drawEdge(node.x, node.y, neighbour.x, neighbour.y);
        }
    }
}

/**
 * Draws an edge between two nodes.
 * @param {*} f_lane Lane of the starting node.
 * @param {*} f_level Level of the starting node.
 * @param {*} t_lane Lane of the ending node.
 * @param {*} t_level Level of the ending node.
 * @param {*} color Optional color for the edge.
 */
function drawEdge(f_lane, f_level, t_lane, t_level, color = "black") {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(f_lane,f_level);
    ctx.lineTo(t_lane, t_level);
    ctx.stroke();
    ctx.closePath();    
}

/**
 * Draws a node.
 * @param {*} x The Lane of the node.
 * @param {*} y The Level of the node.
 * @param {*} text The text displayed inside the node.
 * @param {*} color Optional color for the node.
 * @param {*} stroke Optional line color for the node.
 */
function drawNode(x, y, text, color = "white", stroke = "black") {
    ctx.beginPath();
    ctx.strokeStyle = stroke;
    ctx.arc(x, y, r, 0, 2 * Math.PI);//arc(x,y,radius, startAngle, endAngle)
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white"    
    ctx.fill();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y); 
    ctx.stroke();
    ctx.closePath();
}

/**
 * Loads a graph array from a given folder.
 * @param {string} path Path of the folder containing the graph.
 * @returns A graph as an array of nodes.
 */
async function loadGraph(path) {
    await loadFile(path + "graph.txt")//Meta file contains node data like positions(x,y),name, neighbours, type & path (relative e.g. "content.md")
        .then(function(data) {
            if (data != "") {
                graph = convertGraphData(data);
                localStorage.setItem("graph", path);//Saves the path of the folder for the current graph
                drawGraph(graph);
            }
            
        }, function (error) {
            console.log("An error occured while loading the graph: " + error);            
        });           
}

/**
 * Converts given graph data into a usable graph array containing node objects.
 * @param {string} data The graph data to convert. 
 * @returns Graph array with node objects.
 */
function convertGraphData(data) {
    const data_array = data.split("\n");
    const graph_array = [];

    //Lanes for 3  (centered) & 4 (evenly) items in px
    const t = [40,120,200]; 
    const f = [30, 90, 150, 210];

    //Levels in px
    const l = [];
    for (let i = 0; i < 10; i++) {
        l[i] = 60 + 90*i;
    }

    for( edge of data_array ) {
        const elements = edge.split(",").map(element => element.trim());
        node = {
            x: 0,
            y: l[parseInt(elements[1])], 
            name: elements[2], 
            neighbours: [], 
            type: elements[4], 
            path:  elements[5],
            description: elements[6],
            isNeighbour: function(node) {
                return this.name == node.name;
            }
        };      

        switch (elements[0]) {
            case "t0":
                node.x = t[0];
                break;
            case "t1":
                node.x = t[1];
                break;
            case "t2":
                node.x = t[2];
                break;
            case "f0":
                node.x = f[0];
                break;
            case "f1":
                node.x = f[1];
                break;
            case "f2":
                node.x = f[2];
                break;       
            case "f3":
                node.x = f[3];
                break;
            default:
                console.log("Error while converting the read x value of a node: " + elements[0]);
                break;
        }
        if( elements[3].length != 0) {
            node.neighbours = elements[3].split(";").map(element => element.trim());
        }        
        graph_array.push(node);
    }
    return graph_array; 
}

/**
 * Loads the content (.md) found at a given path into the content div of the site.
 * @param {string} path The path of the content file (.md) to load
 */
async function loadContent(path) {
    await loadFile(path)
        .then( function(data) {
            converter = new showdown.Converter();
            converter.setOption('tables', 'true');
            html = converter.makeHtml(data);
            document.getElementById('content').innerHTML = html;
            if( path != "markdown/Welcome.md") {
                if (localStorage.getItem(path) == null) { //Mark unfinished, though viewed nodes yellow
                    localStorage.setItem(path, false);
                }                
                if (!areAllNodesFinished()) { //Mark link node above as viewed                     
                    localStorage.setItem(getFolder(path), false);
                }
                document.getElementById('content').innerHTML += '<button id="finished">Finished!</button>';
                finished = document.getElementById("finished");
                finished.addEventListener('click', e => {
                    localStorage.setItem(localStorage.getItem("active_node"), true);                                                           
                    if (areAllNodesFinished()) {//sets link node above green if all nodes are finished
                        localStorage.setItem(getFolder(path), true);
                    }                    
                });
            }            
            localStorage.setItem("active_node", path);
        }, function (error) {
            console.log("An error occured while loading the content file: " + error)
        });
}

/**
 * Function which loads a document via AJAX. Using Promises to return the value once received (Async).
 * @param {string} path The path of the file to be loaded.
 * @returns A Promise for the contents of the file as txt. (See 'Promise' documentation).
 */
function loadFile(path) {
    return new Promise(function(resolve, reject) {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
            resolve( this.responseText);
        }
        xhttp.onerror = reject;   
        xhttp.open("GET", path, true);
        xhttp.send();
    })
}

/**
 * Determines wheter all nodes of the current tree are finished or not.
 * @returns true if all nodes are finished, false if not.
 */
 function areAllNodesFinished() {
    allDone = true;
    for (node of graph) {
        if (localStorage.getItem(localStorage.getItem("graph") + node.path) != "true") {
            allDone = false;
        }
    }
    return allDone;
}

/**
 * Determines the upper folder of a given path.
 * @param {string} path The path of which to isolate the higher level from.
 * @returns The path one level higher.
 */
function getFolder(path) {
    pathOfFolder = path.split("/");
    folder = "";
    for (let i = 0; i < pathOfFolder.length - 1; i++) {
        folder += pathOfFolder[i] + "/";
    }
    return folder;
}




