"use strict";

var gl;
var positions = [];
var program;
//face % 4 = top = 0, right = 1, bottom = 2, left = 3;
var face = 1000;
var origin;
var cellWidth;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //Generate Maze clicked
    document.getElementById('generateMaze').onclick = function(event) {
        //reset maze points and face direction
        positions = [];
        face = 1000;

        //reads rows & cols from UI
        var rows = parseInt(document.getElementById('rows').value);
        var columns = parseInt(document.getElementById('columns').value);

        //ensures valid row/col inputs
        if (rows <= 0 || columns <= 0){
            alert("Rows and columns must be greater than 0");
            document.getElementById('rows').value = 5;
            document.getElementById('columns').value = 5;
            rows = columns = 5;
        }

        //generate maze & push points into positions
        var maze = new Maze(rows, columns, canvas.width, canvas.height);
        var vertices = maze.vertices;
        for (var i = 0; i < vertices.length; i++) {
            positions.push(vertices[i]);
        }
    
        //draw maze
        renderMaze();
        
        //collect data from maze, cell size, open paths, starting point
        cellWidth = maze.cellWidth;
        var path = maze.path;
        var origin = maze.cells[0][maze.startRow];
        var cellPixel = Math.min(maze.cellHeight, maze.cellWidth)/2;

        //generate original mouse shape at starting point
        var mouseNose = vec2(origin.x, origin.y+cellPixel);
        var mouseLeft = vec2(origin.x - (cellPixel/2), origin.y-cellPixel);
        var mouseRight = vec2(origin.x + (cellPixel/2), origin.y-cellPixel);
        var vertices = [
            mouseNose,
            mouseLeft,
            mouseRight,
        ];

        // draw mouse at starting cell
        renderMouse(vertices);

        //handling mouse movement
        window.onkeydown = function(event) {
            var key = String(event.key);
            switch(key) {
                case "ArrowUp":
                    //boolean for allowing a movement
                    var move = false;
                    //check face for direction, and for open path
                    //validate mouse movement & update move bool
                    if (face%4 == 0) {          //top
                        move = validMove(origin.x, origin.y + 2*maze.cellHeight);
                        if (move)
                            origin.y += 2*maze.cellHeight;
                    } else if (face%4 == 1) {   //right
                        move = validMovePath(origin.x, origin.y, path);
                        if (move)
                            origin.x += 2*maze.cellWidth;
                    } else if (face%4 == 2) {   //bot
                        move = validMove(origin.x, origin.y -  2*maze.cellHeight);
                        if (move)
                            origin.y -= 2*maze.cellHeight;
                    } else if (face%4 == 3) {   //left
                        move = validMovePath(origin.x - 2*maze.cellWidth, origin.y, path);
                        move &= validMove(origin.x - 2*maze.cellWidth, origin.y);
                        if (move)
                            origin.x -= 2*maze.cellWidth;
                    }
                    //if valid movement, update mouse's position
                    if (move)
                        vertices = moveMouse(face, origin, cellPixel);
                    break;
                case "ArrowLeft":
                    //rotate mouse counter-clockwise & update face
                    vertices = rotate(origin, vertices, true);
                    face--;
                    break;
                case "ArrowRight":
                    //rotate mouse clockwise & update face
                    vertices = rotate(origin, vertices, false);
                    face++;
                    break;
            }
            //redraw maze and mouse updating together
            renderMaze();
            renderMouse(vertices);
        }
    }
};

function renderMaze() {
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);
    
    // Associate out shader variables with our data buffer & draw
    var aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    gl.drawArrays(gl.LINES, 0, positions.length);
};

function renderMouse(vertices) {    
    //  Load data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    //  Associate out shader variables with our data buffer & draw
    var aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
};