class Maze {
    // number of rows, columns, canvas width, and canvas height
    constructor(rows, columns, width, height) {
        this.rows = columns;
        this.columns = rows;
        this.width = width;
        this.height = height;
        // cell width and height in canvas sizing
        this.cellWidth = this.width / this.rows / this.width;
        this.cellHeight = this.height / this.columns / this.height;
        // creates cells for our maze, defines path, returns vertices to draw
        this.cells = createCells(this);
        this.startRow = Math.floor(Math.random() * this.columns);
        var mazeStuff = drawMaze(this);
        this.vertices = mazeStuff[0];
        this.path = mazeStuff[1];
    }
}

var createCells = function (self) {
    var cells = [];
    for (var i = 0; i < self.rows; i++) {
        cells.push([]);
        row = cells[i];
        for (var j = 0; j < self.columns; j++) {
            var x = -1 + ((i*2+1) * self.cellWidth); 
            var y = 1 - ((j*2+1) * self.cellHeight);
            var cell = new Cell(x, y, self.cellWidth, self.cellHeight);
            row.push(cell);
        }
    }
    return cells;
}

class Cell {
    constructor(x, y, cellWidth, cellHeight) {
        this.x = x;
        this.y = y;
        //Coordinates of the 4 corners of a cell
        this.tl = vec2(x - cellWidth, y + cellHeight);
        this.tr = vec2(x + cellWidth, y + cellHeight);
        this.bl = vec2(x - cellWidth, y - cellHeight);
        this.br = vec2(x + cellWidth, y - cellHeight);
    }
}

var drawMaze = function (self) {
    var vertices = [
        //top border line
        vec2(-1,1),
        vec2(1,1),
        //bottom border line
        vec2(-1,-1),
        vec2(1, -1),
    ];
    // holds the coordinates of the paths between each column
    path = [];
    // draws the left border line & randomly chooses a starting cell
    for (var i = 0; i < self.columns; i ++) {
        var cell = self.cells[0][i];
        if (i.valueOf() != self.startRow.valueOf()) {
            vertices.push(cell.tl);
            vertices.push(cell.bl);
        } else {
            this.startRow = cell;
        }
    }
    // draws the rest of the horizontal lines and randomly chooses an 
    // open path between each column, as well as the exit cell
    for (var i = 0; i < self.rows; i ++) {
        rand = Math.floor(Math.random() * self.columns);
        for (var j = 0; j < self.columns; j++) {
            var cell = self.cells[i][j];
            if (j.valueOf() != rand.valueOf()){
                vertices.push(cell.br);
                vertices.push(cell.tr);
            } else {
                // stores the open path cells 
                path.push(vec2(cell.tr[1], cell.br[1]));
            }
        }
    }
    return [vertices, path];
}