// for rotating the mouse to the left or right
function rotate(origin, vertices, left) {
    // left
    if (left) {
        vertices[0] = rotateHelper(origin.x, origin.y, vertices[0][0], vertices[0][1], -90);
        vertices[1] = rotateHelper(origin.x, origin.y, vertices[1][0], vertices[1][1], -90);
        vertices[2] = rotateHelper(origin.x, origin.y, vertices[2][0], vertices[2][1], -90);
    } else {    // right
        vertices[0] = rotateHelper(origin.x, origin.y, vertices[0][0], vertices[0][1], 90);
        vertices[1] = rotateHelper(origin.x, origin.y, vertices[1][0], vertices[1][1], 90);
        vertices[2] = rotateHelper(origin.x, origin.y, vertices[2][0], vertices[2][1], 90);
    }
    return vertices;
}

// for rotating specify points about an origin point
function rotateHelper(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle;
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);
    var nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
    var ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return vec2(nx, ny);
}

// for translating the mouse's coordinates by the size of a cell,
// depending on direction faced
function moveMouse(face, origin, cellPixel) {
    var vertices = [];
    if (face%4 == 0) {          //top
        vertices[0] = vec2(origin.x, origin.y+cellPixel);
        vertices[1] = vec2(origin.x - (cellPixel/2), origin.y-cellPixel);
        vertices[2] = vec2(origin.x + (cellPixel/2), origin.y-cellPixel);
    } else if (face%4 == 1) {   //right
        vertices[0] = vec2(origin.x + cellPixel, origin.y);
        vertices[1] = vec2(origin.x - cellPixel, origin.y+(cellPixel/2));
        vertices[2] = vec2(origin.x - cellPixel, origin.y-(cellPixel/2));
    } else if (face%4 == 2) {   //bottom
        vertices[0] = vec2(origin.x, origin.y-cellPixel);
        vertices[1] = vec2(origin.x - (cellPixel/2), origin.y+cellPixel);
        vertices[2] = vec2(origin.x + (cellPixel/2), origin.y+cellPixel);
    } else if (face%4 == 3) {   //left
        vertices[0] = vec2(origin.x - cellPixel, origin.y);
        vertices[1] = vec2(origin.x + cellPixel, origin.y+(cellPixel/2));
        vertices[2] = vec2(origin.x + cellPixel, origin.y-(cellPixel/2));
    }
    return vertices;
}

// checks for movement outside of the maze
function validMove(x, y) {
    if (x < -1 || x > 1 || y < -1 || y > 1) {
        return false;
    }
    return true;
}

// checks for movement through walls
function validMovePath(x,y,path){
    var colIndex = 0;
    var incr = cellWidth*2;
    for (var check = -1+incr; check <= 1; check += incr) {
        if (x <= check) {
            var yMin = Math.min(path[colIndex][0],path[colIndex][1]);
            var yMax = Math.max(path[colIndex][0],path[colIndex][1]);
            if (y >= yMin && y <= yMax) {
                return true;
            }
            break;
        }
        colIndex ++;
    }  
    return false;
}