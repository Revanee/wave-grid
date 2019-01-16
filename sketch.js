const MODE = 1 // 1: Wireframe; 2: Cubes

const FLUIDITY = 0.99 // 0 < x < 1 TIP: 1 means no loss in time
const SPEED = 0.2 // 0 < x < 1 WARNING! High values make the simulation unstable
const INTERACTION_STRENGTH = -50 // How muck force is given to a clicked point
const MIN_AMMOUNT = 50 // Ammount of points on the shorter side of the grid

const ASPECT_RATIO = window.innerWidth / window.innerHeight

const GRID_HEIGHT = (ASPECT_RATIO > 1) ? MIN_AMMOUNT : Math.floor(MIN_AMMOUNT / ASPECT_RATIO)
const GRID_WIDTH = (ASPECT_RATIO > 1) ? Math.floor(MIN_AMMOUNT * ASPECT_RATIO) : MIN_AMMOUNT

const POINT_MARGIN = Math.min(window.innerWidth, window.innerHeight) / Math.min(GRID_HEIGHT, GRID_WIDTH)

const points = []

function setup () {
    createCanvas(window.innerWidth, window.innerHeight, WEBGL)
    for (let x = 0; x < GRID_WIDTH; x++) {
        points.push([])
        for (let y = 0; y < GRID_HEIGHT; y++) {
            points[x].push(new Point())
        }
    }
}

function draw () {

    //update
    calculate()
    interact()
    step()

    //draw
    background(30)

    rotateX(PI * -0.20)
    translate(0, -height / 10)
    translate(-width / 2 + POINT_MARGIN / 2, -height / 2 + POINT_MARGIN / 2)

    switch (MODE) {
        case 1: drawWireframe()
        break
        case 2: drawCubes()
        break
    }

}

function interact () {
    if (mouseIsPressed) {
        let x = Math.floor(mouseX / POINT_MARGIN)
        let y = Math.floor(mouseY / POINT_MARGIN)
        if (x >= 0 && y >= 0 && x < GRID_WIDTH && y < GRID_HEIGHT) {
            points[x][y].nextVal = INTERACTION_STRENGTH
            points[x][y].force = 0
        }
    }
}

function calculate () {
    points.forEach(function (col, x) {
        col.forEach(function (point, y) {
            let left = points[x - 1] ? points[x - 1][y].val : null
            let right = points[x + 1] ? points[x + 1][y].val : null
            let up = points[x][y - 1] ? points[x][y - 1].val : null
            let down = points[x][y + 1] ? points[x][y + 1].val : null
            let adj = left + right + up + down ? left + right + up + down : null
            point.update(adj)
        })
    })
}

function step () {
    points.forEach(function (col) {
        col.forEach(function (point) {
            point.step()
        })
    })
}

function drawCubes () {
    push()
    points.forEach(function(col, x) {
        col.forEach(function (point, y) {
            translate(0, 0, point.val)
            box(10)
            translate(0, 0, -point.val)
            translate(0, POINT_MARGIN)
        })
        translate(POINT_MARGIN, 0)
        translate(0, -POINT_MARGIN * col.length)
    })
    pop()
}

function drawWireframe () {
    fill('#42f4eb')
    for (let x = 0; x < GRID_WIDTH - 1; x++) {
        beginShape()
        for (let y = 0; y < GRID_HEIGHT - 1; y++) {
            let scl = 5
            vertex(x * POINT_MARGIN, y * POINT_MARGIN, points[x][y].val * scl)
            vertex((x + 1) *  POINT_MARGIN, y * POINT_MARGIN, points[x + 1][y].val * scl)
            vertex(x * POINT_MARGIN, (y + 1) * POINT_MARGIN, points[x][y + 1].val * scl)
            vertex(x * POINT_MARGIN, y * POINT_MARGIN, points[x][y].val * scl)
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
        this.nextVal += this.force * SPEED
        this.force *= FLUIDITY
    }
    step () {
        this.val = this.nextVal
    }
}
