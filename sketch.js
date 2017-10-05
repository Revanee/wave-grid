const points = []

const gridWidth = Math.floor(window.innerWidth / 10)
const gridHeight = Math.floor(window.innerHeight / 10)

let getCellWidth = function () {return width / gridWidth}
let getCellHeight = function () {return height / gridHeight}

setup = function () {
    createCanvas(window.innerWidth, window.innerHeight, WEBGL)
    for (let x = 0; x < gridWidth; x++) {
        points.push([])
        for (let y = 0; y < gridHeight; y++) {
            points[x].push(new Point())
        }
    }
}

draw = function () {

    //update
    points.forEach(function (col, x) {
        col.forEach(function (point, y) {
            let left = points[x - 1] ? points[x - 1][y].val : null
            let right = points[x + 1] ? points[x + 1][y].val : null
            let up = points[x][y - 1] ? points[x][y - 1].val : null
            let down = points[x][y + 1] ? points[x][y + 1].val : null
            let side = left + right ? left + right : null
            let vert = up + down ? up + down : null
            let adj = side + vert ? side + vert : null
            point.update(adj)
        })
    })

    if (mouseIsPressed) {
        let x = Math.floor(mouseX / (width / gridWidth))
        let y = Math.floor(mouseY / (height / gridHeight))
        if (x >= 0 && y >= 0 && x < gridWidth && y < gridHeight) {
            points[x][y].nextVal = 50
            points[x][y].force = 0
        }
    }

    points.forEach(function (col) {
        col.forEach(function (point) {
            point.step()
        })
    })

    //draw
    rotateX(PI * -0.20)
    translate(0, -height / 10)
    translate(-width / 2 + (width / gridWidth) / 2, -height / 2 + (height / gridHeight) / 2)
    background(30)

    // push()
    // points.forEach(function(col, x) {
    //     col.forEach(function (point, y) {
    //         translate(0, 0, point.val)
    //         box(10)
    //         translate(0, 0, -point.val)
    //         translate(0, getCellHeight())
    //     })
    //     translate(getCellWidth(), 0)
    //     translate(0, -getCellHeight() * col.length)
    // })
    // pop()

    for (let x = 0; x < gridWidth - 1; x++) {
        fill('#42f4eb')
        beginShape()
        for (let y = 0; y < gridHeight - 1; y++) {
            let scl = 5
            vertex(x * width / gridWidth, y * height / gridHeight, points[x][y].val * scl)
            vertex((x + 1) *  width / gridWidth, y * height / gridHeight, points[x + 1][y].val * scl)
            vertex(x * width / gridWidth, (y + 1) * height / gridHeight, points[x][y + 1].val * scl)
            vertex(x * width / gridWidth, y * height / gridHeight, points[x][y].val * scl)
            // vertex((x + 1) *  width / gridWidth, (y + 1) * height / gridHeight, points[x + 1][y + 1].val)
        }
        endShape()
    }
}

class Point {
    constructor () {
        this.val = 0
        this.nextVal = 0
        this.force = 0
    }
    update (adj) {
        adj = adj ? adj : 0
        this.force -= this.val
        this.force += ((adj / 2) - this.val)
        this.nextVal += this.force * 0.1
        this.force *= 0.99
    }
    step () {
        this.val = this.nextVal
    }
}
